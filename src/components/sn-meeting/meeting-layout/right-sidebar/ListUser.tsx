import { Box, Stack } from "@mui/material";
import React from "react";
import ItemUser from "./ItemUser";
import { store } from "store/configureStore";

const ListUser = () => {
  const { remoteStreams } = store.getState().meeting;
  return (
    <Box p={2} overflow={"auto"} flexGrow={1}>
      <Stack direction={"column"} gap="16px">
        {remoteStreams.map((remoteStream) => (
          <ItemUser remoteStream={remoteStream} key={remoteStream.stream.id} />
        ))}
      </Stack>
    </Box>
  );
};

export default ListUser;
