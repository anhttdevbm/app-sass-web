import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select as SelectMui,
  SelectProps,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Theme } from "@mui/material/styles";
import { styled } from "@mui/system";
import { DropDownOutlineIcon } from "icons/DropDownOutlineIcon";

type SelectCustomProps = SelectProps & {
  theme: Theme;
  label: string;
  value: string;
  onChange: (event: SelectChangeEvent) => void;
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
  ({ theme, label, value, onChange, ...props }: SelectCustomProps) => (
    <FormControl variant="outlined">
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
      >
        {props.children}
      </SelectMui>
    </FormControl>
  ),
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
