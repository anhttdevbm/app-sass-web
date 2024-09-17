import React, { useEffect, useState } from "react";
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import SettingSelect from "./SettingSelect";
import { useAppSelector } from "store/hooks";

interface MediaDeviceInfoExtended {
  label: string;
  value: string;
  key: string;
}

export default function VideoSelect() {
  const { localStream } = useAppSelector((state) => state.meeting);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfoExtended[]>(
    [],
  );
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>("");

  const onSelectDevice = async (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: newDeviceId } },
      });
      if (localStream) {
        const [newVideoTrack] = newStream.getVideoTracks();

        const [oldVideoTrack] = localStream.getVideoTracks();
        if (oldVideoTrack) {
          localStream.removeTrack(oldVideoTrack);
          oldVideoTrack.stop();
        }

        localStream.addTrack(newVideoTrack);
      }
    } catch (e) {
      console.error("Error switching camera:", e);
    }
  };

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput",
        );

        setVideoDevices(
          videoDevices.map((device) => ({
            key: device.deviceId,
            label: device.label,
            value: device.deviceId,
          })),
        );
        if (videoDevices.length > 0) {
          setSelectedDeviceId(videoDevices[0].deviceId);
        }

        // Set current devices which in use for init state
        if (localStream) {
          const [currentVideoTrack] = localStream.getVideoTracks();
          if (currentVideoTrack) {
            const currentDeviceId = currentVideoTrack.getSettings().deviceId;
            if (currentDeviceId) {
              setSelectedDeviceId(currentDeviceId);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching video devices:", error);
      }
    };

    getVideoDevices();
  }, [localStream]);

  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          mb: "12px",
        }}
      >
        Video settings
      </Typography>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* <FormControl
          fullWidth
          sx={{
            background: "#F7F7FD",
            "& fieldset": {
              border: "none",
            },
          }}
        >
          <Select
            id="audio-input-select"
            value={selectedDeviceId}
            onChange={(e) => setSelectedDeviceId(e.target.value as string)}
            autoWidth
            label="Age"
            renderValue={(value) => (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  pl: "20px",
                }}
              >
                <Typography
                  sx={{
                    fontSize: "12px",
                    color: "#999",
                  }}
                >
                  Camera
                </Typography>
                <Typography>
                  {
                    videoDevices.find((device) => device.deviceId === value)
                      ?.label
                  }
                </Typography>
              </Box>
            )}
            sx={{
              fontSize: "14px",
              color: "#212121",
              py: 0,
              height: "54px",
            }}
          >
            {videoDevices.map((device) => (
              <MenuItem key={device.deviceId} value={device.deviceId}>
                {device.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <SettingSelect
          data={videoDevices}
          label="Camera"
          selectedValue={selectedDeviceId}
          setSelectedValue={onSelectDevice}
        />
      </Box>
    </Box>
  );
}
