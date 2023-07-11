import { NodeHelper } from "./helpers/NodeHelper";
import { EnvHelper } from "./helpers/Environment";
import ethereum from "./assets/tokens/wETH.svg";
import arbitrum from "./assets/arbitrum.png";
import avalanche from "./assets/tokens/AVAX.svg";
import polygon from "./assets/tokens/polygon.svg";
import binance from "./assets/binance.png";

export const THE_GRAPH_URL = "https://api.thegraph.com/subgraphs/name/drondin/olympus-protocol-metrics";
export const EPOCH_INTERVAL = 28800; //28800

// NOTE could get this from an outside source since it changes slightly over time
export const BLOCK_RATE_SECONDS = 3; //13.14;

export const TOKEN_DECIMALS = 9;

export const BNB_FEE = "0.0025";

// presale price, but this got from presale contract.
export const tazorPPrice = 100;
export const tazPPrice = 1;
export const maxTransactionFee = 0.01;

interface IPoolGraphURLS {
  [index: string]: string;
}

export const POOL_GRAPH_URLS: IPoolGraphURLS = {
  4: "https://api.thegraph.com/subgraphs/name/pooltogether/rinkeby-v3_4_3",
  1: "https://api.thegraph.com/subgraphs/name/pooltogether/pooltogether-v3_4_3",
};

interface IAddresses {
  [key: number]: { [key: string]: string };
}

export const addresses: IAddresses = {
  97: {
    DAI_ADDRESS: "0x8a9424745056Eb399FD19a0EC26A14316684e274", // duplicate
    OHM_ADDRESS: "0x787499d12F05DC371726359Be5736d760ddFB32F",
    BRIDGE_ADDRESS: "0x22d6987976F8Be2FDa44dD8e081B6ffcAC44F30d",
    TAZ_ADDRESS: "0xa583B35e2C080CC85955dE58aBE44e186599b341",
    STAKING_ADDRESS: "0x58517F6eD9Be72ecdc29126A0d22C2a69Df0867A",
    STAKING_HELPER_ADDRESS: "0xaB217aA0fD9fD0C6930f2827789622C4251E9058",
    BONDINGCALC_ADDRESS: "0x661d77B9fF1Cc4286eF476f5A21a6875926D732C",
    BONDINGCALC_TAZ_ADDRESS: "0x66abaAf86f972Dc0A30F6323F554FDF4C54Fe688",
    TREASURY_ADDRESS: "0x4a47fA1982421181dd0673393322645Fa482B3Ef",
    REDEEM_HELPER_ADDRESS: "0x27bCF334D7C3Ad8248B06E90ee8a3851c1de0A41",
  },
  4: {
    DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    OHM_ADDRESS: "0x494BF4795c80E01EA51EBD1cBc5d3C54fCD49Dba",
    BRIDGE_ADDRESS: "0x39830fbF9d9CBbc47e72ae0Cd234C0Cc24AE798d",
    TAZ_ADDRESS: "0x4A5972E255469b2f842376661190bC58c7a97897",
    STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
    STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
    DISTRIBUTOR_ADDRESS: "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
    CIRCULATING_SUPPLY_ADDRESS: "0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868",
    TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
    REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
    PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
  },
  3: {
    DAI_ADDRESS: "0xB2180448f8945C8Cc8AE9809E67D6bd27d8B2f2C", // duplicate
    OHM_ADDRESS: "0x73cb818EfCE5594138c8dB05658a24666F5c3fc5",
    BRIDGE_ADDRESS: "0x0418717Ebafbf5b8e66F77a80Aa624C2568c1431",
    TAZ_ADDRESS: "0x4A5972E255469b2f842376661190bC58c7a97897",
    STAKING_ADDRESS: "0xC5d3318C0d74a72cD7C55bdf844e24516796BaB2",
    STAKING_HELPER_ADDRESS: "0xf73f23Bb0edCf4719b12ccEa8638355BF33604A1",
    DISTRIBUTOR_ADDRESS: "0x0626D5aD2a230E05Fb94DF035Abbd97F2f839C3a",
    BONDINGCALC_ADDRESS: "0xaDBE4FA3c2fcf36412D618AfCfC519C869400CEB",
    CIRCULATING_SUPPLY_ADDRESS: "0x5b0AA7903FD2EaA16F1462879B71c3cE2cFfE868",
    TREASURY_ADDRESS: "0x0d722D813601E48b7DAcb2DF9bae282cFd98c6E7",
    REDEEM_HELPER_ADDRESS: "0xBd35d8b2FDc2b720842DB372f5E419d39B24781f",
    PT_TOKEN_ADDRESS: "0x0a2d026bacc573a8b5a2b049f956bdf8e5256cfd", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
  },
  1: {
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    OHM_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    TAZ_ADDRESS: "0x912263149F674d7F54650e54D871050a0f091b1E",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    SOHM_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    WSOHM_ADDRESS: "0xca76543cf381ebbb277be79574059e32108e3e65",
    OLD_SOHM_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    AOHM_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    CRUCIBLE_OHM_LUSD: "0x2230ad29920D61A535759678191094b74271f373",
    LQTY: "0x6dea81c8171d0ba574754ef6f8b412f2ed88c54d",
    MIST: "0x88acdd2a6425c3faae4bc9650fd7e27e0bebb7ab",
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
    FUSE_6_SOHM: "0x59bd6774c22486d9f4fab2d448dce4f892a9ae25", // Tetranode's Locker
    FUSE_18_SOHM: "0x6eDa4b59BaC787933A4A21b65672539ceF6ec97b", // Olympus Pool Party
    FUSE_36_SOHM: "0x252d447c54F33e033AD04048baEAdE7628cB1274", // Fraximalist Money Market
    PT_TOKEN_ADDRESS: "0x0E930b8610229D74Da0A174626138Deb732cE6e9", // 33T token address, taken from `ticket` function on PRIZE_STRATEGY_ADDRESS
    PT_PRIZE_POOL_ADDRESS: "0xEaB695A8F5a44f583003A8bC97d677880D528248", // NEW
    PT_PRIZE_STRATEGY_ADDRESS: "0xf3d253257167c935f8C62A02AEaeBB24c9c5012a", // NEW
    BONDINGCALC_V2: "0x7b1a5649145143F4faD8504712ca9c614c3dA2Ae",
    MIGRATOR_ADDRESS: "0x184f3FAd8618a6F458C16bae63F70C426fE784B3",
    GOHM_ADDRESS: "0x0ab87046fBb341D058F17CBC4c1133F25a20a52f",
    OHM_V2: "0x64aa3364f17a4d01c6f1751fd97c2bd3d7e7f1d5",
    TREASURY_V2: "0x9a315bdf513367c0377fb36545857d12e85813ef",
    SOHM_V2: "0x04906695D6D12CF5459975d7C3C03356E4Ccd460",
    STAKING_V2: "0xB63cac384247597756545b500253ff8E607a8020",
    FIATDAO_WSOHM_ADDRESS: "0xe98ae8cD25CDC06562c29231Db339d17D02Fd486",
  },
  137: {
    DAI_ADDRESS: "0x8a9424745056Eb399FD19a0EC26A14316684e274", // duplicate
    OHM_ADDRESS: "0x9aB2B0730DFE6c44C0B9649Cc458B3A1438fbF31",
    TAZ_ADDRESS: "0xa583B35e2C080CC85955dE58aBE44e186599b341",
    STAKING_ADDRESS: "0x58517F6eD9Be72ecdc29126A0d22C2a69Df0867A",
    BRIDGE_ADDRESS: "0x6932a1bc437b0219c36eB9CB63c6ad83c26b7EFD",
    STAKING_HELPER_ADDRESS: "0xaB217aA0fD9fD0C6930f2827789622C4251E9058",
    BONDINGCALC_ADDRESS: "0x661d77B9fF1Cc4286eF476f5A21a6875926D732C",
    BONDINGCALC_TAZ_ADDRESS: "0x66abaAf86f972Dc0A30F6323F554FDF4C54Fe688",
    TREASURY_ADDRESS: "0x4a47fA1982421181dd0673393322645Fa482B3Ef",
    REDEEM_HELPER_ADDRESS: "0x27bCF334D7C3Ad8248B06E90ee8a3851c1de0A41",
  },
  80001: {
    DAI_ADDRESS: "0x8a9424745056Eb399FD19a0EC26A14316684e274", // duplicate
    OHM_ADDRESS: "0x494BF4795c80E01EA51EBD1cBc5d3C54fCD49Dba",
    BRIDGE_ADDRESS: "0x58b5Fc87a24E56050d7fA4d6ab39Cf71677ca007",
    TAZ_ADDRESS: "0xa583B35e2C080CC85955dE58aBE44e186599b341",
    STAKING_ADDRESS: "0x58517F6eD9Be72ecdc29126A0d22C2a69Df0867A",
    STAKING_HELPER_ADDRESS: "0xaB217aA0fD9fD0C6930f2827789622C4251E9058",
    BONDINGCALC_ADDRESS: "0x661d77B9fF1Cc4286eF476f5A21a6875926D732C",
    BONDINGCALC_TAZ_ADDRESS: "0x66abaAf86f972Dc0A30F6323F554FDF4C54Fe688",
    TREASURY_ADDRESS: "0x4a47fA1982421181dd0673393322645Fa482B3Ef",
    REDEEM_HELPER_ADDRESS: "0x27bCF334D7C3Ad8248B06E90ee8a3851c1de0A41",
  },
  42161: {
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    OHM_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    SOHM_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    OLD_SOHM_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    AOHM_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    WSOHM_ADDRESS: "0x739ca6D71365a08f584c8FC4e1029045Fa8ABC4B",
    MIGRATOR_ADDRESS: "0x1e7902a8b0adbf81042b5e30bdfa281f0b928d6d", // good
    GOHM_ADDRESS: "0x8D9bA570D6cb60C7e3e0F31343Efe75AB8E65FB1", // good
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
  }, // TODO: Replace with Arbitrum contract addresses when ready
  421611: {
    DAI_ADDRESS: "0x6b175474e89094c44da98b954eedeac495271d0f", // duplicate
    OHM_ADDRESS: "0x383518188c0c6d7730d91b2c03a03c837814a899",
    STAKING_ADDRESS: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a", // The new staking contract
    STAKING_HELPER_ADDRESS: "0xc8c436271f9a6f10a5b80c8b8ed7d0e8f37a612d", // Helper contract used for Staking only
    OLD_STAKING_ADDRESS: "0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2",
    SOHM_ADDRESS: "0x04F2694C8fcee23e8Fd0dfEA1d4f5Bb8c352111F",
    OLD_SOHM_ADDRESS: "0x31932E6e45012476ba3A3A4953cbA62AeE77Fbbe",
    PRESALE_ADDRESS: "0xcBb60264fe0AC96B0EFa0145A9709A825afa17D8",
    AOHM_ADDRESS: "0x24ecfd535675f36ba1ab9c5d39b50dc097b0792e",
    MIGRATE_ADDRESS: "0xC7f56EC779cB9e60afA116d73F3708761197dB3d",
    DISTRIBUTOR_ADDRESS: "0xbe731507810C8747C3E01E62c676b1cA6F93242f",
    BONDINGCALC_ADDRESS: "0xcaaa6a2d4b26067a391e7b7d65c16bb2d5fa571a",
    CIRCULATING_SUPPLY_ADDRESS: "0x0efff9199aa1ac3c3e34e957567c1be8bf295034",
    TREASURY_ADDRESS: "0x31f8cc382c9898b273eff4e0b7626a6987c846e8",
    // TODO (appleseed-lusd): swap this out
    PICKLE_OHM_LUSD_ADDRESS: "0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f",
    REDEEM_HELPER_ADDRESS: "0xE1e83825613DE12E8F0502Da939523558f0B819E",
  }, // TODO: Replace with Arbitrum Testnet contract addresses when ready
  43113: {
    DAI_ADDRESS: "0x2542250239e4800B89e47A813cD2B478822b2385", // duplicate
    OHM_ADDRESS: "0x784fE7511E5CE3a55f52CA1FeFA7d45D2B06E1FB",
    TAZ_ADDRESS: "0x81186E77c327b7D55Ca740Cd99B047e03a79946E",
    STAKING_ADDRESS: "0x9A841bfB84a11a44B10906D79FdDfC873A407461",
    BRIDGE_ADDRESS: "0xb1819E7C2a7e42Ce5a85d9FA98DCb98475557E25",
    STAKING_HELPER_ADDRESS: "",
    BONDINGCALC_ADDRESS: "0x661d77B9fF1Cc4286eF476f5A21a6875926D732C",
    BONDINGCALC_TAZ_ADDRESS: "0x66abaAf86f972Dc0A30F6323F554FDF4C54Fe688",
    TREASURY_ADDRESS: "0xcC7d6585F58Fb5cd64CfB1315e4Bcf347909a102",
    REDEEM_HELPER_ADDRESS: "0x6989ACFbcC0B00a2628A4A06cf95735Ab546BfC9",
    OLD_STAKING_ADDRESS: "",
    SOHM_ADDRESS: "",
    OLD_SOHM_ADDRESS: "",
    PRESALE_ADDRESS: "",
    AOHM_ADDRESS: "",
    MIGRATE_ADDRESS: "",
    DISTRIBUTOR_ADDRESS: "",
    CIRCULATING_SUPPLY_ADDRESS: "",
    PICKLE_OHM_LUSD_ADDRESS: "",
  }, // TODO: Avalanche Testnet addresses
  43114: {
    DAI_ADDRESS: "0x8a9424745056Eb399FD19a0EC26A14316684e274", // duplicate
    OHM_ADDRESS: "0x53e25b45a3f2a5c2d106643d52386d3e1f66ca5a",
    TAZ_ADDRESS: "0xa583B35e2C080CC85955dE58aBE44e186599b341",
    STAKING_ADDRESS: "0x58517F6eD9Be72ecdc29126A0d22C2a69Df0867A",
    BRIDGE_ADDRESS: "0xEA1fa055668078fcE852f4b24cF7ab1407d4Cc84",
    STAKING_HELPER_ADDRESS: "0xaB217aA0fD9fD0C6930f2827789622C4251E9058",
    BONDINGCALC_ADDRESS: "0x661d77B9fF1Cc4286eF476f5A21a6875926D732C",
    BONDINGCALC_TAZ_ADDRESS: "0x66abaAf86f972Dc0A30F6323F554FDF4C54Fe688",
    TREASURY_ADDRESS: "0x4a47fA1982421181dd0673393322645Fa482B3Ef",
    REDEEM_HELPER_ADDRESS: "0x27bCF334D7C3Ad8248B06E90ee8a3851c1de0A41",
  }, // TODO: Avalanche Mainnet addresses
};

/**
 * Network details required to add a network to a user's wallet, as defined in EIP-3085 (https://eips.ethereum.org/EIPS/eip-3085)
 */

interface INativeCurrency {
  name: string;
  symbol: string;
  decimals?: number;
}

interface INetwork {
  chainName: string;
  chainId: number;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls: string[];
  image: string;
  imageAltText: string;
  uri: () => string;
}

// These networks will be available for users to select. Other networks may be functional
// (e.g. testnets, or mainnets being prepared for launch) but need to be selected directly via the wallet.
// export const USER_SELECTABLE_NETWORKS = [1, 56, 42161, 43114];
export const USER_SELECTABLE_NETWORKS = [3, 97, 80001];

// Set this to the chain number of the most recently added network in order to enable the 'Now supporting X network'
// message in the UI. Set to -1 if we don't want to display the message at the current time.
export const NEWEST_NETWORK_ID = 43114;

export const NETWORKS: { [key: number]: INetwork } = {
  1: {
    chainName: "Ethereum",
    chainId: 1,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://mainnet.infura.io/v3/"],
    blockExplorerUrls: ["https://etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(1),
  },
  3: {
    chainName: "Ropsten Testnet",
    chainId: 3,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://ropsten.infura.io/v3/"],
    blockExplorerUrls: ["https://ropsten.etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(3),
  },
  4: {
    chainName: "Rinkeby Testnet",
    chainId: 4,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.infura.io/v3/"],
    blockExplorerUrls: ["https://rinkeby.etherscan.io/#/"],
    image: ethereum,
    imageAltText: "Ethereum Logo",
    uri: () => NodeHelper.getMainnetURI(4),
  },
  56: {
    chainName: "Binance",
    chainId: 56,
    nativeCurrency: {
      name: "Binance",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed1.binance.org/"],
    blockExplorerUrls: ["https://bscscan.io/#/"],
    image: binance,
    imageAltText: "Binance Logo",
    uri: () => NodeHelper.getMainnetURI(56),
  },
  97: {
    chainName: "Binance Test",
    chainId: 97,
    nativeCurrency: {
      name: "Binance",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.io/#/"],
    image: binance,
    imageAltText: "Binance Logo",
    uri: () => NodeHelper.getMainnetURI(97),
  },
  137: {
    chainName: "Polygon",
    chainId: 137,
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
    blockExplorerUrls: ["https://explorer.matic.network/"],
    image: polygon,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(137),
  },
  80001: {
    chainName: "Polygon Testnet",
    chainId: 80001,
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18,
    },
    rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
    blockExplorerUrls: ["https://polygonscan.com/"],
    image: polygon,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(80001),
  },
  42161: {
    chainName: "Arbitrum",
    chainId: 42161,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => NodeHelper.getMainnetURI(42161),
  },
  421611: {
    chainName: "Arbitrum Testnet",
    chainId: 421611,
    nativeCurrency: {
      name: "Ethereum",
      symbol: "ETH",
      decimals: 18,
    },
    rpcUrls: ["https://rinkeby.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://rinkeby-explorer.arbitrum.io/#/"],
    image: arbitrum,
    imageAltText: "Arbitrum Logo",
    uri: () => EnvHelper.alchemyArbitrumTestnetURI,
  },
  43113: {
    chainName: "Avalanche Fuji Testnet",
    chainId: 43113,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/#/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => EnvHelper.alchemyAvalancheTestnetURI,
  },
  43114: {
    chainName: "Avalanche",
    chainId: 43114,
    nativeCurrency: {
      name: "AVAX",
      symbol: "AVAX",
      decimals: 18,
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://cchain.explorer.avax.network/"],
    image: avalanche,
    imageAltText: "Avalanche Logo",
    uri: () => NodeHelper.getMainnetURI(43114),
  },
};

// VIEWS FOR NETWORK is used to denote which paths should be viewable on each network
// ... attempting to prevent contract calls that can't complete & prevent user's from getting
// ... stuck on the wrong view
interface IViewsForNetwork {
  dashboard: boolean;
  stake: boolean;
  wrap: boolean;
  zap: boolean;
  threeTogether: boolean;
  bonds: boolean;
  network: boolean;
}

export const VIEWS_FOR_NETWORK: { [key: number]: IViewsForNetwork } = {
  1: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
  },
  3: {
    dashboard: true,
    stake: true,
    wrap: true,
    zap: true,
    threeTogether: true,
    bonds: true,
    network: true,
  },
  56: {
    dashboard: true,
    stake: true,
    wrap: false,
    zap: false,
    threeTogether: true,
    bonds: true,
    network: true,
  },
  97: {
    dashboard: true,
    stake: true,
    wrap: false,
    zap: false,
    threeTogether: true,
    bonds: true,
    network: true,
  },
  42161: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
  },
  421611: {
    dashboard: true,
    stake: false,
    wrap: true,
    zap: false,
    threeTogether: false,
    bonds: false,
    network: true,
  },
  43114: {
    dashboard: true,
    stake: true,
    wrap: false,
    zap: false,
    threeTogether: true,
    bonds: true,
    network: true,
  },
  137: {
    dashboard: true,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: true,
    bonds: false,
    network: true,
  },
  80001: {
    dashboard: true,
    stake: false,
    wrap: false,
    zap: false,
    threeTogether: true,
    bonds: false,
    network: true,
  },
  43113: {
    dashboard: true,
    stake: true,
    wrap: false,
    zap: false,
    threeTogether: true,
    bonds: true,
    network: true,
  },
};
