import { ExpandMore } from "@mui/icons-material";
import {
  SxProps,
  TextField,
  InputAdornment,
  Typography,
  MenuItem,
} from "@mui/material";
import TextStatus from "components/TextStatus";
import { NS_COMMON, STATUS_OPTIONS, COLOR_STATUS } from "constant/index";
import { useTranslations } from "next-intl";
import { ProjectStatus } from "store/project/actions";

const StatusDropdown = (props: {
  value: ProjectStatus | "";
  onChange: (value: ProjectStatus | "") => void;
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
              {commonT("status")}:
            </Typography>
          </InputAdornment>
        ),
        IconComponent: (_props) => <ExpandMore {..._props} />,
      }}
      value={props.value}
      onChange={(e) => props.onChange(e.target.value as ProjectStatus | "")}
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
      {STATUS_OPTIONS.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <TextStatus
            text={commonT(option.label)}
            color={COLOR_STATUS[option.value]}
          >
            {commonT(option.label)}
          </TextStatus>
        </MenuItem>
      ))}
    </TextField>
  );
};

export default StatusDropdown;
