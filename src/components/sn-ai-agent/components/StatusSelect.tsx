import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  MenuItem,
} from "@mui/material";
import useTheme from "hooks/useTheme";
import { DropDownOutlineIcon } from "icons/DropDownOutlineIcon";
import { CSSProperties } from "react";

interface StatusSelectProps {
  status: string;
  setStatus: (status: string) => void;
  handleChangeStatus: (event: SelectChangeEvent) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any;
}

const StyledMenuItem = (props) => (
  <MenuItem {...props} sx={{ fontSize: "14px" }} />
);

export const StatusSelect: React.FC<StatusSelectProps> = ({
  status,
  setStatus,
  handleChangeStatus: handleStatusChange,
  theme
}) => {
  const inputLabelStyle: CSSProperties = {
    color: `${theme.palette.info.main}`,
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "14px",
    lineHeight: "18px",
    fontWeight: 600,
  };

  const selectStyle = {
    minWidth: "100px",
    border: "none",
    outline: "none",
    color: `${theme.palette.info.main}`,
    lineHeight: "18px",
    fontWeight: 600,
    fontSize: "14px",
    "&:hover": {
      transition: "none",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
      border: "none",
    },
    "& .MuiSelect-select": {
      textAlign: "left",
      color: `${theme.palette.info.main}`,
      paddingRight: "24px",
    },
    "& .MuiInputBase-input": {
      top: "0",
    },
    "& .MuiMenuItem-root.Mui-selected": {
      color: `${theme.palette.primary.main}`,
    },
    "& .MuiMenuItem-root": {
      fontSize: "14px",
    },
  };

  return (
    <FormControl variant="outlined" sx={{ position: "relative" }}>
      {status === "" && (
        <InputLabel htmlFor="status-label" style={inputLabelStyle}>
          Status
        </InputLabel>
      )}
      <Select
        labelId="status-label"
        value={status}
        onChange={handleStatusChange}
        label="Status"
        input={
          <OutlinedInput
            label=""
            notched={false}
            name="Status"
            id="outlined-status"
          />
        }
        sx={selectStyle}
        IconComponent={DropDownOutlineIcon}
      >
        <StyledMenuItem value="">
          <em>None</em>
        </StyledMenuItem>
        <StyledMenuItem value="active">Active</StyledMenuItem>
        <StyledMenuItem value="inactive">Inactive</StyledMenuItem>
      </Select>
    </FormControl>
  );
};
