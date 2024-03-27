/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from "lodash";
import { MenuItem, Select, SelectProps, Typography, Box } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface IOption {
  label: string;
  value: any;
  subLabel?: string;
}

interface IProps extends SelectProps {
  value: string;
  label: string;
  options: IOption[];
}

const typographyStyles = {
  fontSize: "14px",
  fontWeight: 600,
  lineHeight: "18px",
  color: "#666666",
};

const FilterSelect: React.FC<IProps> = ({
  label,
  value,
  sx,
  options = [],
  ...props
}) => {
  const isDarkMode = false;

  const renderValue = (selected: any) => {
    const selectedOption = options.find((option) => option.value === selected);
    if (selectedOption) {
      return selectedOption.label;
    }
    return <Typography sx={typographyStyles}>{label}</Typography>;
  };

  return (
    <Select
      value={value}
      sx={{
        "& ul": {
          background: "red!important", // Thay đổi màu nền theo ý muốn
        },
        height: "32px",
        " .MuiSelect-select": {
          ...typographyStyles,
          color: isDarkMode ? "#ECECEC" : "#666666",
          caretColor: !!isDarkMode ? "#fff" : "inherit",
        },
        " .MuiOutlinedInput-notchedOutline": {
          border: "none",
        },
        overflow: "hidden",
        textOverflow: "ellipsis",

        ...sx,
      }}
      IconComponent={(props) => (
        <ExpandMoreIcon
          {...props}
          sx={{
            fontSize: "18px",
            color: "#666666 !important",
          }}
        />
      )}
      displayEmpty
      renderValue={renderValue}
      {...props}
    >
      {options.length > 0 &&
        options.map((item: IOption) => (
          <MenuItem
            key={`item-${item.value}`}
            value={item.value}
            sx={{
              ...typographyStyles,
              fontWeight: 400,
              color: isDarkMode ? "#ECECEC" : "#666666",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="body1">{item.label}</Typography>
              <Typography variant="body2">{item?.subLabel}</Typography>
            </Box>
          </MenuItem>
        ))}
      {options.length === 0 && (
        <MenuItem
          value=""
          sx={{
            ...typographyStyles,
            color: isDarkMode ? "#ECECEC" : "#666666",
          }}
          disabled
        >
          Không có dữ liệu
        </MenuItem>
      )}
    </Select>
  );
};

export default FilterSelect;
