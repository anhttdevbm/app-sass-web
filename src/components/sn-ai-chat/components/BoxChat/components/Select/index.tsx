import { Select } from "components/shared";
import { Option } from "constant/types";
import React, { ChangeEvent } from "react";

interface SelectProps {
  placeholder?: string;
  options: Array<Option>;
  value?: string;
  handleOnChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const SelectAIChat: React.FC<SelectProps> = ({ placeholder, options, handleOnChange, value }) => {
  return (
    <Select
      placeholder={placeholder}
      showPlaceholder
      options={options}
      value={value}
      onChange={handleOnChange}
      sx={{
        ...selectSx,
        '.MuiTypography-root.MuiTypography-body2.text-option.css-16vocvy-MuiTypography-root': {
          color: value ? 'text.primary' : 'grey.300'
        },
      }}
      fullWidth
    />
  );
};

const selectSx = {
  backgroundColor: "#F7F7FD",
  borderRadius: "4px",
  '.MuiInputBase-root': {
    padding: "8px 8px 8px 16px",
  }
};
