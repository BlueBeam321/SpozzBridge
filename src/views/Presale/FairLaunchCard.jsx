import { Paper, Button, Box, Grid, FormControl, OutlinedInput, InputAdornment, Typography } from "@material-ui/core";
import { Skeleton } from "@material-ui/lab";
import CardHeader from "../../components/CardHeader/CardHeader";

export function FairLaunchCard({
  title,
  address,
  tokenName,
  tazorPurchasedBalance,
  tazPurchasedBalance,
  pendingPayoutPresale,
  vestingPeriodPresale,
  claimButton,
}) {
  return (
    // <Paper className="ohm-card">
    <Box display="flex" flexDirection="column">
      <Grid container direction="column" spacing={2}>
        <Grid item>
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={4} md={4} lg={4} />
            <Grid item xs={12} sm={4} md={4} lg={4}>
              {address ? claimButton[1] : claimButton[0]}
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} />
          </Grid>
          <br />
          <br />
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={4} md={4} lg={4} />
            <Grid item xs={12} sm={4} md={4} lg={4}>
              {address ? claimButton[2] : claimButton[0]}
            </Grid>
            <Grid item xs={12} sm={4} md={4} lg={4} />
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
