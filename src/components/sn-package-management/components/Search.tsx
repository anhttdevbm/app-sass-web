import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchPackageManagement(props) {
  const { placeholder, onSearch, ...rest } = props;
  const [inputValue, setInputValue] = React.useState("");

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSearch = () => {
    if (onSearch) {
      onSearch(inputValue);
    }
  };

  return (
    <Paper
      //component="form"
      sx={{
        display: "flex",
        alignItems: "center",
        width: { sm: rest.width ?? 332, xs: "100%" },
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
        value={inputValue}
        onChange={handleChange}
        {...rest}
      />
      <IconButton aria-label="search" onClick={handleSearch}>
        <SearchIcon color="primary" />
      </IconButton>
    </Paper>
  );
}
