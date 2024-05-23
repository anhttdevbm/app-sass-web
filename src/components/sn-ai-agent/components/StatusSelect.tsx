import {
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { NS_AI_AGENT } from "constant/index";
import { DropDownOutlineIcon } from "icons/DropDownOutlineIcon";
import { useLocale, useTranslations } from "next-intl";
import { CSSProperties } from "react";
import { StatusAIAgent } from "store/aiAgent/types";

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
  theme,
}) => {
  const t = useTranslations(NS_AI_AGENT);
  const locale = useLocale();

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
    minWidth: locale === "en" ? "100px" : "170px",
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
          {t("layout.header.status")}
        </InputLabel>
      )}
      <Select
        labelId="status-label"
        value={status}
        onChange={handleStatusChange}
        label={t("layout.header.status")}
        input={
          <OutlinedInput
            label=""
            notched={false}
            name={t("layout.header.status")}
            id="outlined-status"
          />
        }
        sx={selectStyle}
        IconComponent={DropDownOutlineIcon}
      >
        <StyledMenuItem value="">
          <em>{t("layout.header.none")}</em>
        </StyledMenuItem>
        <StyledMenuItem value={StatusAIAgent.ACTIVE}>{t("layout.header.active")}</StyledMenuItem>
        <StyledMenuItem value={StatusAIAgent.INACTIVE}>{t("layout.header.inactive")}</StyledMenuItem>
      </Select>
    </FormControl>
  );
};
