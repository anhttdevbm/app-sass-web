import Box from "@mui/material/Box";
import Avatar from "components/Avatar";
import { Checkbox, IconButton, ImageList, Typography } from "@mui/material";
import { IChatItemInfo } from "store/chat/type";
import { ChangeEvent, useMemo } from "react";
import CircleUnchecked from "icons/CircleUnchecked";
import CircleCheckedFilled from "icons/CircleCheckedFilled";
import { Button } from "components/shared";
import { Employee } from "store/company/reducer";
import ArrowDownIcon from "icons/ArrowDownIcon";
import { useChat } from "store/chat/selectors";

interface SelectItemProp {
  text?: string;
  icon?: React.ReactNode;
  iconClick?: React.ReactNode;
  onClick?: () => void;
}
const ItemDetail = ({ text, icon, iconClick, onClick }: SelectItemProp) => {
  const { prevStep, currStep, onSetStep } = useChat();

  return (
    <Box
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {icon}
        <Typography variant="caption" color="#999999">
          {text}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <IconButton
          sx={{
            cursor: "pointer",
            padding: 0.5,
          }}
        >
          {iconClick}
        </IconButton>
      </Box>
    </Box>
  );
};
export default ItemDetail;
