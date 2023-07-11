import { useSelector, useDispatch } from "react-redux";
import { getRebaseBlock, secondsUntilBlock, prettifySeconds_ } from "../../helpers";
import { Box, Typography } from "@material-ui/core";
import "./rebasetimer.scss";
import { Skeleton } from "@material-ui/lab";
import { useEffect, useMemo, useState } from "react";
import { loadAppDetails } from "../../slices/AppSlice";
import { useWeb3Context } from "../../hooks/web3Context";
import { Trans } from "@lingui/macro";
import { getBalances } from "src/slices/AccountSlice";

function PresaleTimer() {
  const dispatch = useDispatch();
  const { provider, address } = useWeb3Context();
  const networkId = useSelector(state => state.network.networkId);

  const SECONDS_TO_REFRESH = 60;
  const MIN_LOCKTIME = 360000000;
  const [rebaseString, setRebaseString] = useState("");
  const [secondsToRefresh, setSecondsToRefresh] = useState(SECONDS_TO_REFRESH);
  const [calcTime, setCalcTime] = useState(0);

  const presaleLeftTime = useSelector(state => {
    return state.account.balances.presaleLeftTime;
  });

  useEffect(() => {
    console.log("[tz]==> initializetimer, presaleLeftTime: ", presaleLeftTime);
    setCalcTime(presaleLeftTime);
    const prettified = prettifySeconds_(calcTime);
    setRebaseString(prettified !== "" ? prettified : "Finished");
  }, [presaleLeftTime]);

  useEffect(() => {
    let interval = null;
    if (calcTime > 0) {
      interval = setInterval(() => {
        setCalcTime(calcTime => calcTime - 1);
        const prettified = prettifySeconds_(calcTime);
        setRebaseString(prettified !== "" ? prettified : "Finished");
      }, 1000);
    } else {
      // When the countdown goes negative, reload the app details and reinitialize the timer
      setRebaseString("Finished");
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [calcTime]);

  return (
    <Box className="rebase-timer">
      <Typography variant="h4">
        {presaleLeftTime ? (
          presaleLeftTime > 0 ? (
            <>
              <strong>{rebaseString}&nbsp;</strong>
            </>
          ) : (
            <strong>Finished</strong>
          )
        ) : (
          <Skeleton width="155px" />
        )}
      </Typography>
    </Box>
  );
}

export default PresaleTimer;
