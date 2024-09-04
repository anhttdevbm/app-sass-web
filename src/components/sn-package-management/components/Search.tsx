import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchPackageManagement(props) {
  const { placeholder, ...rest } = props;
  return (
    <Paper
      //component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        width: rest.width ?? 332,
        height: 48,
        backgroundColor: "grey.50",
        boxShadow: "none",
        borderRadius: "100px",
        padding: "11px 31px",
        marginBottom: "25px",
        marginTop: "6px",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder={placeholder}
        inputProps={{ "aria-label": "search google maps" }}
        {...rest}
      />
      <IconButton aria-label="menu">
        <SearchIcon color="primary" />
      </IconButton>
    </Paper>
  );
}
