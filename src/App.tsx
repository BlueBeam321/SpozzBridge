import { ThemeProvider } from "@material-ui/core/styles";
import { useEffect, useState, useCallback } from "react";
import { Route, Redirect, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import useTheme from "./hooks/useTheme";
import useBonds, { IAllBondData } from "./hooks/Bonds";
import { useAddress, useWeb3Context } from "./hooks/web3Context";
import useSegmentAnalytics from "./hooks/useSegmentAnalytics";
import { segmentUA } from "./helpers/userAnalyticHelpers";
import { shouldTriggerSafetyCheck } from "./helpers";

import { calcBondDetails, calcTokenDetails } from "./slices/BondSlice";
import { loadAppDetails } from "./slices/AppSlice";
import { loadAccountDetails, calculateUserBondDetails, getMigrationAllowances } from "./slices/AccountSlice";
import { getZapTokenBalances } from "./slices/ZapSlice";
import { info } from "./slices/MessagesSlice";
import { ethers } from "ethers";
import { Presale } from "./views";
import Sidebar from "./components/Sidebar/Sidebar.jsx";
import TopBar from "./components/TopBar/TopBar.jsx";
import CallToAction from "./components/CallToAction/CallToAction";
import NavDrawer from "./components/Sidebar/NavDrawer.jsx";
import Messages from "./components/Messages/Messages";
import MigrationModal from "src/components/Migration/MigrationModal";
import ChangeNetwork from "./views/ChangeNetwork/ChangeNetwork";
import { dark as darkTheme } from "./themes/dark.js";
import { light as lightTheme } from "./themes/light.js";
import { girth as gTheme } from "./themes/girth.js";
import "./style.scss";
import { useGoogleAnalytics } from "./hooks/useGoogleAnalytics";
import { initializeNetwork, switchNetwork } from "./slices/NetworkSlice";
import { useAppSelector } from "./hooks";
import Announcement from "./components/Announcement/Announcement";
import { IFrameEthereumProvider } from "@ledgerhq/iframe-provider";
import { NetworkID } from "./lib/Bond";

const DEBUG = false;
if (DEBUG) console.log("📡 Connecting to Mainnet Ethereum");

const useStyles = makeStyles(theme => ({}));

function App() {
  useSegmentAnalytics();
  useGoogleAnalytics();
  const location = useLocation();
  const dispatch = useDispatch();
  const [theme, toggleTheme, mounted] = useTheme();
  const currentPath = location.pathname + location.hash + location.search;
  const trimmedPath = location.pathname + location.hash;
  const classes = useStyles();
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const { connect, hasCachedProvider, provider, connected, chainChanged, onChainChangeComplete, chainID } =
    useWeb3Context();
  const address = useAddress();

  const [migrationModalOpen, setMigrationModalOpen] = useState(false);
  const migModalOpen = () => {
    setMigrationModalOpen(true);
  };
  const migModalClose = () => {
    dispatch(loadAccountDetails({ networkID: networkId, address, provider }));
    setMigrationModalOpen(false);
  };

  const isSmallerScreen = useMediaQuery("(max-width: 980px)");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const [walletChecked, setWalletChecked] = useState(false);
  const networkId = useAppSelector(state => state.network.networkId);

  // TODO (appleseed-expiredBonds): there may be a smarter way to refactor this
  const { bonds, lpTokens, expiredBonds } = useBonds(networkId);

  async function loadDetails(whichDetails: string) {
    // NOTE (unbanksy): If you encounter the following error:
    // Unhandled Rejection (Error): call revert exception (method="balanceOf(address)", errorArgs=null, errorName=null, errorSignature=null, reason=null, code=CALL_EXCEPTION, version=abi/5.4.0)
    // it's because the initial provider loaded always starts with networkID=1. This causes
    // address lookup on the wrong chain which then throws the error. To properly resolve this,
    // we shouldn't be initializing to networkID=1 in web3Context without first listening for the
    // network. To actually test rinkeby, change setnetworkID equal to 4 before testing.
    let loadProvider = provider;
    if (whichDetails === "app") {
      loadApp(loadProvider);
    }

    if (whichDetails === "network") {
      console.log("NETWORK--ID", networkId);
      if (
        networkId === 1 ||
        networkId === 3 ||
        networkId === 97 ||
        networkId == 56 ||
        networkId == 137 ||
        networkId == 80001
      ) {
        initNetwork(loadProvider);
      } else {
        switchNetwork({ provider: loadProvider, networkId: 97 });
      }
    }

    // don't run unless provider is a Wallet...
    if (whichDetails === "account" && address && connected) {
      loadAccount(loadProvider);
    }
  }

  const initNetwork = useCallback(loadProvider => {
    dispatch(initializeNetwork({ provider: loadProvider }));
  }, []);

  const loadApp = useCallback(
    loadProvider => {
      if (networkId == -1) {
        return;
      }
      dispatch(loadAppDetails({ networkID: networkId, provider: loadProvider, address: address }));
      // NOTE (appleseed) - tech debt - better network filtering for active bonds
    },
    [networkId],
  );

  const loadAccount = useCallback(
    loadProvider => {
      if (networkId == -1) {
        return;
      }

      dispatch(loadAccountDetails({ networkID: networkId, address, provider: loadProvider }));
      dispatch(getMigrationAllowances({ address, provider: loadProvider, networkID: networkId }));
    },
    [networkId, address],
  );

  const oldAssetsDetected = useAppSelector(state => {
    return false;
  });

  const oldAssetsEnoughToMigrate = useAppSelector(state => {
    if (!state.app.currentIndex || !state.app.marketPrice) {
      return true;
    }
    const wrappedBalance = Number(state.account.balances.wsohm) * Number(state.app.currentIndex!);
    const allAssetsBalance =
      Number(state.account.balances.sohmV1) + Number(state.account.balances.ohmV1) + wrappedBalance;
    return state.app.marketPrice * allAssetsBalance >= 10;
  });

  const newAssetsDetected = useAppSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.gohm) ||
      Number(state.account.balances.sohm) ||
      Number(state.account.balances.tazor || Number(state.account.balances.taz))
        ? true
        : false)
    );
  });

  // The next 3 useEffects handle initializing API Loads AFTER wallet is checked
  //
  // this useEffect checks Wallet Connection & then sets State for reload...
  // ... we don't try to fire Api Calls on initial load because web3Context is not set yet
  // ... if we don't wait we'll ALWAYS fire API calls via JsonRpc because provider has not
  // ... been reloaded within App.
  useEffect(() => {
    if (hasCachedProvider()) {
      // then user DOES have a wallet
      connect().then(() => {
        setWalletChecked(true);
        segmentUA({
          type: "connect",
          provider: provider,
          context: currentPath,
        });
      });
    } else {
      // then user DOES NOT have a wallet
      // walletConnect();
      setWalletChecked(true);
      // connect().then(() => {
      //   setWalletChecked(true);
      //   segmentUA({
      //     type: "connect",
      //     provider: provider,
      //     context: currentPath,
      //   });
      // });
    }
    if (shouldTriggerSafetyCheck()) {
      dispatch(info("Safety Check: Always verify you're on spozz.club"));
    }
  }, []);

  // this useEffect fires on state change from above. It will ALWAYS fire AFTER
  useEffect(() => {
    // don't load ANY details until wallet is Checked
    if (walletChecked) {
      dispatch(initializeNetwork({ provider: provider }));
      loadDetails("network").then(() => {
        if (networkId !== -1) {
          console.log("Network Chainged", networkId);
          loadDetails("account");
          loadDetails("app");
        }
      });
      onChainChangeComplete();
    }
  }, [walletChecked, chainChanged, networkId]);

  // this useEffect picks up any time a user Connects via the button
  useEffect(() => {
    // don't load ANY details until wallet is Connected
    if (connected && networkId !== -1) {
      loadDetails("account");
    }
  }, [connected, networkId]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const walletConnect = async () => {
    try {
      let account = await window.ethereum.request({ method: "eth_requestAccounts" });
      return account;
    } catch (e: unknown) {
      console.log("error...");
    }
    // await provider2.send("eth_requestAccounts", []);
  };

  const handleSidebarClose = () => {
    setIsSidebarExpanded(false);
  };

  let themeMode = darkTheme;

  useEffect(() => {
    themeMode = theme === "light" ? darkTheme : darkTheme;
  }, [theme]);

  useEffect(() => {
    if (isSidebarExpanded) handleSidebarClose();
  }, [location]);

  const accountBonds = useAppSelector(state => {
    const withInterestDue = [];
    for (const bond in state.account.bonds) {
      if (state.account.bonds[bond].interestDue > 0) {
        withInterestDue.push(state.account.bonds[bond]);
      }
    }
    return withInterestDue;
  });
  const hasActiveV1Bonds = accountBonds.length > 0;

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      {/* {isAppLoading && <LoadingSplash />} */}
      <div className={`app ${isSmallerScreen && "tablet"} ${isSmallScreen && "mobile"} dark`}>
        <Messages />
        <TopBar theme={theme} toggleTheme={toggleTheme} handleDrawerToggle={handleDrawerToggle} />
        <Announcement />
        <div style={{ overflowY: "scroll" }}>
          {oldAssetsDetected &&
            !hasActiveV1Bonds &&
            trimmedPath.indexOf("dashboard") === -1 &&
            oldAssetsEnoughToMigrate && <CallToAction setMigrationModalOpen={setMigrationModalOpen} />}

          <Switch>
            <Route path="/">
              <Route exact path={`/`}>
                <Presale />
              </Route>
            </Route>
            <Route path="/network">
              <ChangeNetwork />
            </Route>
          </Switch>
        </div>

        <MigrationModal open={migrationModalOpen} handleClose={migModalClose} />
      </div>
    </ThemeProvider>
  );
}

export default App;
