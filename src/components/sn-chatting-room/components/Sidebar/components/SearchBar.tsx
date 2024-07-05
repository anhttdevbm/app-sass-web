import { Box, InputBase, Paper } from "@mui/material";
import { IconButton } from "components/shared";
import useGetScreenMode from "hooks/useGetScreenMode";
import useTheme from "hooks/useTheme";
import NewGroupIcon from "icons/NewGroupIcon";
import SearchIcon from "icons/SearchIcon";
import { useChat } from "store/chat/selectors";
import { useRef } from "react";
import { useChatHelpers } from "store/chat/helpers";

const SearchBar = ({ onFilterConversation }) => {
  const { mobileMode } = useGetScreenMode();
  const { onSetDrawerType } = useChat();
  const { isDarkMode } = useTheme();
  const { searchConversation } = useChatHelpers();

  const inputRef = useRef<any>(null);

  return (
    <>
      <Box
        sx={{
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          padding: "0px 10px",

          ...(isDarkMode
            ? {}
            : {
                backgroundColor: !mobileMode
                  ? "var(--brand-primary, #3699FF)"
                  : "white",
              }),
        }}
      >
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            height: "40px",
            borderRadius: "8px",
            boxShadow: "none",
            ...(!mobileMode
              ? { width: "273px" }
              : { width: "80%", border: "1px solid" }),
            background: isDarkMode ? "#3a3b3c" : "white",
          }}
        >
          <IconButton
            sx={{ p: "10px", color: isDarkMode ? "white" : "#999999" }}
            aria-label="search"
          >
            <SearchIcon onClick={() => inputRef.current.focus()} />
          </IconButton>

          <InputBase
            inputRef={inputRef}
            size="small"
            placeholder="Search name"
            sx={{
              background: isDarkMode ? "#3a3b3c" : "white",
              color: isDarkMode ? "white" : "#999999",
              fontSize: 14,
              "& .MuiInputBase-input": {
                padding: "0px !important",
              },
            }}
            onChange={(e) => searchConversation(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
        </Paper>

        <IconButton
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isDarkMode ? "#3a3b3c" : "white",
            marginLeft: "10px",
            borderRadius: 2,
          }}
          onClick={() => onSetDrawerType("group-modal")}
        >
          <NewGroupIcon />
        </IconButton>
      </Box>
    </>
  );
};

export default SearchBar;
