import { Box, InputAdornment, TextField, TextFieldProps } from "@mui/material";
import _ from "lodash";
import { useSelector } from "react-redux";

const SearchField: React.FC<TextFieldProps> = ({ sx, ...props }) => {
  const isDarkMode = false;
  return (
    <TextField
      sx={{
        width: "100%",
        maxWidth: "210px",
        backgroundColor: isDarkMode ? "#393939" : "#F7F7FD",
        height: "32px",
        border: "none",
        borderColor: "red",
        borderRadius: "4px",
        input: {
          padding: "0 14px 0 0",
          height: "inherit",
          fontSize: "14px",
          lineHeight: "22px",
          fontWeight: 400,
        },
        fieldset: {
          transition: "all ease 0.25s",
          borderColor: "#F7F7FD",
        },
        ":hover": {
          borderColor: "red",
          fieldset: {
            borderColor: "green",
          },
        },
        ...sx,
      }}
      placeholder="Tìm kiếm dự án"
      InputProps={{
        style: {
          color: isDarkMode ? "#ECECEC" : "inherit",
        },
        startAdornment: (
          <InputAdornment position="start">
            <Box
              //src={Assets.searchIcon}
              component="img"
              sx={{
                width: "18px",
                height: "18px",
                filter: !!isDarkMode ? "brightness(0) invert(1)" : "none",
              }}
            />
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
};

export default SearchField;
