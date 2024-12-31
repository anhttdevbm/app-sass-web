import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  SelectProps,
  Typography,
} from "@mui/material";
import { Control, Controller } from "react-hook-form";

type TSelectProps = {
  control: Control;
  label?: string;
  name: string;
  listOptions: { value: string | number; label: string }[];
  handleChange?: (value: SelectChangeEvent<string | number>) => void;
} & SelectProps;

const SelectController: React.FC<TSelectProps> = ({
  control,
  label,
  name,
  listOptions = [],
  handleChange,
  placeholder,
  required,
  sx,
  ...props
}) => {
  return (
    <FormControl fullWidth>
      {label && (
        <Typography color={"#4D4D4D"} fontSize={13} pb={0.5} fontWeight={700}>
          {label}
          {required && (
            <span style={{ color: "#FF2C56", paddingLeft: 4 }}>*</span>
          )}
        </Typography>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <div>
            <Select
              {...field}
              onChange={(value) => {
                field.onChange(value);
                handleChange && handleChange(value as SelectChangeEvent<string | number>);
              }}
              fullWidth
              sx={{
                ".MuiSelect-select ": {
                  padding: "6px 16px 6px 16px",
                  height: 24,
                  fontSize: 14,
                },
                padding: 0,
                color: "#241F5C",
                borderRadius: "8px",
                ".MuiSelect-icon": {
                  top: "8px",
                },
                "& .MuiSelect-select .notranslate::after": placeholder
                  ? {
                    fontWeight: 400,
                    content: `"${placeholder}"`,
                    color: "#B8B8BE",
                  }
                  : {},
                ...sx,
              }}
              error={!!fieldState.error}
              {...props}
              displayEmpty={true}
            >
              {listOptions.length === 0 && (
                <MenuItem disabled value="Empty">
                  <em>Empty option</em>
                </MenuItem>
              )}
              {listOptions.map((item) => (
                <MenuItem key={item.value} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
            {fieldState.error && (
              <FormHelperText error>{fieldState.error.message}</FormHelperText>
            )}
          </div>
        )}
      />
    </FormControl>
  );
};

export default SelectController;
