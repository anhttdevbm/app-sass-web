import {
  FormControl,
  InputLabel,
  OutlinedInput,
  SelectChangeEvent,
  Select as SelectMui,
  SelectProps, MenuItem, ListItemIcon,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { styled } from "@mui/system";
import { DropDownOutlineIcon } from "icons/DropDownOutlineIcon";
import React, { useEffect, useState } from "react";
import { Option } from "constant/types";
import { useTranslations } from "next-intl";
import { NS_AI_AGENT, UPLOAD_API_URL } from "constant/index";
import { client, Endpoint } from "../../../../api";
import Image from "next/image";

type SelectCustomProps = {
  theme: Theme;
  label: string;
  value: string;
  onChange:  (event: SelectChangeEvent<string>) => void;
  options: Array<Option>;
};

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
  fontWeight: 400,
  color: theme.palette.grey[300],
  left: "20px",
  top: "8px",
  fontSize: "0.75rem",
  transform: "none",
  "&.Mui-focused": {
    fontSize: "0.75rem",
    color: theme.palette.grey[300],
    fontWeight: 400,
  },
}));

export const Select = styled(
  ({ theme, label, value, onChange, options, ...props }: SelectCustomProps) => {
    const [imageUrls, setImageUrls] = useState<{ [key: string]: string }>({});

    const t = useTranslations(NS_AI_AGENT);

    useEffect(() => {
      const fetchImageUrls = async () => {
        const urls = await Promise.all(
          options.map(async (option) => {
            const response = await client.post(
              Endpoint.DOWNLOAD_LINK,
              [option.icon],
              {
                baseURL: UPLOAD_API_URL,
              },
            );
            const data = await response.data;

            return { [option.value]: data[0].link };
          }),
        );
        setImageUrls(Object.assign({}, ...urls));
      };
      fetchImageUrls();
    }, [options]);

   return ( <FormControl variant="outlined">
      <StyledInputLabel>{label}</StyledInputLabel>
      <SelectMui
        {...props}
        label={label}
        value={value}
        onChange={onChange}
        IconComponent={DropDownOutlineIcon}
        input={
          <OutlinedInput
            label={label}
            notched
            classes={{
              notchedOutline: "notchedOutline",
              focused: "focused",
            }}
          />
        }
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 200,
            },
          },
        }}
      >
        <MenuItem disabled value={"default"}>
          <em>{t("general.default")}</em>
        </MenuItem>
        {options.map((option, index) => (
          <MenuItem key={index} value={option.value}>
            {option.icon && imageUrls[option.value] && (
              <ListItemIcon style={{ minWidth: "20px" }}>
                <Image
                  src={imageUrls[option.value]}
                  alt={option.label}
                  width={12}
                  height={12}
                />
              </ListItemIcon>
            )}
            {option.label}
          </MenuItem>
        ))}
      </SelectMui>
    </FormControl>
  )},
)(({ theme }) => ({
  "&& .MuiSelect-select.MuiInputBase-input.MuiOutlinedInput-input": {
    backgroundColor: theme.palette.background.default,
    padding: "24px 20px 12px 20px",
  },
  "&& .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
  "&& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
    border: "none",
  },
}));
