import { ExpandMore } from "@mui/icons-material";
import {
  SxProps,
  TextField,
  InputAdornment,
  Typography,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { Option } from "constant/types";

const AssignerDropdown = (props: {
  value: Option | "";
  options: Option[];
  onChange: (value: string | "") => void;
  sx?: SxProps;
}) => {
  const commonT = useTranslations(NS_COMMON);

  return (
    <TextField
      select
      size="small"
      SelectProps={{
        displayEmpty: true,
        startAdornment: (
          <InputAdornment position="start">
            <Typography sx={{ color: "grey.600", fontWeight: 600 }}>
              {commonT("assigner")}:
            </Typography>
          </InputAdornment>
        ),
        IconComponent: (_props) => <ExpandMore {..._props} />,
      }}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value)}
      sx={{
        "& .MuiOutlinedInput-root": {
          "& .MuiOutlinedInput-notchedOutline": {
            borderRadius: "2rem",
          },
        },
        ...props.sx,
      }}
    >
      <MenuItem value="">{commonT("all")}</MenuItem>
      {props.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              alt={option.label}
              src={option.avatar}
              sx={{ width: 24, height: 24 }}
            />
            <Typography>{option.label}</Typography>
          </Box>
        </MenuItem>
      ))}
    </TextField>
  );
};

export default AssignerDropdown;
