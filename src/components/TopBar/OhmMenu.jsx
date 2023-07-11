import { useState } from "react";
import { addresses, TOKEN_DECIMALS } from "../../constants";
import { NavLink, useLocation } from "react-router-dom";
import { Link, SvgIcon, Popper, Button, Paper, Typography, Divider, Box, Fade, Slide } from "@material-ui/core";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
// import { ReactComponent as sOhmTokenImg } from "../../assets/tokens/token_sOHM.svg";
// import { ReactComponent as wsOhmTokenImg } from "../../assets/tokens/token_wsOHM.svg";
// import { ReactComponent as ohmTokenImg } from "../../assets/tokens/token_OHM.svg";
import { ReactComponent as t33TokenImg } from "../../assets/tokens/token_33T.svg";
import { ReactComponent as TazorTokenImg } from "../../assets/tokens/token_TAZOR.svg";
import { ReactComponent as TazTokenImg } from "../../assets/tokens/token_TAZ.svg";

import "./ohmmenu.scss";
import { dai, usdc } from "src/helpers/AllBonds";
import { Trans } from "@lingui/macro";
import Grid from "@material-ui/core/Grid";
// import OhmImg from "src/assets/tokens/token_OHM.svg";
import tazorImg from "src/assets/tokens/token_TAZOR.svg";
import tazImg from "src/assets/tokens/token_TAZ.svg";
import SOhmImg from "src/assets/tokens/token_sOHM.svg";
import WsOhmImg from "src/assets/tokens/token_wsOHM.svg";
// import token33tImg from "src/assets/tokens/token_33T.svg";
import { segmentUA } from "../../helpers/userAnalyticHelpers";
import { useSelector } from "react-redux";
import { useWeb3Context } from "../../hooks";

const addTokenToWallet = (tokenSymbol, tokenAddress, address) => async () => {
  if (window.ethereum) {
    const host = window.location.origin;
    let tokenPath;
    let tokenDecimals = TOKEN_DECIMALS;

    const imageURL = `${host}/favicon.png`;

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: imageURL,
          },
        },
      });
      let uaData = {
        address: address,
        type: "Add Token",
        tokenName: tokenSymbol,
      };
      segmentUA(uaData);
    } catch (error) {
      console.log(error);
    }
  }
};

function OhmMenu() {
  const path = useLocation().pathname;
  const [anchorEl, setAnchorEl] = useState(null);
  const isEthereumAPIAvailable = window.ethereum;
  const { address } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);

  const oldAssetsDetected = useSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.sohmV1) ||
      Number(state.account.balances.ohmV1) ||
      Number(state.account.balances.wsohm)
        ? true
        : false)
    );
  });

  const newAssetsDetected = useSelector(state => {
    return (
      state.account.balances &&
      (Number(state.account.balances.gohm) || Number(state.account.balances.sohm) || Number(state.account.balances.ohm)
        ? true
        : false)
    );
  });

  const SOHM_ADDRESS = addresses[networkId] && addresses[networkId].TAZ_ADDRESS;
  const OHM_ADDRESS = addresses[networkId] && addresses[networkId].OHM_ADDRESS;
  const PT_TOKEN_ADDRESS = addresses[networkId] && addresses[networkId].TAZ_ADDRESS;
  const GOHM_ADDRESS = addresses[networkId] && addresses[networkId].GOHM_ADDRESS;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = "ohm-popper";
  const daiAddress = dai.getAddressForReserve(networkId);
  // const fraxAddress = usdc.getAddressForReserve(networkId);
  return (
    <Grid
      container
      component="div"
      onMouseEnter={e => handleClick(e)}
      onMouseLeave={e => handleClick(e)}
      id="ohm-menu-button-hover"
    >
      <Button
        id="ohm-menu-button"
        size="large"
        variant="contained"
        color="primary"
        title="SPOZZ"
        aria-describedby={id}
        onClick={addTokenToWallet("SPOZZ", OHM_ADDRESS, address)}
      >
        <SvgIcon component={InfoIcon} color="primary" />
        <span>ADD SPOZZ TO WALLET</span>
      </Button>
    </Grid>
  );
}

export default OhmMenu;
