import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function CustomizedInputBase(props) {
  const { placeholder, ...rest } = props;
  return (
    <Paper
      //component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        width: 295,
        height: 38,
        backgroundColor: "grey.50",
        boxShadow: "none",
      }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <SearchIcon />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ "aria-label": "search google maps" }}
        {...rest}
      />
    </Paper>
  );
}
