import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses } from "../constants";
import { loadAppDetails } from "../slices/AppSlice";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as tazorStaking } from "../abi/tazorStaking.json";
import { abi as PresaleAbi } from "../abi/Presale.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { abi as fiatDAO } from "../abi/FiatDAOContract.json";
import axios from "axios";
import { setAll, handleContractError, getDisplayBalance, getMarketPrice, getTazMarketPrice } from "../helpers";

import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk, IBridgeAsyncThunk } from "./interfaces";
import { findOrLoadMarketPrice } from "./AppSlice";
import {
  FiatDAOContract,
  FuseProxy,
  IERC20,
  IERC20__factory,
  SOhmv2,
  WsOHM,
  OlympusStakingv2__factory,
} from "src/typechain";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";
import { NodeHelper } from "src/helpers/NodeHelper";
import { NetworkID } from "src/lib/Bond";

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk, { dispatch }) => {
    await dispatch(loadAppDetails({ networkID: networkID, provider: provider, address: address }));
  },
);

/////////////////////
export const getBridgeBalances = createAsyncThunk(
  "account/getBridgeBalances",
  async ({ address, networkID, provider, secondNetworkID }: IBridgeAsyncThunk, { dispatch }) => {
    let srcSpotBalance = null;
    let dstSpotBalance = null;
    let tokenAllowance = null;
    let ethSpotBalance = null;
    let bscSpotBalance = null;
    let polySpotBlance = null;

    console.log("getBridgeBalances", networkID);
    try {
      let res;
      if (true) {
        const tokenContract = new ethers.Contract(
          addresses[networkID].OHM_ADDRESS as string,
          ierc20Abi,
          provider,
        ) as IERC20;
        let srcSpotBalanceBN = await tokenContract.balanceOf(address);
        srcSpotBalance = ethers.utils.formatUnits(srcSpotBalanceBN, "gwei");
        console.log(address, addresses[networkID].BRIDGE_ADDRESS);
        let tokenAllowanceBN = await tokenContract.allowance(address, addresses[networkID].BRIDGE_ADDRESS);
        tokenAllowance = ethers.utils.formatUnits(tokenAllowanceBN, "gwei");
      }

      // let res2;
      if (secondNetworkID == 1) {
        // res2 = await axios.get(
        //   "https://deep-index.moralis.io/api/v2/" +
        //     address +
        //     "/erc20?chain=eth&token_addresses=" +
        //     addresses[secondNetworkID].OHM_ADDRESS,
        //   {
        //     headers: { "X-API-Key": "YEEwMh0B4VRg6Hu5gFQcKxqinJ7UizRza1JpbkyMgNTfj4jUkSaZVajOxLNabvnt" },
        //   },
        // );
        dstSpotBalance = 0;
      }
      if (true) {
        const provider2 = new ethers.providers.JsonRpcProvider(
          "https://speedy-nodes-nyc.moralis.io/24036fe0cb35ad4bdc12155f/polygon/mumbai",
        );
        const tazContract = new ethers.Contract(addresses[80001].OHM_ADDRESS as string, ierc20Abi, provider2) as IERC20;
        let spotBalanceBN = await tazContract.balanceOf(address);
        polySpotBlance = ethers.utils.formatUnits(spotBalanceBN, "gwei");
      }
      if (true) {
        const provider2 = new ethers.providers.JsonRpcProvider(
          "https://speedy-nodes-nyc.moralis.io/24036fe0cb35ad4bdc12155f/eth/rinkeby",
        );
        const tazContract = new ethers.Contract(addresses[4].OHM_ADDRESS as string, ierc20Abi, provider2) as IERC20;
        let spotBalanceBN = await tazContract.balanceOf(address);
        ethSpotBalance = ethers.utils.formatUnits(spotBalanceBN, "gwei");
      }
      if (true) {
        const provider2 = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/");
        const tazContract = new ethers.Contract(addresses[97].OHM_ADDRESS as string, ierc20Abi, provider2) as IERC20;
        let spotBalanceBN = await tazContract.balanceOf(address);
        bscSpotBalance = ethers.utils.formatUnits(spotBalanceBN, "gwei");
      }
      // dstSpotBalance = ethers.utils.formatUnits(res2.data[0].balance, "ether");
    } catch (e) {
      handleContractError(e);
    }
    // await dispatch(loadAppDetails({ networkID: networkID, provider: provider, address: address }));

    const spotBalances = {
      eth: ethSpotBalance,
      bsc: bscSpotBalance,
      polygon: polySpotBlance,
    };
    return {
      balances: {
        srcSpotBalance: srcSpotBalance,
        tokenAllowance: tokenAllowance,
        dstSpotBalance: dstSpotBalance,
        spotBalances,
      },
    };
  },
);

////////////////////

interface IUserAccountDetails {
  wrapping: {
    sohmWrap: number;
    wsohmUnwrap: number;
    gOhmUnwrap: number;
    wsOhmMigrate: number;
  };
}

export const getMigrationAllowances = createAsyncThunk(
  "account/getMigrationAllowances",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmAllowance = BigNumber.from(0);
    let sOhmAllowance = BigNumber.from(0);
    let wsOhmAllowance = BigNumber.from(0);
    let gOhmAllowance = BigNumber.from(0);

    if (addresses[networkID].OHM_ADDRESS) {
      try {
        const ohmContract = IERC20__factory.connect(addresses[networkID].OHM_ADDRESS, provider);
        ohmAllowance = await ohmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      try {
        const sOhmContract = IERC20__factory.connect(addresses[networkID].SOHM_ADDRESS, provider);
        sOhmAllowance = await sOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      try {
        const wsOhmContract = IERC20__factory.connect(addresses[networkID].WSOHM_ADDRESS, provider);
        wsOhmAllowance = await wsOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].GOHM_ADDRESS) {
      try {
        const gOhmContract = IERC20__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
        gOhmAllowance = await gOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    return {
      migration: {
        ohm: +ohmAllowance,
        sohm: +sOhmAllowance,
        wsohm: +wsOhmAllowance,
        gohm: +gOhmAllowance,
      },
      isMigrationComplete: false,
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let tazorAllowance = BigNumber.from("0");
    let tazAllowance = BigNumber.from("0");
    let secondNetworkID = 3;

    if (networkID == NetworkID.Mainnet) secondNetworkID = 56;
    else if (networkID == NetworkID.Testnet) secondNetworkID = 97;
    else if (networkID == NetworkID.BSCMainnet) secondNetworkID = 1;
    else if (networkID == NetworkID.BSCTestnet) secondNetworkID = 3;

    await dispatch(getBridgeBalances({ address, networkID, provider, secondNetworkID }));

    return {
      staking: {
        tazorStake: +tazorAllowance,
        tazStake: +tazAllowance,
      },
    };
  },
);

export interface IUserBondDetails {
  // bond: string;
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = BigNumber.from(0);
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID) || "");
    // balance = await reserveContract.balanceOf(address);
    //const dec = Number(BigNumber.from(await reserveContract.decimals()).toString());
    const dec = Number(await (await reserveContract.decimals()).toString());
    console.log("[tz]: decimals ===>", dec);
    // const balanceVal = Number(getDisplayBalance(await reserveContract.balanceOf(address), dec));
    // formatEthers takes BigNumber => String
    // const balanceVal = ethers.utils.formatEther(balance);
    const balanceVal = Number(getDisplayBalance(await reserveContract.balanceOf(address), dec));
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.getTokenName(networkID),
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

interface IAccountSlice extends IUserAccountDetails {
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    gohm: string;
    secondNetworkID: number;
    ohmV1: string;

    tazor: string;
    taz: string;
    tazorStaked: string;
    tazStaked: string;
    tazReward: string;
    totalTazorStaked: number;
    totalTazStaked: number;
    totalDeposited: number;
    tazorPTotalSupply: number;
    tazorInCirculation: number;
    tazPTotalSupply: number;
    tazInCirculation: number;
    presaleLeftTime: number;
    currentETHBalance: number;

    sohm: string;
    sohmV1: string;
    dai: string;
    oldsohm: string;
    fsohm: string;
    fgohm: string;
    fgOHMAsfsOHM: string;
    wsohm: string;
    fiatDaowsohm: string;
    pool: string;
  };
  loading: boolean;
  staking: {
    ohmStakeV1: number;
    ohmUnstakeV1: number;
    tazorStake: number;
    tazStake: number;
    ohmUnstake: number;
  };
  presale: {
    isFairLaunchFinshed: boolean;
    isTazorClaimed: boolean;
    isTazClaimed: boolean;
    tazorPPrice: number;
    tazPPrice: number;
    tazorPurchasedBalance: number;
    tazPurchasedBalance: number;
    pendingPayoutPresale: number;
    vestingPeriodPresale: number;
  };
  migration: {
    ohm: number;
    sohm: number;
    wsohm: number;
    gohm: number;
  };
  pooling: {
    sohmPool: number;
  };
  isMigrationComplete: boolean;
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {
    gohm: "",
    secondNetworkID: 80001,
    ohmV1: "",

    tazor: "",
    taz: "",
    tazorStaked: "",
    tazStaked: "",
    tazReward: "",
    totalTazorStaked: 0,
    totalTazStaked: 0,
    totalDeposited: 0,
    tazorPTotalSupply: 0,
    tazorInCirculation: 0,
    tazPTotalSupply: 0,
    presaleLeftTime: 0,
    tazInCirculation: 0,
    currentETHBalance: 0,

    sohm: "",
    sohmV1: "",
    dai: "",
    oldsohm: "",
    fsohm: "",
    fgohm: "",
    fgOHMAsfsOHM: "",
    wsohm: "",
    fiatDaowsohm: "",
    pool: "",
  },
  staking: { ohmStakeV1: 0, ohmUnstakeV1: 0, tazorStake: 0, tazStake: 0, ohmUnstake: 0 },
  presale: {
    isFairLaunchFinshed: false,
    isTazorClaimed: false,
    isTazClaimed: false,
    tazorPPrice: 0,
    tazPPrice: 0,
    tazorPurchasedBalance: 0,
    tazPurchasedBalance: 0,
    pendingPayoutPresale: 0,
    vestingPeriodPresale: 0,
  },
  wrapping: { sohmWrap: 0, wsohmUnwrap: 0, gOhmUnwrap: 0, wsOhmMigrate: 0 },
  pooling: { sohmPool: 0 },
  migration: { ohm: 0, sohm: 0, wsohm: 0, gohm: 0 },
  isMigrationComplete: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBridgeBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBridgeBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBridgeBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      // .addCase(calculateUserBondDetails.pending, state => {
      //   state.loading = true;
      // })
      // .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
      //   if (!action.payload) return;
      //   const bond = action.payload.bond;
      //   state.bonds[bond] = action.payload;
      //   state.loading = false;
      // })
      // .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
      //   state.loading = false;
      //   console.log(error);
      // })
      .addCase(getMigrationAllowances.fulfilled, (state, action) => {
        setAll(state, action.payload);
      })
      .addCase(getMigrationAllowances.rejected, (state, { error }) => {
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
