import { Select } from "components/shared";
import { Option } from "constant/types";
import useTheme from "hooks/useTheme";
import React, { ChangeEvent } from "react";

interface SelectAIChatProps {
  placeholder?: string;
  options: Array<Option>;
  selectedValue?: string;
  onOptionChange: (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
}

export const SelectAIChat: React.FC<SelectAIChatProps> = ({
  placeholder,
  options,
  onOptionChange,
  selectedValue,
}) => {
  const { isDarkMode } = useTheme();

  return (
    <Select
      placeholder={placeholder}
      showPlaceholder
      options={options}
      value={selectedValue}
      onChange={onOptionChange}
      sx={{
        backgroundColor: isDarkMode ? "info.dark" : "#F7F7FD",
        border: isDarkMode ? "1px solid #3D3D3D" : "0px",
        borderRadius: "4px",
        ".MuiInputBase-root": {
          padding: "8px 8px 8px 16px",
        },
        ".MuiTypography-root.MuiTypography-body2.text-option.css-16vocvy-MuiTypography-root":
          {
            color: selectedValue ? "text.primary" : "grey.300",
          },
      }}
      fullWidth
    />
  );
};
