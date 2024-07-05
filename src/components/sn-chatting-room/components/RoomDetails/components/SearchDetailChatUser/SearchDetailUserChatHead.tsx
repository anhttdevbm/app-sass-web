import {
  Box,
  ButtonBase,
  IconButton,
  InputBase,
  Typography,
} from "@mui/material";
import SearchIcon from "icons/SearchIcon";
import React from "react";

interface SearchDetailChatUserHeadProps {
  onClose?: () => void;
  onSearch?: () => void;
}

const SearchDetailChatUserHead: React.FC<SearchDetailChatUserHeadProps> = ({
  onClose,
  onSearch,
}) => {
  return (
    <Box
      sx={{
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "8px 16px",
        gap: "24px",
        width: "100%",
        background: "#FFF",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          flexDirection: "column",
          width: "292px",
          height: "40px",
          padding: "10px 20px",
          background: "var(--Gray0, #F7F7FD)",
          borderRadius: "8px",
          flexShrink: 0,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IconButton sx={{ p: "10px" }} aria-label="search" onClick={onSearch}>
            <SearchIcon stroke="#999999" />
          </IconButton>

          <InputBase
            size="small"
            placeholder="Search in coversation"
            sx={{
              color: " var(--Gray3, #999)",
              backgroundColor: "#F7F7FD",
              fontSize: 14,
              "& .MuiInputBase-input": {
                padding: "0px !important",
              },
            }}
          />
        </Box>
      </Box>
      <ButtonBase onClick={onClose}>
        <Typography
          variant="body2"
          sx={{
            color: "var(--brand-primary, #3699FF)",
          }}
        >
          Hủy
        </Typography>
      </ButtonBase>
    </Box>
  );
};

export default SearchDetailChatUserHead;
