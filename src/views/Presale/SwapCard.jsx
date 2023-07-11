import {
  Paper,
  Button,
  Box,
  Grid,
  FormControl,
  OutlinedInput,
  InputLabel,
  Typography,
  MenuItem,
  Dialog,
  CircularProgress,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
} from "@material-ui/core";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import SwapHorizIcon from "@material-ui/icons/SwapHoriz";
import InfoTooltipMulti from "../../components/InfoTooltip/InfoTooltipMulti";
import TabPanel from "../../components/TabPanel";
import CardHeader from "../../components/CardHeader/CardHeader";
import CustomInput from "../../components/CustomInput/CustomInput";
import { NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { switchNetwork, initializeNetwork } from "../../slices/NetworkSlice";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3Context } from "../../hooks/web3Context";
import { useAppSelector } from "src/hooks";
import { error, info } from "../../slices/MessagesSlice";
import { loadAccountDetails } from "../../slices/AccountSlice";
import { swapToken, approveToken } from "../../slices/PresaleThunk";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import ethereum from "../../assets/tokens/wETH.svg";
import arbitrum from "../../assets/arbitrum.png";
import avalanche from "../../assets/tokens/AVAX.svg";
import polygon from "../../assets/tokens/polygon.svg";
import binance from "../../assets/binance.png";

import "./presale.scss";

const networkList = [
  {
    id: 4,
    key: "eth",
    title: "Ethereum",
    image: ethereum,
  },
  {
    id: 97,
    key: "bsc",
    title: "Binance",
    image: binance,
  },
  {
    id: 80001,
    key: "polygon",
    title: "Polygon",
    image: polygon,
  },
];

// export function SwapCard({ srcSwapBalance, setSrcSwapCallback }) {
export function SwapCard() {
  const dispatch = useDispatch();
  const { connect, disconnect, connected, web3, provider, address, chainID, chainChanged } = useWeb3Context();

  const [srcSwapBalance, setSrcSwapBalance] = useState(0);
  const [open, setOpen] = useState(false);
  const [isSwapButtonClicked, setSwapButtonClicked] = useState(false);
  const handleClickOpen = (e) => {
    console.log("Button Object", e);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // const [dstSwapBalance, setDstSwapBalance] = useState(0);
  const srcSpotBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.srcSpotBalance;
  });

  const dstSpotBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.dstSpotBalance;
  });

  const spotBalances = useAppSelector(state => {
    return state.account.balances && state.account.balances.spotBalances;
  });

  const tokenAllowance = useAppSelector(state => {
    return state.account.balances && state.account.balances.tokenAllowance;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const toFixed = (number, digit) => {

    let strValue = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: digit,
      minimumFractionDigits: digit,
    }).format(number);

    return strValue.replace(",", "'");
  };

  const networkId = useAppSelector(state => state.network.networkId);

  const [srcNetIndex, setSrcNetIndex] = useState(0);
  const [dstNetworkList, setDestinationNetworkList] = useState(networkList);
  const [dstNetIndex, setDstNetIndex] = useState(0);

  useEffect(() => {
    // don't load ANY details until wallet is Checked
    dispatch(initializeNetwork({ provider: provider }));

    const id = networkList.findIndex(item => item.id == networkId);
    console.log("network ID, index", networkId, id);

    if (networkId == -1) return;

    if (id == -1) {
      // dispatch(error("Unsupported Network. Please Switch Network"));
      dispatch(switchNetwork({ provider: provider, networkId: networkList[0].id }));
      return;
    }
    setSrcNetIndex(id);

    let list = [];
    networkList.map((item, index) => {
      if (id != index) list.push(item);
    });
    setDestinationNetworkList(list);
  }, [chainChanged, networkId, chainID, connected]);

  const onApprove = async () => {
    console.log(srcSpotBalance);
    const totalBalance = Number(srcSpotBalance);
    if (totalBalance < srcSwapBalance || totalBalance == 0) {
      return dispatch(info("You have not enough balance."));
    }

    if (srcSwapBalance == 0)
      return dispatch(info("Please input swap amount."));
    await dispatch(
      approveToken({
        amount: srcSwapBalance,
        provider,
        address,
        networkID: networkId,
      }),
    );

    dispatch(loadAccountDetails({ networkID: networkId, address, provider }));
  };

  const onSwap = async () => {
    const dstNetworkID = dstNetworkList[dstNetIndex].id;
    const totalBalance = Number(srcSpotBalance);

    setSwapButtonClicked(true);
    if (totalBalance < srcSwapBalance || totalBalance == 0) {
      setSwapButtonClicked(false);
      return dispatch(info("You have not enough balance."));
    }
    if (srcSwapBalance == 0){
      setSwapButtonClicked(false);
      return dispatch(info("Please input swap amount."));
    }
    await dispatch(
      swapToken({
        amount: srcSwapBalance,
        provider,
        address,
        networkID: networkId,
        dstNetworkID,
      }),
    );
    setSwapButtonClicked(false);
    setSrcSwapBalance(Number(0));
  };

  const setSrcSwapCallback = value => {
    console.log(srcSwapBalance);
    setSrcSwapBalance(value);
    // setDstSwapBalance(value);
  };

  const onSrcNetworkChanged = id => {
    if (!connected) return dispatch(info("Please connect to wallet"));
    dispatch(switchNetwork({ provider: provider, networkId: networkList[id].id })).then(e => {
      let list = [];
      networkList.map((item, index) => {
        if (id != index) list.push(item);
      });
      setDestinationNetworkList(list);
      setSrcNetIndex(id);
      setDstNetIndex(0);
    });
  };

  const onDstNetworkChanged = id => {
    setDstNetIndex(id);
  };

  const NetworkIcon = ({ list, id }) => {
    return (
      <div style={{ display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
        <img src={list[id].image} width="45px" height="45px" />
        <span className="network-name">{list[id].title}</span>
      </div>
    );
  };

  const DestinationNetwork = () => {
    return (
      <div className="item">
        <span className="label">To</span>
        <NetworkIcon list={dstNetworkList} id={dstNetIndex} />
        <span className="label">Amount</span>
        <FormControl className="ohm-input" variant="outlined" color="primary">
          <CustomInput
            value={srcSwapBalance * 0.95}
            onChange={e => null}
            select={dstNetIndex}
            onSelectChange={onDstNetworkChanged}
            itemList={dstNetworkList}
          />
        </FormControl>
        <Grid container direction="column" spacing={1} style={{ marginTop: "10px" }}>
          <Grid item>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: "flex" }}>
                <span className="label">Balance</span>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: "flex" }} justifyContent="flex-end">
                {
                  (srcSpotBalance || !connected) ?
                    <span className="label">
                      {toFixed(spotBalances ? spotBalances[dstNetworkList[dstNetIndex].key] : 0, 2)} SPOZZ
                    </span> :
                    <CircularProgress color="secondary" style={{ width: "10px !important" }} />
                }

              </Grid>
            </Grid>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: "flex" }}>
                <span className="label">Balance after receiving</span>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: "flex" }} justifyContent="flex-end">
                {
                  (srcSpotBalance || !connected) ?
                    <span className="label">
                      {toFixed(spotBalances ? spotBalances[dstNetworkList[dstNetIndex].key] * 1 + srcSwapBalance * 0.95 : 0, 2)} SPOZZ
                    </span> :
                    <CircularProgress color="secondary" style={{ width: "10px !important" }} />
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
  };

  const ButtonGroup = () => {
    if (connected)
      return (
        <div className="swap-button-container">
          <Button
            variant="contained"
            color="primary"
            onClick={onApprove}
            disabled={
              isPendingTxn(pendingTransactions, "approving") || tokenAllowance > 0 || tokenAllowance == undefined
            }
          >
            {txnButtonText(pendingTransactions, "approving", "Approve")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={
              tokenAllowance <= 0 || 
              tokenAllowance == undefined ||
              isSwapButtonClicked ||
              isPendingTxn(pendingTransactions, "swapping")
            }
            onClick={onSwap}
          >
            {txnButtonText(pendingTransactions, "swapping", "Swap")}
          </Button>
        </div>
      );
    else
      return (
        <div className="swap-button-container">
          <Button variant="contained" color="primary" onClick={connect}>
            Connect
          </Button>
        </div>
      );
  };

  const SwitchNetworkButton = () => {
    return (
      <div className="network-swtich-button-container">
        <div className="button">
          <img src="/switch-button.png" style={{ color: "white" }} />
        </div>
      </div>
    );
  };

  const SwapAlertDialog = () => {
    return (
      <div style={{ background: "#ff0 !important" }}>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <span style={{ color: "#fff", fontSize: "22px" }}>Confirm</span>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <span style={{ color: "#fff", fontSize: "20px" }}>Are you sure to swap SPOZZ token?</span>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="outlined" color="secondary" onClick={onSwap} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  return (
    // <Paper className="ohm-card">
    <Box display="flex" flexDirection="column">
      <div>
        <SwapAlertDialog />
      </div>
      <div className="swapcard">
        <div className="item">
          <span className="label">From</span>
          <NetworkIcon list={networkList} id={srcNetIndex} />
          <span className="label">Amount</span>
          <FormControl className="ohm-input" variant="outlined" color="primary">
            <CustomInput
              value={srcSwapBalance}
              onChange={e => setSrcSwapCallback(e.target.value)}
              select={srcNetIndex}
              onSelectChange={onSrcNetworkChanged}
              itemList={networkList}
            />
          </FormControl>
          <Grid container direction="column" spacing={1} style={{ marginTop: "10px" }}>
            <Grid item>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: "flex" }}>
                  <span className="label">Balance</span>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: "flex" }} justifyContent="flex-end">
                  {
                    (srcSpotBalance || !connected) ?
                      <span className="label">{toFixed(srcSpotBalance, 2)} SPOZZ</span> :
                      <CircularProgress color="secondary" style={{ width: "10px !important" }} />
                  }
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: "flex" }}>
                  <span className="label">Fee</span>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} style={{ display: "flex" }} justifyContent="flex-end">
                  {
                    (srcSpotBalance || !connected) ?
                      <span className="label">5 %</span> :
                      <CircularProgress color="secondary" style={{ width: "10px !important" }} />
                  }
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
        <SwitchNetworkButton />
        <DestinationNetwork />
      </div>
      <ButtonGroup />
    </Box>
  );
}
