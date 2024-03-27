import { Avatar, Box, ButtonBase, Typography } from "@mui/material";
import MoreDotIcon from "icons/MoreDotIcon";
import { useState } from "react";
import SelectBox from "./SelectBox";

const MembersItemMobile = (currentConversation) => {
  const [showSelectBox, setShowSelectBox] = useState(false);
  const openSelectBox = () => {
    setShowSelectBox(!showSelectBox);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "stretch",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          width: "194px",
          gap: "8px",
          flexShrink: "0",
        }}
      >
        <Avatar
          src={currentConversation.avatar}
          sx={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            flexShrink: "0",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
            width: "143px",
            flexShrink: "0",
          }}
        >
          <Typography variant="h6">{currentConversation.name}</Typography>
          <Typography variant="body2" sx={{ color: "#666666" }}>
            {currentConversation.name}
          </Typography>
        </Box>
      </Box>
      {/* <ButtonBase
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "28px",
          padding: "10px",
          gap: "8px",
          borderRadius: "4px",
          backgroundColor: "#E1F0FF",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: "#3699FF",
          }}
        >
          Admin
        </Typography>
      </ButtonBase> */}
      <ButtonBase
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "28px",
          padding: "10px",
          gap: "8px",
          borderRadius: "4px",
        }}
        onClick={openSelectBox}
      >
        <MoreDotIcon
          sx={{
            width: "20px",
            height: "20px",
          }}
        />
      </ButtonBase>
      {showSelectBox && <SelectBox />}
    </Box>
  );
};

export default MembersItemMobile;
