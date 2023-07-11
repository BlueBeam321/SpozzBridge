import { ethers, BigNumber } from "ethers";
import { addresses, BNB_FEE } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as tazorStaking } from "../abi/tazorStaking.json";
import { abi as StakingHelperABI } from "../abi/StakingHelper.json";
import { clearPendingTxn, fetchPendingTxns, getStakingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import {
  IBaseAsyncThunk,
  IActionValueAsyncThunk,
  IChangeApprovalAsyncThunk,
  IChangeApprovalWithVersionAsyncThunk,
  IJsonRPCError,
} from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20, OlympusStakingv2__factory, OlympusStaking__factory, StakingHelper } from "src/typechain";
import ReactGA from "react-ga";
import { SystemUpdateAltSharp } from "@material-ui/icons";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

function alreadyApprovedToken(
  token: string,
  stakeAllowance: BigNumber,
  unstakeAllowance: BigNumber,
  stakeAllowanceV2: BigNumber,
  unstakeAllowanceV2: BigNumber,
  version2: boolean,
) {
  // set defaults
  let bigZero = BigNumber.from("0");
  let applicableAllowance = bigZero;
  // determine which allowance to check
  if (token === "ohm" && version2) {
    applicableAllowance = stakeAllowanceV2;
  } else if (token === "sohm" && version2) {
    applicableAllowance = unstakeAllowanceV2;
  } else if (token === "ohm") {
    applicableAllowance = stakeAllowance;
  } else if (token === "sohm") {
    applicableAllowance = unstakeAllowance;
  }

  // check if allowance exists
  if (applicableAllowance.gt(bigZero)) return true;

  return false;
}

export const onClaim = createAsyncThunk(
  "stake/onClaim",
  async ({ networkID, provider, address }: IBaseAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const tazorStakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      tazorStaking,
      signer,
    );

    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: "",
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      stakeTx = await tazorStakingContract.unstakeTaz(0, {
        value: ethers.utils.parseEther(BNB_FEE),
      });
      uaData.type = "taz claim";
      const pendingTxnType = "TAZ claim";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: uaData.type, type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(error("You must have vault authority."));
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "Claiming",
          action: uaData.type ?? "unknown",
          value: parseFloat(uaData.value),
          label: uaData.txHash ?? "unknown",
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
export const changeApproval = createAsyncThunk(
  "stake/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const tazorContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer);
    const tazContract = new ethers.Contract(addresses[networkID].TAZ_ADDRESS as string, ierc20ABI, signer);
    const akeContract = new ethers.Contract(addresses[networkID].DAI_ADDRESS as string, ierc20ABI, signer);

    let approveTx;
    let tazorAllowance = await tazorContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    let tazAllowance = await tazContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

    try {
      if (token === "tazor") {
        // won't run if wrapAllowance > 0
        approveTx = await tazorContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("10000000000", "gwei"),
        );

        const text = "Approve TAZOR";
        const pendingTxnType = "approve_TAZOR";
        if (approveTx) {
          dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
          await approveTx.wait();
          dispatch(info("Successfully Approved!"));
        }
        // go get fresh allowances
        tazorAllowance = await tazorContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      } else if (token === "taz") {
        approveTx = await tazContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("10000000000", "gwei"), //ether"),
        );

        const text = "Approve TAZ";
        const pendingTxnType = "approve_TAZ";
        if (approveTx) {
          dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));
          await approveTx.wait();
          dispatch(info("Successfully Approved!"));
        }

        // go get fresh allowances
        tazAllowance = await tazContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      }

      return dispatch(
        fetchAccountSuccess({
          staking: {
            tazorStake: Number(ethers.utils.formatUnits(tazorAllowance, "gwei")),
            tazStake: Number(ethers.utils.formatUnits(tazAllowance, "gwei")), //"ether")),
          },
        }),
      );
    } catch (e) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  },
);

export const changeApproval_ = createAsyncThunk(
  "stake/changeApproval_",
  async ({ token, provider, address, networkID, version2 }: IChangeApprovalWithVersionAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }
    const signer = provider.getSigner();
    const ohmContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const sohmContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS as string, ierc20ABI, signer) as IERC20;
    const ohmV2Contract = new ethers.Contract(addresses[networkID].OHM_V2 as string, ierc20ABI, signer) as IERC20;
    const sohmV2Contract = new ethers.Contract(addresses[networkID].SOHM_V2 as string, ierc20ABI, signer) as IERC20;
    let approveTx;
    let stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    let unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    let stakeAllowanceV2 = await ohmV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    let unstakeAllowanceV2 = await sohmV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    // return early if approval has already happened
    if (alreadyApprovedToken(token, stakeAllowance, unstakeAllowance, stakeAllowanceV2, unstakeAllowanceV2, version2)) {
      dispatch(info("Approval completed."));
      return dispatch(
        fetchAccountSuccess({
          staking: {
            ohmStakeV1: +stakeAllowance,
            ohmUnstakeV1: +unstakeAllowance,
            ohmStake: +stakeAllowanceV2,
            ohmUnstake: +unstakeAllowanceV2,
          },
        }),
      );
    }

    try {
      if (version2) {
        if (token === "ohm") {
          approveTx = await ohmV2Contract.approve(
            addresses[networkID].STAKING_V2,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        } else if (token === "sohm") {
          approveTx = await sohmV2Contract.approve(
            addresses[networkID].STAKING_V2,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        }
      } else {
        if (token === "ohm") {
          approveTx = await ohmContract.approve(
            addresses[networkID].STAKING_ADDRESS,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        } else if (token === "sohm") {
          approveTx = await sohmContract.approve(
            addresses[networkID].STAKING_ADDRESS,
            ethers.utils.parseUnits("1000000000", "gwei").toString(),
          );
        }
      }

      const text = "Approve " + (token === "ohm" ? "Staking" : "Unstaking");
      const pendingTxnType = token === "ohm" ? "approve_staking" : "approve_unstaking";
      if (approveTx) {
        dispatch(fetchPendingTxns({ txnHash: approveTx.hash, text, type: pendingTxnType }));

        await approveTx.wait();
      }
    } catch (e) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }

    // go get fresh allowances
    stakeAllowance = await ohmContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
    unstakeAllowance = await sohmContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    stakeAllowanceV2 = await ohmV2Contract.allowance(address, addresses[networkID].STAKING_V2);
    unstakeAllowanceV2 = await sohmV2Contract.allowance(address, addresses[networkID].STAKING_V2);

    return dispatch(
      fetchAccountSuccess({
        staking: {
          ohmStakeV1: +stakeAllowance,
          ohmUnstakeV1: +unstakeAllowance,
          ohmStake: +stakeAllowanceV2,
          ohmUnstake: +unstakeAllowanceV2,
        },
      }),
    );
  },
);

export const changeTazorStake = createAsyncThunk(
  "stake/changeTazorStake",
  async ({ action, value, provider, address, networkID, version2, rebase }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const tazorStakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      tazorStaking,
      signer,
    );

    // const stakingHelper = new ethers.Contract(
    //   addresses[networkID].STAKING_HELPER_ADDRESS as string,
    //   StakingHelperABI,
    //   signer,
    // ) as StakingHelper;

    // const stakingV2 = OlympusStakingv2__factory.connect(addresses[networkID].STAKING_V2, signer);

    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (version2) {
        let rebasing = true; // when true stake into sOHM
        if (action === "stake") {
          uaData.type = "tazor stake";
          // 3rd arg is rebase
          // 4th argument is claim default to true
          // stakeTx = rebase
          //   ? await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
          //   : await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), false, true);
          stakeTx = await tazorStakingContract.stakeTazor(ethers.utils.parseUnits(value, "gwei"), address, {
            value: ethers.utils.parseEther(BNB_FEE),
          });
        } else {
          uaData.type = "tazor unstake";
          // 3rd arg is trigger default to true for mainnet and false for rinkeby
          // 4th arg is rebasing
          // stakeTx = rebase
          //   ? await stakingV2.unstake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
          //   : await stakingV2.unstake(address, ethers.utils.parseUnits(value, "ether"), true, false);
          stakeTx = await tazorStakingContract.unstakeTazor(ethers.utils.parseUnits(value, "gwei"), {
            value: ethers.utils.parseEther(BNB_FEE),
          });
        }
      } else {
        // if (action === "stake") {
        //   uaData.type = "stake";
        //   stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"));
        // } else {
        //   uaData.type = "unstake";
        //   stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
        // }
      }
      const pendingTxnType = action === "stake" ? "TAZOR staking" : "TAZOR unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "Staking",
          action: uaData.type ?? "unknown",
          value: parseFloat(uaData.value),
          label: uaData.txHash ?? "unknown",
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);

export const changeTazStake = createAsyncThunk(
  "stake/changeTazStake",
  async ({ action, value, provider, address, networkID, version2, rebase }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const tazorStakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      tazorStaking,
      signer,
    );

    // const stakingHelper = new ethers.Contract(
    //   addresses[networkID].STAKING_HELPER_ADDRESS as string,
    //   StakingHelperABI,
    //   signer,
    // ) as StakingHelper;

    // const stakingV2 = OlympusStakingv2__factory.connect(addresses[networkID].STAKING_V2, signer);

    let stakeTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };
    try {
      if (version2) {
        let rebasing = true; // when true stake into sOHM
        if (action === "stake") {
          uaData.type = "taz stake";
          // 3rd arg is rebase
          // 4th argument is claim default to true
          // stakeTx = rebase
          //   ? await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
          //   : await stakingV2.stake(address, ethers.utils.parseUnits(value, "gwei"), false, true);
          stakeTx = await tazorStakingContract.stakeTaz(ethers.utils.parseUnits(value, "gwei"), address, {
            value: ethers.utils.parseEther(BNB_FEE),
          });
        } else {
          uaData.type = "taz unstake";
          // 3rd arg is trigger default to true for mainnet and false for rinkeby
          // 4th arg is rebasing
          // stakeTx = rebase
          //   ? await stakingV2.unstake(address, ethers.utils.parseUnits(value, "gwei"), true, true)
          //   : await stakingV2.unstake(address, ethers.utils.parseUnits(value, "ether"), true, false);
          stakeTx = await tazorStakingContract.unstakeTaz(ethers.utils.parseUnits(value, "gwei"), {
            value: ethers.utils.parseEther(BNB_FEE),
          });
        }
      } else {
        // if (action === "stake") {
        //   uaData.type = "stake";
        //   stakeTx = await stakingHelper.stake(ethers.utils.parseUnits(value, "gwei"));
        // } else {
        //   uaData.type = "unstake";
        //   stakeTx = await staking.unstake(ethers.utils.parseUnits(value, "gwei"), true);
        // }
      }
      const pendingTxnType = action === "stake" ? "TAZ staking" : "TAZ unstaking";
      uaData.txHash = stakeTx.hash;
      dispatch(fetchPendingTxns({ txnHash: stakeTx.hash, text: getStakingTypeText(action), type: pendingTxnType }));
      await stakeTx.wait();
    } catch (e) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to stake more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (stakeTx) {
        segmentUA(uaData);
        ReactGA.event({
          category: "Staking",
          action: uaData.type ?? "unknown",
          value: parseFloat(uaData.value),
          label: uaData.txHash ?? "unknown",
          dimension1: uaData.txHash ?? "unknown",
          dimension2: uaData.address,
        });
        dispatch(clearPendingTxn(stakeTx.hash));
      }
    }
    dispatch(getBalances({ address, networkID, provider }));
  },
);
