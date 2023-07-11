import { AppBar, Toolbar, Box, Button, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
import { ReactComponent as OlympusIcon } from "../../assets/icons/TAZOR_logo.svg";
import OhmMenu from "./OhmMenu.jsx";
import ThemeSwitcher from "./ThemeSwitch.jsx";
import LocaleSwitcher from "./LocaleSwitch.tsx";
import ConnectMenu from "./ConnectMenu.jsx";
import "./topbar.scss";
import NetworkMenu from "./NetworkMenu.jsx";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "#2225",
    backdropFilter: "none",
    marginBottom: "20px",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },

  logo: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: "20px",
  },
  logoTitle: {
    fontFamily: "Montserrat",
    fontStyle: "normal",
    fontweight: "500",
    fontSize: "36px",
    lineHeight: "44px",
    letterSpacing: "0.18em",
    color: "#6D83FB",
  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle }) {
  const classes = useStyles();

  const Logo = () => {
    return (
      <div className={classes.logo}>
        <img src="/logo192.png" height="64px" />
        <span className={classes.logoTitle}>|SPOZZ</span>
      </div>
    );
  };

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Box display="flex" justifyContent="space-between" width="100%">
          <Logo />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <OhmMenu />
            <ConnectMenu theme={theme} />
          </div>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
