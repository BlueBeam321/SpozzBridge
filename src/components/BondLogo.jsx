import { Box, SvgIcon } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";

function BondLogo({ bond }) {
  let viewBox = "0 0 32 32";
  let style = { height: "32px", width: "32px" };
  const networkId = useSelector(state => state.network.networkId);
  // Need more space if its an LP token
  if (bond.isLP) {
    viewBox = "0 0 64 32";
    style = { height: "32px", width: "62px" };
  }
  // console.log(bond);
  // const logoImage = bond.getBondImage(networkId);
  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
      <SvgIcon component={bond.logoImg} viewBox={viewBox} style={style} />
    </Box>
  );
}

export function DashBoardLogo({ bond }) {
  let viewBox = "0 0 32 32";
  let style = { height: "32px", width: "32px" };

  // Need more space if its an LP token
  if (true) {
    viewBox = "0 0 64 32";
    style = { height: "32px", width: "62px" };
  }
  const networkId = useSelector(state => state.network.networkId);
  return (
    <Box display="flex" alignItems="center" justifyContent="center" width={"64px"}>
      <SvgIcon component={bond.getBondIconSvgWithNetID(networkId)} viewBox={viewBox} style={style} />
    </Box>
  );
}

export default BondLogo;
