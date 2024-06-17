import React, { useEffect, useRef, useState } from "react";
import VideoParticipant from "./VideoParticipant";
import { Box, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { io } from "socket.io-client";

const socket = io("your_socket_server_url");

import websocket from "websocket";
import MyVideoScreen from "./MyVideoScreen";
import { Height } from "@mui/icons-material";
const WebSocketClient = websocket.client;
// const client = new WebSocketClient();

// Configure socket.io-client options
// const socket = io("your_socket_server_url", {
//   transports: ["websocket"],
//   autoConnect: true,
//   // other options...
// });

// socket.on("connect", () => {
//   console.log("Connected to socket server");
// });

// socket.on("disconnect", () => {
//   console.log("Disconnected from socket server");
// });

// socket.emit("customEvent", { data: "Hello, server!" });

// socket.on("customEventResponse", (response) => {
//   console.log("Received response from server:", response);
// });

// useEffect(() => {
//   return () => {
//     socket.disconnect();
//   };
// }, []);

interface VideoScreenProps {
  users: Array<UserI>;
  sx: object;
}

const layoutArr = ["galaxy", "speaker", "content"];

const VideoScreen: React.FC<VideoScreenProps> = (props: VideoScreenProps) => {
  const { users, sx } = props;
  const [layout, setLayout] = useState<"galaxy" | "speaker" | "content">(
    "speaker",
  );

  const [count, setCount] = useState<number>(1);
  const [isShow, setShow] = useState(false);

  const changeLayout = () => {
    if (count === 2) {
      setCount(0);
      setLayout(layoutArr[0] as "galaxy" | "speaker" | "content");
    } else {
      setLayout(layoutArr[count + 1] as "galaxy" | "speaker" | "content");
      setCount((pre) => pre + 1);
    }
  };

  const handleMouseEnter = () => {
    setShow(true);
  };
  const handleMouseLeave = () => {
    setShow(false);
  };

  return (
    <Box className="" sx={{ ...sx }}>
      {/* <button
        onClick={changeLayout}
      >{`Change Layout: ${layoutArr[count]}`}</button> */}

      {layout === "galaxy" && (
        <Grid2
          className="galaxy"
          container
          spacing={1}
          justifyContent={"space-around"}
          height={"63vh"}
          overflow={"hidden"}
        >
          <Grid2 key={"11"} xs={6} maxHeight={"25%"}>
            <MyVideoScreen sx={{}} />
          </Grid2>
          {users.map((user) => (
            <Grid2 key={user.id} xs={6}>
              <VideoParticipant
              // sx={{ width: "100%", height: "100%" }}
              />
            </Grid2>
          ))}
        </Grid2>
      )}
      {layout === "speaker" && (
        <Stack
          component={"div"}
          spacing={1}
          sx={{ justifyContent: "space-between", height: "100%" }}
        >
          <Box
            style={{
              borderRadius: 8,
              flexGrow: 1,
              background: "red",
            }}
            // onMouseEnter={handleMouseEnter}
            // onMouseLeave={handleMouseLeave}
          >
            {/* {isShow && <MyVideoScreen sx={{}} />} */}
            <MyVideoScreen sx={{}} />
          </Box>

          <Stack
            direction={"row"}
            maxHeight={"30%"}
            minHeight={"20%"}
            gap={0.5}
          >
            {users.map((user) => (
              <VideoParticipant key={user.id} user={user} />
            ))}
          </Stack>
        </Stack>
      )}
      {layout === "content" && (
        <div className="video-content">
          <Box position={"relative"} width={"100%"} height={"70vh"}>
            <Box
              maxHeight={"95%"}
              sx={{
                width: "100%",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <MyVideoScreen sx={{}} />
            </Box>

            <VideoParticipant
            // sx={{
            //   position: "absolute",
            //   width: "25%",
            //   height: "25%",
            //   top: 0,
            //   right: 0,
            //   bgcolor: "red",
            //   zIndex: 1,
            // }}
            />
          </Box>
        </div>
      )}
    </Box>
  );
};

export default VideoScreen;
