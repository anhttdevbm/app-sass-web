import Box from "@mui/material/Box";
import Avatar from "components/Avatar";
import { Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { SearchChatText } from "store/company/reducer";
import useTheme from "hooks/useTheme";
import { renderTimeDiff } from "utils/index";

interface ItemSearchChatTextProp {
  employee: SearchChatText;
  onClick?: (event: ChangeEvent<HTMLInputElement>) => void;
  onClickItem?: () => void;
}
const ItemSearchChatText = ({
  employee,
  onClick,
  onClickItem,
}: ItemSearchChatTextProp) => {
  const { fullname, matchedText, avatar, ts } = employee;
  const { isDarkMode } = useTheme();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
        marginBottom: 1,
        // cursor: "pointer",
        ":hover": {
          backgroundColor: isDarkMode ? "#3a3b3c" : "#F7F7FD",
        },
      }}
      p={1}
      onClick={onClickItem}
    >
      <Avatar
        src={avatar}
        alt="Avatar"
        size={42}
        style={{
          borderRadius: "10px",
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
        <Typography variant="caption" color="#999999">
          <div
            dangerouslySetInnerHTML={{
              __html: matchedText,
            }}
          />
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="#999999"
        ml="auto"
        whiteSpace="nowrap"
      >
        {renderTimeDiff(ts)}
      </Typography>
    </Box>
  );
};
export default ItemSearchChatText;
