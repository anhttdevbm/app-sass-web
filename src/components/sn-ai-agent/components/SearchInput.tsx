"use client";

import { InputAdornment, OutlinedInput } from "@mui/material";
import SearchIcon from "icons/SearchIcon";
import { ChangeEventHandler } from "react";

interface SearchInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any;
  placeholder?: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement>,
  value: string
}

export const SearchInput: React.FC<SearchInputProps> = ({
  theme,
  placeholder,
  onChange,
  value
}) => {
  return (
    <OutlinedInput
      startAdornment={
        <InputAdornment position="start">
          <SearchIcon fontSize="medium" color="info" />
        </InputAdornment>
      }
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      sx={{ ...outlinedInput, background: `${theme.palette.grey[50]}` }}
    />
  );
};

const outlinedInput = {
  border: "none",
  outline: "none",
  borderRadius: "4px",
  padding: "4px",
  fontSize: "14px",
  height: "100%",
  "&:hover": {
    transition: "none",
  },
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "& .MuiOutlinedInput-input": {
    padding: "4px",
    lineHeight: "normal",
  },
};
