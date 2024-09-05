import { Box, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import React, { useState } from "react";

import MyVideoScreen from "./MyVideoScreen";
import ParticipantList from "./ParticipantList";

interface VideoScreenProps {
  sx: object;
}

const layoutArr = ["galaxy", "speaker", "content"];

const VideoScreen: React.FC<VideoScreenProps> = (props: VideoScreenProps) => {
  const { sx } = props;
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
    <Box className="" sx={{ ...sx, maxHeight: "100%", height: "200px" }}>
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
          <ParticipantList />
        </Grid2>
      )}
      {layout === "speaker" && (
        <Stack
          component={"div"}
          spacing={1}
          sx={{ justifyContent: "space-between", height: "100%" }}
        >
          <MyVideoScreen sx={{}} />
          <ParticipantList />
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
              {/* <MyVideoScreen sx={{}} /> */}
            </Box>
            <ParticipantList />
          </Box>
        </div>
      )}
    </Box>
  );
};

export default VideoScreen;
