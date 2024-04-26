import React, { useState } from "react";
import VideoParticipant from "./VideoParticipant";
import { Box, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import ListSubheader from "@mui/material/ListSubheader";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import { relative } from "path";


interface VideoScreenProps {
  users: Array<UserI>;
  sx: object;
}

const layoutArr = ["galaxy", "speaker", "content"];

const VideoScreen: React.FC<VideoScreenProps> = (props: VideoScreenProps) => {
  const {users, sx} = props;

  const [layout, setLayout] = useState<"galaxy" | "speaker" | "content">(
    "speaker",
  );

  const [count, setCount] = useState<number>(1);

  const changeLayout = () => {
    if (count === 2) {
      setCount(0);
      setLayout(layoutArr[0] as "galaxy" | "speaker" | "content");
    } else {
      setLayout(layoutArr[count + 1] as "galaxy" | "speaker" | "content");
      setCount((pre) => pre + 1);
    }
  };

  return (
    <Box className="video-screen" sx={{ ...sx }}>
      <button
        onClick={changeLayout}
      >{`Change Layout: ${layoutArr[count]}`}</button>
      {layout === "galaxy" && (
        <Grid2
          className="galaxy"
          container
          spacing={1}
          justifyContent={"space-around"}
        >
          {users.map((user) => (
            <Grid2 key={user.id}>
              <VideoParticipant sx={{ width: "100%" }} />
            </Grid2>
          ))}
        </Grid2>
      )}
      {layout === "speaker" && (
        <Grid2 container gap={1}>
          <Grid2 component="div" xs={12} sx={{ height: "450px" }}>
            <VideoParticipant sx={{ width: "100%", height: "100%" }} />
          </Grid2>
          <Grid2 xs={12}>
            <Stack
              spacing={1}
              direction={"row"}
              width={"100%"}
              overflow={"scroll"}
            >
              {users.map((user) => (
                <VideoParticipant sx={{ width: "100%" }} key={user.id} />
              ))}
            </Stack>
          </Grid2>
        </Grid2>
      )}

      {layout === "content" && (
        <div className="video-content">
          <Box position={"relative"} width={'100%'} height={'550px'}>
            <VideoParticipant sx={{ width: "100%", height: '100%'}} />

            <VideoParticipant
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                bgcolor: 'blueviolet',
                zIndex: 1,
              }}
            />
          </Box>
        </div>
      )}
    </Box>
  );
};

export default VideoScreen;

export function TitlebarImageList() {
  return (
    <ImageList sx={{ width: "100%", height: "600px" }}>
      {/* <ImageListItem key="Subheader" cols={2}>
        <ListSubheader component="div">December</ListSubheader>
      </ImageListItem> */}
      {itemData.map((item) => (
        <ImageListItem key={item.img}>
          <img
            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.img}?w=248&fit=crop&auto=format`}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.title}
            subtitle={item.author}
            actionIcon={
              <IconButton
                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                aria-label={`info about ${item.title}`}
              >
                <InfoIcon />
              </IconButton>
            }
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
    author: "@bkristastucchio",
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
    author: "@rollelflex_graphy726",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
    author: "@helloimnik",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
    author: "@nolanissac",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
    author: "@hjrc33",
    cols: 2,
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
    author: "@arwinneil",
    rows: 2,
    cols: 2,
    featured: true,
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
    author: "@tjdragotta",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
    author: "@katie_wasserman",
  },
];
