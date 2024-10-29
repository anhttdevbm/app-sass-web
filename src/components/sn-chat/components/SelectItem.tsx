import { Checkbox, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "components/Avatar";
import useTheme from "hooks/useTheme";
import CircleCheckedFilled from "icons/CircleCheckedFilled";
import CircleUnchecked from "icons/CircleUnchecked";
import { ChangeEvent } from "react";
import { Employee } from "store/company/reducer";

interface SelectItemProp {
  employee: Employee;
  onClick?: (event: ChangeEvent<HTMLInputElement>) => void;
  checkbox?: boolean;
  onClickItem?: () => void;
  checked?: boolean;
}

const SelectItem = ({
  checked,
  employee,
  onClick,
  checkbox,
  onClickItem,
}: SelectItemProp) => {
  const { fullname, avatar } = employee;
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const { isDarkMode } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        paddingLeft: "20px",
        marginBottom: 1,
        // cursor: "pointer",
        ":hover": {
          backgroundColor: isDarkMode ? "#3a3b3c" : "#F7F7FD",
        },
      }}
      p={1}
      onClick={onClickItem}
    >
      {checkbox && (
        <Checkbox
          sx={{
            paddingLeft: "0px",
          }}
          checked={checked}
          onChange={onClick}
          {...label}
          icon={<CircleUnchecked />}
          checkedIcon={<CircleCheckedFilled />}
        />
      )}
      <Avatar
        src={avatar}
        alt="Avatar"
        size={42}
        style={{
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="inherit" fontWeight="bold">
          {fullname}
        </Typography>
      </Box>
    </Box>
  );
};
export default SelectItem;
