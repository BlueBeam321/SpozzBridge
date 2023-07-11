import { ethers, BigNumber } from "ethers";
import { addresses } from "../constants";
import { abi as ierc20ABI } from "../abi/IERC20.json";
import { abi as v2sOHM } from "../abi/v2sOhmNew.json";
import { clearPendingTxn, fetchPendingTxns, getWrappingTypeText } from "./PendingTxnsSlice";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAccountSuccess, getBalances } from "./AccountSlice";
import { error, info } from "../slices/MessagesSlice";
import { IActionValueAsyncThunk, IChangeApprovalAsyncThunk, IJsonRPCError } from "./interfaces";
import { segmentUA } from "../helpers/userAnalyticHelpers";
import { IERC20, OlympusStakingv2__factory } from "src/typechain";

interface IUAData {
  address: string;
  value: string;
  approved: boolean;
  txHash: string | null;
  type: string | null;
}

export const changeApproval = createAsyncThunk(
  "wrap/changeApproval",
  async ({ token, provider, address, networkID }: IChangeApprovalAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();
    const tazorContract = new ethers.Contract(addresses[networkID].OHM_ADDRESS as string, ierc20ABI, signer);
    const tazContract = new ethers.Contract(addresses[networkID].TAZ_ADDRESS as string, ierc20ABI, signer);

    let approveTx;
    let tazorAllowance = await tazorContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
    let tazAllowance = await tazContract.allowance(address, addresses[networkID].STAKING_ADDRESS);

    try {
      if (token === "tazor") {
        // won't run if wrapAllowance > 0
        approveTx = await tazorContract.approve(
          addresses[networkID].STAKING_ADDRESS,
          ethers.utils.parseUnits("1000", "gwei"),
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
          ethers.utils.parseUnits("1000", "gwei"), //ether"),
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
    } catch (e: unknown) {
      dispatch(error((e as IJsonRPCError).message));
      return;
    } finally {
      if (approveTx) {
        dispatch(clearPendingTxn(approveTx.hash));
      }
    }
  },
);

export const changeWrapV2 = createAsyncThunk(
  "wrap/changeWrapV2",
  async ({ action, value, provider, address, networkID }: IActionValueAsyncThunk, { dispatch }) => {
    if (!provider) {
      dispatch(error("Please connect your wallet!"));
      return;
    }

    const signer = provider.getSigner();

    const stakingContract = OlympusStakingv2__factory.connect(addresses[networkID].STAKING_V2, signer);

    let wrapTx;
    let uaData: IUAData = {
      address: address,
      value: value,
      approved: true,
      txHash: null,
      type: null,
    };

    try {
      if (action === "wrap") {
        const formattedValue = ethers.utils.parseUnits(value, "gwei");
        uaData.type = "wrap";
        wrapTx = await stakingContract.wrap(address, formattedValue);
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: "wrapping" }));
      } else if (action === "unwrap") {
        const formattedValue = ethers.utils.parseUnits(value, "ether");
        uaData.type = "unwrap";
        wrapTx = await stakingContract.unwrap(address, formattedValue);
        dispatch(fetchPendingTxns({ txnHash: wrapTx.hash, text: getWrappingTypeText(action), type: "wrapping" }));
      }
    } catch (e: unknown) {
      uaData.approved = false;
      const rpcError = e as IJsonRPCError;
      if (rpcError.code === -32603 && rpcError.message.indexOf("ds-math-sub-underflow") >= 0) {
        dispatch(
          error("You may be trying to wrap more than your balance! Error code: 32603. Message: ds-math-sub-underflow"),
        );
      } else {
        dispatch(error(rpcError.message));
      }
      return;
    } finally {
      if (wrapTx) {
        uaData.txHash = wrapTx.hash;
        await wrapTx.wait();
        segmentUA(uaData);
        console.log("getBalances");
        dispatch(getBalances({ address, networkID, provider }));
        dispatch(clearPendingTxn(wrapTx.hash));
      }
    }
  },
);
