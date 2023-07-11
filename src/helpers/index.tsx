import { EPOCH_INTERVAL, BLOCK_RATE_SECONDS, addresses } from "../constants";
import { BigNumber, ethers } from "ethers";
import axios from "axios";
import { abi as PairContractABI } from "../abi/PairContract.json";
import { abi as RedeemHelperABI } from "../abi/RedeemHelper.json";

import { SvgIcon } from "@material-ui/core";
import { ReactComponent as OhmImg } from "../assets/tokens/token_OHM.svg";
import { ReactComponent as SOhmImg } from "../assets/tokens/token_sOHM.svg";

import { tazor_native_token, taz_native_token, ohm_weth, ohm_daiOld } from "./AllBonds";
import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { IBaseAsyncThunk } from "src/slices/interfaces";
import { PairContract, RedeemHelper } from "../typechain";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";

import { EnvHelper } from "../helpers/Environment";
import { NodeHelper } from "../helpers/NodeHelper";

/**
 * gets marketPrice from TAZOR-DAI v2
 * @returns Number like 333.33
 */
export async function getMarketPrice({ networkID, provider }: IBaseAsyncThunk) {
  // const mainnetProvider = NodeHelper.getMainnetStaticProvider();
  // v2 price
  // const tazor_native_address = tazor_native_token.getAddressForReserve(networkID);
  // const pairContract = new ethers.Contract(tazor_native_address || "", PairContractABI, provider) as PairContract;
  // const reserves = await pairContract.getReserves();
  if (networkID == 56 || networkID == 97) {
    const tazor_native_contract = tazor_native_token.getContractForReserve(networkID, provider);
    const reserves = await tazor_native_contract.getReserves();
    const native_usdt_contract = tazor_native_token.getContractStableNative(networkID, provider);
    const reserves2 = await native_usdt_contract.getReserves();
    const nativeTokenPrice = Number(reserves2[0].toString()) / Number(reserves2[1].toString());
    console.log("native token price", nativeTokenPrice);
    console.log("tarzan:stable token===>", Number(reserves2[0].toString()));
    console.log("tarzan:native token===>", Number(reserves2[1].toString()));
    let marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
    console.log("tarzan:tazor===>", Number(reserves[0].toString()) / 10 ** 9);
    console.log("tarzan:native token===>", Number(reserves[1].toString()) / 10 ** 18);
    marketPrice = marketPrice * nativeTokenPrice;
    return marketPrice;
  } else {
    const tazor_native_contract = tazor_native_token.getContractForReserve(networkID, provider);
    const reserves = await tazor_native_contract.getReserves();

    const native_usdt_contract = tazor_native_token.getContractStableNative(networkID, provider);
    const reserves2 = await native_usdt_contract.getReserves();
    const nativeTokenPrice = (10 ** 12 * Number(reserves2[0].toString())) / Number(reserves2[1].toString());
    console.log("native token price", nativeTokenPrice);
    console.log("tarzan:stable token===>", Number(reserves2[0].toString()));
    console.log("tarzan:native token===>", Number(reserves2[1].toString()));
    let marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
    console.log("tarzan:tazor===>", Number(reserves[0].toString()) / 10 ** 9);
    console.log("tarzan:native token===>", Number(reserves[1].toString()) / 10 ** 18);
    marketPrice = marketPrice * nativeTokenPrice;
    return marketPrice;
  }
}

export async function getTazorMarketCap({ networkID, provider }: IBaseAsyncThunk) {
  const tazor_dai_address = tazor_native_token.getAddressForReserve(networkID);
  const pairContract = new ethers.Contract(tazor_dai_address || "", PairContractABI, provider) as PairContract;
  const reserves = await pairContract.getReserves();

  const native_usdt_contract = tazor_native_token.getContractStableNative(networkID, provider);
  const reserves2 = await native_usdt_contract.getReserves();
  if (networkID == 56 || networkID == 97) {
    const nativeTokenPrice = Number(reserves2[0].toString()) / Number(reserves2[1].toString());
    const marketCap = (Number(reserves[1].toString()) * 2) / 10 ** 18;
    return marketCap * nativeTokenPrice;
  } else {
    const nativeTokenPrice = (10 ** 12 * Number(reserves2[0].toString())) / Number(reserves2[1].toString());
    const marketCap = (Number(reserves[1].toString()) * 2) / 10 ** 18;
    return marketCap * nativeTokenPrice;
  }
}

/**
 * gets marketPrice from TAZ-DAI v2
 * @returns Number like 333.33
 */
export async function getTazMarketPrice({ networkID, provider }: IBaseAsyncThunk) {
  const taz_native_contract = taz_native_token.getContractForReserve(networkID, provider);
  const reserves = await taz_native_contract.getReserves();

  const native_usdt_contract = taz_native_token.getContractStableNative(networkID, provider);
  const reserves2 = await native_usdt_contract.getReserves();
  if (networkID == 56 || networkID == 97) {
    const nativeTokenPrice = Number(reserves2[0].toString()) / Number(reserves2[1].toString());
    let marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
    marketPrice = marketPrice * nativeTokenPrice;
    return marketPrice;
  } else {
    const nativeTokenPrice = (10 ** 12 * Number(reserves2[0].toString())) / Number(reserves2[1].toString());
    let marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
    marketPrice = marketPrice * nativeTokenPrice;
    return marketPrice;
  }
}

export async function getTazMarketCap({ networkID, provider }: IBaseAsyncThunk) {
  const taz_dai_address = taz_native_token.getAddressForReserve(networkID);
  const pairContract = new ethers.Contract(taz_dai_address || "", PairContractABI, provider) as PairContract;
  const reserves = await pairContract.getReserves();

  const native_usdt_contract = taz_native_token.getContractStableNative(networkID, provider);
  const reserves2 = await native_usdt_contract.getReserves();
  if (networkID == 56 || networkID == 97) {
    const nativeTokenPrice = Number(reserves2[0].toString()) / Number(reserves2[1].toString());
    const marketCap = (Number(reserves[1].toString()) * 2) / 10 ** 18;
    return marketCap * nativeTokenPrice;
  } else {
    const nativeTokenPrice = (10 ** 12 * Number(reserves2[0].toString())) / Number(reserves2[1].toString());
    const marketCap = (Number(reserves[1].toString()) * 2) / 10 ** 18;
    return marketCap * nativeTokenPrice;
  }
}

export async function getMarketPriceFromWeth() {
  const mainnetProvider = NodeHelper.getMainnetStaticProvider();
  // v2 price
  const ohm_weth_address = ohm_weth.getAddressForReserve(1);
  const wethBondContract = ohm_weth.getContractForBond(1, mainnetProvider);
  const pairContract = new ethers.Contract(ohm_weth_address || "", PairContractABI, mainnetProvider) as PairContract;
  const reserves = await pairContract.getReserves();

  // since we're using OHM/WETH... also need to multiply by weth price;
  const wethPriceBN: BigNumber = await wethBondContract.assetPrice();
  const wethPrice = Number(wethPriceBN.toString()) / Math.pow(10, 8);
  const marketPrice = (Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9) * wethPrice;
  return marketPrice;
}

export async function getV1MarketPrice() {
  const mainnetProvider = NodeHelper.getMainnetStaticProvider();
  // v1 price
  const ohm_dai_address = ohm_daiOld.getAddressForReserve(1);
  const pairContract = new ethers.Contract(ohm_dai_address || "", PairContractABI, mainnetProvider) as PairContract;
  const reserves = await pairContract.getReserves();
  const marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
  return marketPrice;
}

/**
 * gets price of token from coingecko
 * @param tokenId STRING taken from https://www.coingecko.com/api/documentations/v3#/coins/get_coins_list
 * @returns INTEGER usd value
 */
export async function getTokenPrice(tokenId = "olympus") {
  let resp;
  try {
    resp = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`);
    return resp.data[tokenId].usd;
  } catch (e) {
    // console.log("coingecko api error: ", e);
  }
}

export function shorten(str: string) {
  if (str.length < 10) return str;
  return `${str.slice(0, 6)}...${str.slice(str.length - 4)}`;
}

export function formatCurrency(c: number, precision = 0) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: precision,
    minimumFractionDigits: precision,
  }).format(c);
}

export function trim(number = 0, precision = 0) {
  // why would number ever be undefined??? what are we trimming?
  const array = Number(number).toFixed(8).split(".");
  if (array.length === 1) return number.toString();
  if (precision === 0) return array[0].toString();

  const poppedNumber = array.pop() || "0";
  array.push(poppedNumber.substring(0, precision));
  const trimmedNumber = array.join(".");
  return trimmedNumber;
}

export function getRebaseBlock(currentBlock: number) {
  return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
}

export function secondsUntilBlock(startBlock: number, endBlock: number) {
  const blocksAway = endBlock - startBlock;
  const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

  return secondsAway;
}

export function prettyVestingPeriod(currentBlock: number, vestingBlock: number) {
  if (vestingBlock === 0) {
    return "";
  }

  const seconds = secondsUntilBlock(currentBlock, vestingBlock);
  if (seconds < 0) {
    return "Fully Vested";
  }
  return prettifySeconds(seconds);
}

export function prettifySeconds(seconds: number, resolution?: string) {
  if (seconds !== 0 && !seconds) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
  const hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
  const mDisplay = m > 0 ? m + (m == 1 ? " min" : " mins") : "";

  let result = dDisplay + hDisplay + mDisplay;
  if (mDisplay === "") {
    result = result.slice(0, result.length - 2);
  }

  return result;
}

export function prettifySeconds_(seconds: number, resolution?: string) {
  if ((seconds !== 0 && !seconds) || seconds < 0) {
    return "";
  }

  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds - d * 3600 * 24 - h * 3600 - m * 60;

  if (resolution === "day") {
    return d + (d == 1 ? " day" : " days");
  }

  const dDisplay = d > 0 ? d + " day  " : "";
  const hDisplay = h > 0 ? h + " h : " : "";
  const mDisplay = m > 0 ? m + " m : " : "";
  const sDisplay = s >= 0 ? s + " s" : "";

  let result = dDisplay + hDisplay + mDisplay + sDisplay;
  // if (mDisplay === "") {
  //   result = result.slice(0, result.length - 2);
  // }
  return result;
}

function getSohmTokenImage() {
  return <SvgIcon component={SOhmImg} viewBox="0 0 100 100" style={{ height: "1rem", width: "1rem" }} />;
}

export function getOhmTokenImage(w?: number, h?: number) {
  const height = h == null ? "32px" : `${h}px`;
  const width = w == null ? "32px" : `${w}px`;
  return <SvgIcon component={OhmImg} viewBox="0 0 32 32" style={{ height, width }} />;
}

export function getTokenImage(name: string) {
  if (name === "ohm") return getOhmTokenImage();
  if (name === "sohm") return getSohmTokenImage();
}

// TS-REFACTOR-NOTE - Used for:
// AccountSlice.ts, AppSlice.ts, LusdSlice.ts
export function setAll(state: any, properties: any) {
  if (properties) {
    const props = Object.keys(properties);
    props.forEach(key => {
      state[key] = properties[key];
    });
  }
}

export function contractForRedeemHelper({
  networkID,
  provider,
}: {
  networkID: number;
  provider: StaticJsonRpcProvider | JsonRpcSigner;
}) {
  return new ethers.Contract(addresses[networkID].REDEEM_HELPER_ADDRESS as string, RedeemHelperABI, provider);
}

/**
 * returns false if SafetyCheck has fired in this Session. True otherwise
 * @returns boolean
 */
export const shouldTriggerSafetyCheck = () => {
  const _storage = window.sessionStorage;
  const _safetyCheckKey = "-oly-safety";
  // check if sessionStorage item exists for SafetyCheck
  if (!_storage.getItem(_safetyCheckKey)) {
    _storage.setItem(_safetyCheckKey, "true");
    return true;
  }
  return false;
};

/**
 * returns unix timestamp for x minutes ago
 * @param x minutes as a number
 */
export const minutesAgo = (x: number) => {
  const now = new Date().getTime();
  return new Date(now - x * 60000).getTime();
};

/**
 * subtracts two dates for use in 33-together timer
 * param (Date) dateA is the ending date object
 * param (Date) dateB is the current date object
 * returns days, hours, minutes, seconds
 * NOTE: this func previously used parseInt() to convert to whole numbers, however, typescript doesn't like
 * ... using parseInt on number params. It only allows parseInt on string params. So we converted usage to
 * ... Math.trunc which accomplishes the same result as parseInt.
 */
export const subtractDates = (dateA: Date, dateB: Date) => {
  let msA: number = dateA.getTime();
  let msB: number = dateB.getTime();

  let diff: number = msA - msB;

  let days: number = 0;
  if (diff >= 86400000) {
    days = Math.trunc(diff / 86400000);
    diff -= days * 86400000;
  }

  let hours: number = 0;
  if (days || diff >= 3600000) {
    hours = Math.trunc(diff / 3600000);
    diff -= hours * 3600000;
  }

  let minutes: number = 0;
  if (hours || diff >= 60000) {
    minutes = Math.trunc(diff / 60000);
    diff -= minutes * 60000;
  }

  let seconds: number = 0;
  if (minutes || diff >= 1000) {
    seconds = Math.trunc(diff / 1000);
  }
  return {
    days,
    hours,
    minutes,
    seconds,
  };
};

export const toBN = (num: number) => {
  return BigNumber.from(num);
};

export const bnToNum = (bigNum: BigNumber) => {
  return Number(bigNum.toString());
};

export const handleContractError = (e: any) => {
  if (EnvHelper.env.NODE_ENV !== "production") console.warn("caught error in slices; usually network related", e);
};

interface ICheckBalance extends IBaseAsyncThunk {
  readonly sOHMbalance: string;
}

export const getGohmBalFromSohm = async ({ provider, networkID, sOHMbalance, address }: ICheckBalance) => {
  const gOhmContract = GOHM__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
  const formattedGohmBal = await gOhmContract.balanceTo(ethers.utils.parseUnits(sOHMbalance, "gwei").toString());
  return ethers.utils.formatEther(formattedGohmBal);
};

export const getDisplayBalance = (balance: BigNumber, decimals = 18, fractionDigits = 4) => {
  try {
    if (balance) {
      // fractionDigits = decimals<=10 ?  2 : fractionDigits
      const number = getBalance(balance, decimals - fractionDigits);
      return String(parseFloat((number / 10 ** fractionDigits).toFixed(fractionDigits)));
    }
  } catch (e) {
    // console.error(e,'----------------balance-------------',balance)
  }
};

export const getFullDisplayBalance = (balance: BigNumber, decimals = 18) => {
  return getDisplayBalance(balance, decimals);
};

export function getBalance(balance: BigNumber, decimals = 18): number {
  return balance.div(BigNumber.from(10).pow(decimals)).toNumber();
}
