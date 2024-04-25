import {
  FormControl,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { Option } from "constant/types";
import useTheme from "hooks/useTheme";
import { useLocale } from "next-intl";
import React, { useEffect, useRef } from "react";

interface SelectAIChatProps {
  placeholder?: string;
  options: Array<Option>;
  selectedValue?: string;
  onOptionChange: (
    event: SelectChangeEvent<string>,
    child: React.ReactNode,
  ) => void;
  onLoadMore: () => void;
  isError?: boolean;
}

export const SelectAIChat: React.FC<SelectAIChatProps> = ({
  placeholder,
  options,
  onOptionChange,
  selectedValue,
  onLoadMore,
  isError,

}) => {
  const { isDarkMode } = useTheme();
  const lastOptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      }
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 1,
    });

    if (lastOptionRef.current) {
      observer.observe(lastOptionRef.current);
    }

    return () => {
      if (lastOptionRef.current) {
        observer.unobserve(lastOptionRef.current);
      }
    };
  }, [onLoadMore]);

  return (
    <FormControl
      fullWidth
      sx={{
        position: "relative",
      }}
    >
      {!selectedValue && (
        <InputLabel
          id="demo-simple-select-placeholder-label-label"
          sx={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            backgroundColor: "transparent",
            color: isDarkMode ? "info.dark" : "grey.300",
            fontSize: "14px",
            fontWeight: 400,
          }}
        >
          {placeholder}
        </InputLabel>
      )}
      <Select
        labelId="demo-simple-select-placeholder-label-label"
        value={selectedValue || ""}
        onChange={onOptionChange}
        sx={{
          backgroundColor: isDarkMode ? "info.dark" : "#F7F7FD",
          ".css-1idmfta-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
            {
              padding: "8px 8px 8px 16px",
            },
          ".MuiOutlinedInput-notchedOutline": {
            // border: isDarkMode ? "1px solid #3D3D3D" : "0px",
            border: isError
              ? "1px solid #FF0000"
              : isDarkMode
              ? "1px solid #3D3D3D"
              : "0px",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 360,
            },
          },
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
          transformOrigin: {
            vertical: "bottom",
            horizontal: "left",
          },
        }}
      >
        <MenuItem disabled value="">
          Default
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.icon && <ListItemIcon>{option.icon}</ListItemIcon>}
            <ListItemText
              primary={option.label}
              primaryTypographyProps={{
                noWrap: true,
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            />
          </MenuItem>
        ))}
        {/* <div ref={lastOptionRef}>.</div> */}
      </Select>
    </FormControl>
  );
};
