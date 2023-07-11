import {
  Paper,
  Button,
  Box,
  Grid,
  FormControl,
  OutlinedInput,
  InputLabel,
  Select,
  Typography,
  MenuItem,
  InputAdornment,
} from "@material-ui/core";
import InfoTooltipMulti from "../../components/InfoTooltip/InfoTooltipMulti";
import TabPanel from "../../components/TabPanel";
import CardHeader from "../../components/CardHeader/CardHeader";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export function PresaleCard({
  srcTokenBalance,
  dstTokenBalance,
  srcSwapBalance,
  dstSwapBalance,
  setSrcSwapCallback,
  setDstSwapCallback,
  setDstNetSelCallback,
  srcNetName,
  dscNetName,
  modalButton,
  // setDstNetChangeCallback,
}) {
  const [value, setValue] = useState(80001);
  const changeNet = e => {
    setValue(e.target.value);
    setDstNetSelCallback(e);
  };

  return (
    // <Paper className="ohm-card">
    <Box display="flex" flexDirection="column">
      <Grid container direction="row" style={{ padding: "10px" }}>
        <FormControl variant="outlined" color="primary" fullWidth>
          <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ marginBottom: "5px" }}>From </h3>
            <h3 style={{ marginBottom: "5px" }}>Balance: {Number(srcTokenBalance).toFixed(2)}</h3>
          </div>
        </FormControl>
        <Grid container direction="row">
          <Grid item xs={12} sm={7}>
            <FormControl className="ohm-input" variant="outlined" color="primary">
              <OutlinedInput
                type="number"
                placeholder="0"
                value={srcSwapBalance ? srcSwapBalance : ""}
                onChange={e => setSrcSwapCallback(e.target.value)}
                labelWidth={0}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1}>
            <FormControl className="ohm-input" variant="outlined">
              <Typography variant="h3" align="center">
                SPOT
              </Typography>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={2}>
            <FormControl className="ohm-input" variant="outlined">
              <Button className="stake-button" variant="contained" color="primary" component={NavLink} to="/network">
                {srcNetName}
              </Button>
            </FormControl>
          </Grid>
        </Grid>
        <FormControl variant="outlined" color="primary" fullWidth style={{ marginTop: "20px" }}>
          <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={{ marginBottom: "5px" }}>To </h3>
            <h3 style={{ marginBottom: "5px" }}>Balance: {Number(dstTokenBalance).toFixed(2)}</h3>
          </div>
        </FormControl>
        <Grid container direction="row">
          <Grid item xs={12} sm={7}>
            <FormControl className="ohm-input" variant="outlined" color="primary">
              <OutlinedInput
                type="number"
                placeholder="0"
                value={dstSwapBalance ? dstSwapBalance : ""}
                onChange={e => setDstSwapCallback(e.target.value)}
                labelWidth={0}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1}>
            <FormControl className="ohm-input" variant="outlined">
              <Typography variant="h3" align="center">
                SPOT
              </Typography>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={1}></Grid>
          <Grid item xs={12} sm={2}>
            <FormControl className="ohm-input" variant="outlined">
              <InputLabel id="demo-simple-select-label">NETWORK</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={value}
                label="NETWORK"
                onChange={changeNet}
              >
                <MenuItem value={1}>Ethereum</MenuItem>
                <MenuItem value={97}>BSC</MenuItem>
                <MenuItem value={80001}>Polygon</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Grid container alignItems="flex-end" style={{ marginTop: "30px" }}></Grid>
        <Grid container alignItems="flex-end" style={{ marginTop: "40px", padding: "30px" }}>
          <FormControl variant="outlined" color="primary" fullWidth>
            <div className="row" style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ marginBottom: "5px" }}> </h3>
            </div>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container alignItems="flex-end" style={{ marginBottom: "30px", display: "flex" }}>
        <Grid item xs={12} sm={12} md={1} lg={1} />
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <FormControl variant="outlined" color="primary" style={{ display: "flex" }}>
            {modalButton[0]}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={2} lg={2} style={{ marginBottom: "20px" }} />
        <Grid item xs={12} sm={12} md={4} lg={4}>
          <FormControl variant="outlined" color="primary" style={{ display: "flex" }}>
            {modalButton[1]}
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={1} lg={1} />
      </Grid>
    </Box>
  );
}
