import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, Button, Divider, Fade, Link, Paper, Popper, Slide, SvgIcon, Typography } from "@material-ui/core";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as CaretDownIcon } from "../../assets/icons/caret-down.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Trans } from "@lingui/macro";
import { trim, shorten } from "../../helpers";

function ConnectMenu({ theme }) {
  const { connect, disconnect, connected, web3, address } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isConnected, setConnected] = useState(connected);
  const [isHovering, setIsHovering] = useState(false);

  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");
  const isSmallScreen = useMediaQuery("(max-width: 500px)");

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  let buttonText = <Trans>Connect</Trans>;
  let clickFunc = connect;

  const handleClick = event => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  if (isConnected) {
    buttonText = shorten(address);
    clickFunc = disconnect;
  }

  if (pendingTransactions && pendingTransactions.length > 0) {
    buttonText = <Trans>In progress</Trans>;
    clickFunc = handleClick;
  }

  const open = Boolean(anchorEl);
  const id = open ? "ohm-popper-pending" : undefined;

  const primaryColor = theme === "light" ? "#49A1F2" : "#F8CC82";
  const buttonStyles =
    "pending-txn-container" + (isHovering && pendingTransactions.length > 0 ? " hovered-button" : "");

  const getEtherscanUrl = txnHash => {
    switch (networkId) {
      case 1:
        return "https://etherscan.io/tx/" + txnHash;
      case 3:
        return "https://ropsten.etherscan.io/tx/" + txnHash;
      case 42161:
        return "https://explorer.arbitrum.io/tx/" + txnHash;
      case 421611:
        return "https://rinkeby-explorer.arbitrum.io/tx/" + txnHash;
      case 43113:
        return "https://testnet.snowtrace.io/tx/" + txnHash;
      case 43114:
        return "https://snowtrace.io/tx/" + txnHash;
    }
  };

  useEffect(() => {
    if (pendingTransactions.length === 0) {
      setAnchorEl(null);
    }
  }, [pendingTransactions]);

  useEffect(() => {
    setConnected(connected);
  }, [web3, connected]);

  return (
    <div
      onMouseEnter={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      onMouseLeave={e => (pendingTransactions && pendingTransactions.length > 0 ? handleClick(e) : null)}
      className="wallet-menu"
      id="wallet-menu"
    >
      <Button
        id="wallet-button"
        variant="contained"
        color="primary"
        size="large"
        style={pendingTransactions.length > 0 ? { color: primaryColor } : {}}
        onClick={clickFunc}
        onMouseOver={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        key={1}
      >
        {buttonText}
      </Button>

      <Popper id={id} open={open} anchorEl={anchorEl} placement="bottom-end" transition>
        {({ TransitionProps }) => {
          return (
            <Fade {...TransitionProps} timeout={100}>
              <Paper className="ohm-menu" elevation={1}>
                <Box className="add-tokens">
                  <Button
                    size="large"
                    variant="contained"
                    color="primary"
                    onClick={disconnect}
                    style={{ marginBottom: "0px", padding: "15px", margin: "15px" }}
                    fullWidth
                  >
                    <Typography>{shorten(address)}</Typography>
                  </Button>
                </Box>
              </Paper>
            </Fade>
          );
        }}
      </Popper>
    </div>
  );
}

export default ConnectMenu;
