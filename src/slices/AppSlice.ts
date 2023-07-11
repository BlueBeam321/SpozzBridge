import { ethers } from "ethers";
import { addresses } from "../constants";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as tazorStaking } from "../abi/tazorStaking.json";
import {
  setAll,
  getTokenPrice,
  getDisplayBalance,
  getMarketPrice,
  getTazMarketPrice,
  getTazorMarketCap,
  getTazMarketCap,
} from "../helpers";
import { NodeHelper } from "src/helpers/NodeHelper";
import apollo from "../lib/apolloClient";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { OlympusStakingv2__factory, OlympusStaking__factory, SOhmv2 } from "../typechain";
import { getByDisplayValue } from "@testing-library/dom";
import { IERC20 } from "src/typechain";

interface IProtocolMetrics {
  readonly timestamp: string;
  readonly ohmCirculatingSupply: string;
  readonly sOhmCirculatingSupply: string;
  readonly totalSupply: string;
  readonly ohmPrice: string;
  readonly marketCap: string;
  readonly totalValueLocked: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedOhm: string;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider, address }: IBaseAsyncThunk, { dispatch }) => {
    if (networkID !== 1) {
      // provider = NodeHelper.getMainnetStaticProvider();
      // networkID = 1;
    }

    let marketPrice;
    let tazMarketPrice;
    let tazorMarketCap;
    let tazMarketCap;
    let tazTotalSupply: Number;
    let tazorTotalSupply: Number;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider, address: address }),
      ).unwrap();

      const tazorContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      tazorTotalSupply = Number(getDisplayBalance(await tazorContract.totalSupply(), 9));

      const tazContract = new ethers.Contract(
        addresses[networkID].TAZ_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      tazTotalSupply = Number(getDisplayBalance(await tazContract.totalSupply(), 9));

      marketPrice = originalPromiseResult?.marketPrice;
      tazMarketPrice = originalPromiseResult?.tazMarketPrice;
      tazMarketCap = originalPromiseResult?.tazMarketCap;
      tazorMarketCap = originalPromiseResult?.tazorMarketCap;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      tazMarketCap = 0;
      tazorMarketCap = 0;
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }

    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        marketPrice,
        tazMarketPrice,
        tazMarketCap,
        tazorMarketCap,
        tazorTotalSupply,
        tazTotalSupply,
      } as IAppData;
    }
    const currentBlock = await provider.getBlockNumber();

    const tazorStakingContract = new ethers.Contract(
      addresses[networkID].STAKING_ADDRESS as string,
      tazorStaking,
      provider,
    );

    const stakingAPY = Number(getDisplayBalance(await tazorStakingContract.getAPRvalue(address), 9));
    const secondsToEpoch = Number(await tazorStakingContract.secondsToNextEpoch(address));
    // const totalTazorStaked = Number(getDisplayBalance(await tazorStakingContract.totalTazorSupply(), 9));
    // const totalTazStaked = Number(getDisplayBalance(await tazorStakingContract.totalTazSupply(), 9));

    return {
      stakingAPY,
      secondsToEpoch,
      currentBlock,
      marketPrice,
      tazMarketCap,
      tazorMarketCap,
      tazMarketPrice,
      tazorTotalSupply,
      tazTotalSupply,
    } as IAppData;
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider, address }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    let tazMarketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice && state.app.tazMarketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
      tazMarketPrice = state.app.tazMarketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider, address: address }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
        tazMarketPrice = originalPromiseResult?.tazMarketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice, tazMarketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk(
  "app/loadMarketPrice",
  async ({ networkID, provider, address }: IBaseAsyncThunk) => {
    let marketPrice: number;
    let tazMarketPrice: number;
    let tazorMarketCap: number;
    let tazMarketCap: number;
    let tazTotalSupply: Number;
    let tazorTotalSupply: Number;
    try {
      // only get marketPrice from eth mainnet
      marketPrice = await getMarketPrice({ networkID, provider, address });
      tazMarketPrice = await getTazMarketPrice({ networkID, provider, address });
      tazMarketCap = await getTazMarketCap({ networkID, provider, address });
      tazorMarketCap = await getTazorMarketCap({ networkID, provider, address });
      const tazorContract = new ethers.Contract(
        addresses[networkID].OHM_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      tazorTotalSupply = Number(getDisplayBalance(await tazorContract.totalSupply(), 9));

      const tazContract = new ethers.Contract(
        addresses[networkID].TAZ_ADDRESS as string,
        ierc20Abi,
        provider,
      ) as IERC20;
      tazTotalSupply = Number(getDisplayBalance(await tazContract.totalSupply(), 9));
      // v1MarketPrice = await getV1MarketPrice();
    } catch (e) {
      marketPrice = await getTokenPrice("tazor");
      tazMarketPrice = await getTokenPrice("taz");
      tazorMarketCap = 0;
      tazMarketCap = 0;
      tazTotalSupply = 0;
      tazorTotalSupply = 0;
    }
    return { marketPrice, tazMarketPrice, tazorMarketCap, tazMarketCap, tazTotalSupply, tazorTotalSupply };
  },
);

interface IAppData {
  readonly circSupply?: number;
  readonly currentIndex?: string;
  readonly currentIndexV1?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketCap?: number;
  readonly tazorMarketCap?: number;
  readonly tazMarketCap?: number;
  readonly marketPrice?: number;
  readonly tazMarketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly tazorTotalSupply?: number;
  readonly tazTotalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly secondsToEpoch?: number;
  // readonly totalTazorStaked?: number;
  // readonly totalTazStaked?: number;
  // readonly nextReward?: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
