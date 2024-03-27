"use client";
import { Avatar, Box } from "@mui/material";
import React from "react";
interface Props {
  name: string;
  currentMess: string;
  avatar?: string;
  timeSendMess: string;
  isOnline?: boolean;
  isHasNewMessage: boolean;
  isChoose?: boolean;
}
const BoxChatUser: React.FC<Props> = ({
  avatar,
  name,
  isHasNewMessage = false,
  currentMess,
  timeSendMess,
  isChoose = false,
  isOnline = false,
}) => {
  return (
    <Box
      sx={{
        padding: "8px 24px",
        backgroundColor: isChoose ? "#E1F0FF" : "white",
        position: "relative",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Avatar alt="Remy Sharp" src={avatar} sx={{ marginRight: "8px" }}>
            N
          </Avatar>

          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <p
              style={{
                fontSize: "14px",
                color: "#212121",
                fontWeight: 600,
                margin: "0 0 8px 0",
              }}
            >
              {name ?? "-"}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: isHasNewMessage ? "#212121" : "#999",
                fontWeight: isHasNewMessage ? 600 : 400,
                margin: "0",
              }}
            >
              {currentMess ?? "-"}
            </p>
          </Box>

          {isOnline && (
            <Box
              sx={{
                width: "14px",
                height: "14px",
                backgroundColor: "#55C000",
                borderRadius: "50%",
                position: "absolute",
                top: "0",
                left: "28px",
              }}
            ></Box>
          )}
        </Box>

        <p
          style={{
            marginBottom: "8px",
            fontSize: "12px",
            color: "#999",
            fontWeight: 400,
          }}
        >
          {timeSendMess}m
        </p>
      </Box>

      {isHasNewMessage && (
        <Box
          sx={{
            width: "8px",
            height: "8px",
            backgroundColor: "#3699FF",
            borderRadius: "50%",
            position: "absolute",
            top: "50%",
            left: "2px",
            transform: "translate(3px, -50%)",
          }}
        ></Box>
      )}
    </Box>
  );
};

export default BoxChatUser;
