import { Box, Stack } from "@mui/material";
import React from "react";
import ItemUser from "./ItemUser";
import { store } from "store/configureStore";
import { useAuth } from "store/app/selectors";
import { RemoteStream } from "store/meeting/types";

const ListUser = () => {
  const { remoteStreams, localStream, localStreamState } =
    store.getState().meeting;
  const { user } = useAuth();
  const localStreamData: RemoteStream = {
    participant: {
      avatar: user?.avatar || "",
      fullname: user?.fullname || "",
      id: user?.id || "",
      position: user?.position?.name || "",
      username: user?.fullname || "",
    },
    stream: localStream as MediaStream,
    streamState: localStreamState,
  };
  return (
    <Box p={2} overflow={"auto"} flexGrow={1}>
      <Stack direction={"column"} gap="16px">
        <ItemUser remoteStream={localStreamData} />
        {remoteStreams.map((remoteStream) => (
          <ItemUser remoteStream={remoteStream} key={remoteStream.stream.id} />
        ))}
      </Stack>
    </Box>
  );
};

export default ListUser;
