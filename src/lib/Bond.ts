import { JsonRpcSigner, StaticJsonRpcProvider } from "@ethersproject/providers";
import { ethers, BigNumber } from "ethers";

import { abi as ierc20Abi } from "src/abi/IERC20.json";
import { getTokenPrice } from "src/helpers";
import { getBondCalculator } from "src/helpers/BondCalculator";
import { EthContract, PairContract } from "src/typechain";
import { addresses } from "src/constants";
import React from "react";

export enum NetworkID {
  Mainnet = 1,
  Testnet = 4,
  BSCMainnet = 56,
  BSCTestnet = 97,
  Polygon = 137,
  Moombai = 80001,
  Arbitrum = 42161,
  ArbitrumTestnet = 421611,
  Avalanche = 43114,
}

export enum BondType {
  StableAsset,
  LP,
}

export interface BondAddresses {
  reserveAddress: string;
  bondAddress: string;
}

export interface NetworkAddresses {
  [NetworkID.Mainnet]?: BondAddresses;
  [NetworkID.Testnet]?: BondAddresses;
  [NetworkID.BSCMainnet]?: BondAddresses;
  [NetworkID.BSCTestnet]?: BondAddresses;
  [NetworkID.Polygon]?: BondAddresses;
  [NetworkID.Moombai]?: BondAddresses;
  [NetworkID.Arbitrum]?: BondAddresses;
  [NetworkID.ArbitrumTestnet]?: BondAddresses;
  [NetworkID.Avalanche]?: BondAddresses;
}

export interface BondNameOnNetwork {
  [NetworkID.Mainnet]?: string;
  [NetworkID.Testnet]?: string;
  [NetworkID.BSCMainnet]?: string;
  [NetworkID.BSCTestnet]?: string;
  [NetworkID.Polygon]?: string;
  [NetworkID.Moombai]?: string;
  [NetworkID.Arbitrum]?: string;
  [NetworkID.ArbitrumTestnet]?: string;
  [NetworkID.Avalanche]?: string;
}

export interface BondImageOnNetwork {
  [NetworkID.Mainnet]?: React.ReactNode;
  [NetworkID.Testnet]?: React.ReactNode;
  [NetworkID.BSCMainnet]?: React.ReactNode;
  [NetworkID.BSCTestnet]?: React.ReactNode;
  [NetworkID.Polygon]?: React.ReactNode;
  [NetworkID.Arbitrum]?: React.ReactNode;
  [NetworkID.ArbitrumTestnet]?: React.ReactNode;
  [NetworkID.Avalanche]?: React.ReactNode;
  [NetworkID.Moombai]?: React.ReactNode;
}

export interface Available {
  [NetworkID.Mainnet]: boolean;
  [NetworkID.Testnet]: boolean;
  [NetworkID.BSCMainnet]?: boolean;
  [NetworkID.BSCTestnet]?: boolean;
  [NetworkID.Polygon]?: boolean;
  [NetworkID.Moombai]?: boolean;
  [NetworkID.Arbitrum]: boolean;
  [NetworkID.ArbitrumTestnet]: boolean;
  [NetworkID.Avalanche]: boolean;
}

interface BondOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  tokenName: BondNameOnNetwork; // tokenName on UI
  isBondable: Available; // aka isBondable => set false to hide
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  isLOLable: Available; // aka isBondable => set false to hide
  LOLmessage: string; // aka isBondable => set false to hide
  isClaimable: Available; // set false to hide
  bondIconSvg: BondImageOnNetwork; //  SVG path for icons
  bondContractABI: ethers.ContractInterface; // ABI for contract
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  bondToken: string; // Unused, but native token to buy the bond.
  payoutToken: string; // Token the user will receive - currently OHM on ethereum, wsOHM on arbitrum
  v2Bond: boolean; // if v2Bond use v2BondingCalculator
}

interface TokenOpts {
  name: string; // Internal name used for references
  displayName: string; // Displayname on UI
  tokenName: BondNameOnNetwork; // tokenName on UI
  bondIconSvg: BondImageOnNetwork; //  SVG path for icons
  networkAddrs: NetworkAddresses; // Mapping of network --> Addresses
  reserveContract: ethers.ContractInterface;
}

// Technically only exporting for the interface
export abstract class Bond {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly tokenName: BondNameOnNetwork; // tokenName on UI
  readonly isBondable: Available;
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  readonly isLOLable: Available;
  readonly LOLmessage: string;
  readonly isClaimable: Available;
  readonly type: BondType;
  readonly bondIconSvg: BondImageOnNetwork;
  readonly bondContractABI: ethers.ContractInterface; // Bond ABI
  readonly networkAddrs: NetworkAddresses;
  readonly bondToken: string;
  readonly payoutToken: string;
  readonly v2Bond: boolean;

  // The following two fields will differ on how they are set depending on bond type
  abstract isLP: Boolean;
  abstract reserveContract: ethers.ContractInterface; // Token ABI
  abstract displayUnits: string;

  // Async method that returns a Promise
  abstract getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number>;
  abstract getBondImage(networkID: NetworkID): React.ReactNode;
  constructor(type: BondType, bondOpts: BondOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    this.isBondable = bondOpts.isBondable;
    // NOTE (appleseed): temporary for ONHOLD MIGRATION
    this.isLOLable = bondOpts.isLOLable;
    this.LOLmessage = bondOpts.LOLmessage;
    this.type = type;
    this.isClaimable = bondOpts.isClaimable;
    this.bondIconSvg = bondOpts.bondIconSvg;
    this.bondContractABI = bondOpts.bondContractABI;
    this.networkAddrs = bondOpts.networkAddrs;
    this.tokenName = bondOpts.tokenName;
    this.bondToken = bondOpts.bondToken;
    this.payoutToken = bondOpts.payoutToken;
    this.v2Bond = bondOpts.v2Bond;
  }

  /**
   * makes isBondable accessible within Bonds.ts
   * @param networkID
   * @returns boolean
   */
  getBondability(networkID: NetworkID) {
    return this.isBondable[networkID];
  }

  getClaimability(networkID: NetworkID) {
    return this.isClaimable[networkID];
  }
  // NOTE (appleseed): temporary for ONHOLD MIGRATION
  getLOLability(networkID: NetworkID) {
    return this.isLOLable[networkID];
  }

  getAddressForBond(networkID: NetworkID) {
    return this.networkAddrs[networkID]?.bondAddress;
  }

  getTokenName(networkID: NetworkID) {
    return this.tokenName[networkID];
  }

  getContractForBond(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForBond(networkID) || "";
    return new ethers.Contract(bondAddress, this.bondContractABI, provider);
  }

  getAddressForReserve(networkID: NetworkID) {
    return this.networkAddrs[networkID]?.reserveAddress;
  }
  getContractForReserve(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(networkID) || "";
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as PairContract;
  }
  // TODO (appleseed): improve this logic
  async getBondReservePrice(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    let marketPrice: number;
    if (this.isLP) {
      const pairContract = this.getContractForReserve(networkID, provider);
      const reserves = await pairContract.getReserves();
      marketPrice = Number(reserves[1].toString()) / Number(reserves[0].toString()) / 10 ** 9;
    } else {
      marketPrice = await getTokenPrice("convex-finance");
    }
    return marketPrice;
  }
}

export class LpToken {
  // Standard Bond fields regardless of LP bonds or stable bonds.
  readonly name: string;
  readonly displayName: string;
  readonly bondIconSvg: BondImageOnNetwork;
  readonly networkAddrs: NetworkAddresses;
  readonly tokenName: BondNameOnNetwork;

  // The following two fields will differ on how they are set depending on bond type
  readonly reserveContract: ethers.ContractInterface; // Token ABI

  constructor(bondOpts: TokenOpts) {
    this.name = bondOpts.name;
    this.displayName = bondOpts.displayName;
    // NOTE (appleseed): temporary for ONHOLD MIGRATION
    this.bondIconSvg = bondOpts.bondIconSvg;
    this.networkAddrs = bondOpts.networkAddrs;
    this.tokenName = bondOpts.tokenName;
    this.reserveContract = bondOpts.reserveContract;
  }

  getAddressForReserve(networkID: NetworkID) {
    return this.networkAddrs[networkID]?.reserveAddress;
  }
  getContractForReserve(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressForReserve(networkID) || "";
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as PairContract;
  }
  getBondIconSvgWithNetID(networkID: NetworkID) {
    return this.bondIconSvg[networkID];
  }
  getAddressStableNative(networkID: NetworkID) {
    return this.networkAddrs[networkID]?.bondAddress;
  }
  getTokenName(networkID: NetworkID) {
    return this.tokenName[networkID];
  }

  getContractStableNative(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    const bondAddress = this.getAddressStableNative(networkID) || "";
    return new ethers.Contract(bondAddress, this.reserveContract, provider) as PairContract;
  }

  async getLpTokenAssetNum(networkID: NetworkID, provider: StaticJsonRpcProvider | JsonRpcSigner) {
    let tokenNum: number;
    let stableNum: number;
    let marketCap: number;
    if (true) {
      const pairContract = this.getContractForReserve(networkID, provider);
      const stableNativeContract = this.getContractStableNative(networkID, provider);
      const reserves = await pairContract.getReserves(); //[0]: tazor, [1] native
      const reserves2 = await stableNativeContract.getReserves(); //[0]: usdt, [1] native
      const nativePrice = Number(reserves2[0].toString()) / Number(reserves2[1].toString());
      tokenNum = Number(reserves[0].toString()) / 10 ** 9; // # of tazor token in lp.
      stableNum = Number(reserves[1].toString()) / 10 ** 18; // # of native token in lp.
      if (networkID == 56 || networkID == 97) {
        marketCap = (nativePrice * (Number(reserves[1].toString()) * 2)) / 10 ** 18; // usdt decimal is 18 in bsc.
      } else {
        marketCap = (nativePrice * (Number(reserves[1].toString()) * 2)) / 10 ** 6; // usdt decimal is 6.
      }
    }
    return { tokenNum: tokenNum, stableNum: stableNum, marketCap: marketCap };
  }
}

// Keep all LP specific fields/logic within the LPBond class
export interface LPBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  lpUrl: string;
}

export class LPBond extends Bond {
  readonly isLP = true;
  readonly lpUrl: string;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(lpBondOpts: LPBondOpts) {
    super(BondType.LP, lpBondOpts);

    this.lpUrl = lpBondOpts.lpUrl;
    this.reserveContract = lpBondOpts.reserveContract;
    this.displayUnits = "LP";
  }
  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    const token = this.getContractForReserve(networkID, provider);
    const tokenAddress = this.getAddressForReserve(networkID);
    const bondCalculator = getBondCalculator(networkID, provider, this.v2Bond);
    // const bondContract = this.getContractForBond(networkID, provider);
    const tokenAmountV1 = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS); // get from treasury
    // const tokenAmountV1 = await bondContract.bondPurchased();

    // const tokenAmountV2 = await token.balanceOf(addresses[networkID].TREASURY_V2);
    // const tokenAmount = tokenAmountV1.add(tokenAmountV2);
    const tokenAmount = tokenAmountV1;
    const valuation = await bondCalculator.valuation(tokenAddress || "", tokenAmount);
    const markdown = await bondCalculator.markdown(tokenAddress || "");
    let tokenUSD = (Number(valuation.toString()) / Math.pow(10, 9)) * (Number(markdown.toString()) / Math.pow(10, 18));
    return Number(tokenUSD.toString());
  }

  getBondImage(networkID: NetworkID) {
    return this.bondIconSvg[networkID];
  }
}

// Generic BondClass we should be using everywhere
// Assumes the token being deposited follows the standard ERC20 spec
export interface StableBondOpts extends BondOpts {}
export class StableBond extends Bond {
  readonly isLP = false;
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;

  constructor(stableBondOpts: StableBondOpts) {
    super(BondType.StableAsset, stableBondOpts);
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = stableBondOpts.displayName;
    this.reserveContract = ierc20Abi; // The Standard ierc20Abi since they're normal tokens
  }
  async getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider) {
    let bondContract = this.getContractForBond(networkID, provider);
    let reserveContract = this.getContractForReserve(networkID, provider);
    const decimal = Number(await (await reserveContract.decimals()).toString());
    const tokenAmount = await bondContract.bondPurchased();
    // should calculate token price here and multiply by token amount
    console.log("[tz] bond decimal: ", decimal);
    console.log("[tz] purchased bond: ", Number(tokenAmount.toString()));
    return Number(tokenAmount.toString()) / Math.pow(10, decimal);
  }
  getBondImage(networkID: NetworkID) {
    return this.bondIconSvg[networkID];
  }
}

// These are special bonds that have different valuation methods
export interface CustomBondOpts extends BondOpts {
  reserveContract: ethers.ContractInterface;
  bondType: number;
  lpUrl: string;
  customTreasuryBalanceFunc: (
    this: CustomBond,
    networkID: NetworkID,
    provider: StaticJsonRpcProvider,
  ) => Promise<number>;
}
export class CustomBond extends Bond {
  readonly isLP: Boolean;
  getTreasuryBalance(networkID: NetworkID, provider: StaticJsonRpcProvider): Promise<number> {
    throw new Error("Method not implemented.");
  }
  readonly reserveContract: ethers.ContractInterface;
  readonly displayUnits: string;
  readonly lpUrl: string;

  constructor(customBondOpts: CustomBondOpts) {
    super(customBondOpts.bondType, customBondOpts);

    if (customBondOpts.bondType === BondType.LP) {
      this.isLP = true;
    } else {
      this.isLP = false;
    }
    this.lpUrl = customBondOpts.lpUrl;
    // For stable bonds the display units are the same as the actual token
    this.displayUnits = customBondOpts.displayName;
    this.reserveContract = customBondOpts.reserveContract;
    this.getTreasuryBalance = customBondOpts.customTreasuryBalanceFunc.bind(this);
  }
  getBondImage(networkID: NetworkID) {
    return this.bondIconSvg[networkID];
  }
}
