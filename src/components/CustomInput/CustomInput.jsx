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
  Select,
  InputAdornment,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./CustomInput.scss";

export default function CustomInput({ value, onChange, select, onSelectChange, itemList }) {
  return (
    <div id="custom-input">
      <OutlinedInput placeholder="0" value={value} onChange={onChange} labelWidth={0} style={{ width: "60%" }} />
      <Select
        labelId="demo-simple-select-label"
        value={select}
        labelWidth={0}
        onChange={e => onSelectChange(e.target.value)}
        style={{ border: "2px !important", width: "40%" }}
      >
        {itemList.map((item, index) => {
          return (
            <MenuItem value={index}>
              <div className="menu-item">
                <img src={item.image} width="35px" height="35px" className="logo" />
                <span>{item.title}</span>
              </div>
            </MenuItem>
          );
        })}
      </Select>
    </div>
  );
}
