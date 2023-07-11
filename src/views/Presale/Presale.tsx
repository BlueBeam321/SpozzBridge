import { memo, useState, ChangeEvent, useEffect } from "react";
import "./presale.scss";
import { QueryClient, QueryClientProvider } from "react-query";
import { Paper, Grid, Box, Tab, Tabs, Zoom, Button, Container, useMediaQuery, Typography } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import CardHeader from "../../components/CardHeader/CardHeader";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "src/hooks/web3Context";
import { t, Trans } from "@lingui/macro";
import TabPanel from "../../components/TabPanel";
import { PresaleCard } from "./PresaleCard";
import { FairLaunchCard } from "./FairLaunchCard";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { error, info } from "../../slices/MessagesSlice";
import { useAppSelector } from "src/hooks";
import { swapToken, approveToken } from "../../slices/PresaleThunk";
import { getBridgeBalances } from "../../slices/AccountSlice";
import { SwapCard } from "./SwapCard";

type InputEvent = ChangeEvent<HTMLInputElement>;

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Presale = memo(() => {
  const dispatch = useDispatch();
  const { provider, address, connect } = useWeb3Context();
  const networkId = useAppSelector(state => state.network.networkId);

  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  const [srcNetName, setSrcNetName] = useState("ETH");
  const [dstNetName, setdstNetName] = useState(80001);
  const [tazorBalance, setTazorBalance] = useState(0);
  const [tazBalance, setTazBalance] = useState(0);
  const [srcSwapBalance, setSrcSwapBalance] = useState(0);
  const [dstSwapBalance, setDstSwapBalance] = useState(0);
  // tabs
  const [view, setView] = useState<number>(0);
  const [nativeTokenName, setNativeTokenName] = useState("");
  const changeView = (event: ChangeEvent<{}>, value: string | number): void => {
    setView(Number(value));
  };
  // --

  useEffect(() => {
    if (networkId == 1 || networkId == 4) {
      setSrcNetName("ETH");
    } else if (networkId == 56 || networkId == 97) {
      setSrcNetName("BSC");
    } else if (networkId == 137 || networkId == 80001) {
      setSrcNetName("Polygon");
    }

    setdstNetName(secondNetworkID);
  }, [networkId, dstNetName]);

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const secondNetworkID = useAppSelector(state => {
    return state.account.balances && state.account.balances.secondNetworkID;
  });

  const srcSpotBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.tazor;
  });

  const dstSpotBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.taz;
  });

  const tazPurchasedBalance =
    useAppSelector(state => {
      return state.account.presale && state.account.presale.tazPurchasedBalance;
    }) || 0;

  const pendingPayoutPresale = useAppSelector(state => {
    return state.account.presale && state.account.presale.pendingPayoutPresale;
  });

  const vestingPeriodPresale = useAppSelector(state => {
    return state.account.presale && state.account.presale.vestingPeriodPresale;
  });

  const setSrcSwapCallback = (value: number) => {
    setSrcSwapBalance(value);
    setDstSwapBalance(value);
  };

  const setDstSwapCallback = (value: number) => {
    setSrcSwapBalance(value);
    setDstSwapBalance(value);
  };

  const setDstNetSelCallback = async (event: InputEvent) => {
    const value = Number(event.target.value);
    console.log("currentnetId", value);
    setdstNetName(value);
    await dispatch(getBridgeBalances({ address, networkID: networkId, provider, secondNetworkID: value }));
    setdstNetName(secondNetworkID);
  };

  const onSpotSwap = async () => {
    await dispatch(
      swapToken({
        amount: srcSwapBalance,
        provider,
        address,
        networkID: networkId,
        dstNetworkID: dstNetName,
      }),
    );
  };

  const onApprove = async () => {
    const totalBalance = Number(srcSpotBalance);
    if (totalBalance < srcSwapBalance) {
      return dispatch(info("You have not enough balance."));
    }
    await dispatch(
      approveToken({
        amount: srcSwapBalance,
        provider,
        address,
        networkID: networkId,
      }),
    );
  };

  let modalButton = [];

  modalButton.push(
    <Button
      variant="contained"
      color="primary"
      className="connect-button"
      disabled={isPendingTxn(pendingTransactions, "approving")}
      onClick={onApprove}
    >
      Approve
    </Button>,
  );

  modalButton.push(
    <Button
      className="stake-button"
      variant="contained"
      color="primary"
      disabled={isPendingTxn(pendingTransactions, "swapping")}
      onClick={() => {
        onSpotSwap();
      }}
    >
      {txnButtonText(pendingTransactions, "swapping", "Swap")}
    </Button>,
  );

  return (
    <div id="swappage-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <div>
        <Typography className="header-title" style={{ fontSize: "4em", paddingBottom: "40px", textAlign: "center" }}>
          Bridge SPOZZ Tokens
        </Typography>
      </div>
      <div>
        <Typography style={{ fontSize: "1.7em", paddingBottom: "20px", textAlign: "center" }}>
          Change your SPOZZ tokens between Ethereum, Polygon and Binance Smart Chain Network
        </Typography>
      </div>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Zoom in={true}>
          <Paper>
            <SwapCard />
            {/* <TabPanel value={view} index={0}>
              <PresaleCard
                srcTokenBalance={srcSpotBalance}
                dstTokenBalance={dstSpotBalance}
                srcSwapBalance={srcSwapBalance}
                dstSwapBalance={dstSwapBalance}
                setSrcSwapCallback={setSrcSwapCallback}
                setDstSwapCallback={setDstSwapCallback}
                setDstNetSelCallback={setDstNetSelCallback}
                srcNetName={srcNetName}
                dscNetName={dstNetName}
                modalButton={modalButton}
              />
            </TabPanel> */}
          </Paper>
        </Zoom>
      </Container>
    </div>
  );
});

const queryClient = new QueryClient();

// Normally this would be done
// much higher up in our App.
export default () => (
  <QueryClientProvider client={queryClient}>
    <Presale />
  </QueryClientProvider>
);
