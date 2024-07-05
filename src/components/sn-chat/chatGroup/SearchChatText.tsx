/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  IconButton,
  InputAdornment,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useCallback, useEffect, useState } from "react";
import { useChat } from "store/chat/selectors";
import ArrowDownIcon from "icons/ArrowDownIcon";
import SearchIcon from "icons/SearchIcon";
import { useTranslations } from "next-intl";
import { NS_CHAT_BOX, NS_COMMON } from "constant/index";
import { useEmployeesOfCompany } from "store/manager/selectors";
import { useAuth, useSnackbar } from "store/app/selectors";
import { STEP } from "store/chat/type";
import ItemSearchChatText from "./ItemSearchChatText";
import { DataStatus } from "constant/enums";

const SearchChatText = () => {
  const [textSearch, setTextSearch] = useState("");

  const {
    onSetStep,
    onSearchChatText,
    listSearchMessage,
    statusListSearchMessage,
  } = useChat();

  const commonT = useTranslations(NS_COMMON);
  const commonChatBox = useTranslations(NS_CHAT_BOX);
  const { onAddSnackbar } = useSnackbar();

  useEffect(() => {
    getSearchChatText();
  }, [textSearch]);

  const getSearchChatText = useCallback(async () => {
    await onSearchChatText({
      text: textSearch,
      type: "p",
    });
  }, [textSearch, onSearchChatText]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      setTextSearch(event.target.value);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          padding: 2,
          backgroundColor: "#3699FF",
        }}
      >
        <IconButton
          sx={{
            cursor: "pointer",
            color: "#FFFFFF",
          }}
          onClick={() => {
            onSetStep(STEP.CHAT_DETAIL_GROUP);
          }}
        >
          <ArrowDownIcon />
        </IconButton>
        <TextField
          size="small"
          sx={{
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiInputBase-root": {
              color: "black",
              borderRadius: "8px",
              border: "1px solid transparent",
            },
          }}
          placeholder={commonChatBox("chatBox.searchConversation")}
          fullWidth
          onKeyDown={handleKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: "#999999",
                  }}
                />
              </InputAdornment>
            ),
          }}
        />
        <Typography
          sx={{
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
          onClick={() => {
            onSetStep(STEP.CHAT_DETAIL_GROUP);
          }}
        >
          {commonT("cancel")}
        </Typography>
      </Box>
      <Box
        overflow="auto"
        maxHeight="calc(550px - 85px - 15px)"
        minHeight="calc(550px - 85px - 15px)"
      >
        {statusListSearchMessage === DataStatus.LOADING ||
        statusListSearchMessage === DataStatus.FAILED ? (
          Array.from({ length: 5 }, (_, i) => (
            <Box
              key={i}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
              p={2}
            >
              <Skeleton variant="rounded" width={40} height={40} />
              <Box flex={1}>
                <Skeleton variant="text" sx={{ fontSize: "1rem" }} />
                <Skeleton
                  variant="text"
                  sx={{ fontSize: "1rem" }}
                  width="40%"
                />
              </Box>
            </Box>
          ))
        ) : (
          <>
            {listSearchMessage?.length > 0 ? (
              listSearchMessage.map((item, index) => {
                return <ItemSearchChatText employee={item} key={index} />;
              })
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                {commonT("noData")}
              </Box>
            )}
          </>
        )}
      </Box>
    </Box>
  );
};

export default SearchChatText;
