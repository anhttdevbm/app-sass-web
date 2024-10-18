/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import SettingSelect from "./SettingSelect";
import { useAppSelector } from "store/hooks";

interface MediaDeviceInfo {
  label: string;
  value: string;
  key: string;
}
export default function AudioSelect() {
  const { localStream } = useAppSelector((state) => state.meeting);
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  const [microphoneDevices, setMicrophoneDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [selectedAudioInputDeviceId, setSelectedAudioInputDeviceId] =
    useState<string>("");
  const [selectedAudioOutputDeviceId, setSelectedAudioOutputDeviceId] =
    useState<string>("");
  const [selectedMicrophoneDeviceId, setSelectedMicrophoneDeviceId] =
    useState<string>("");

  const handleAudioInputChange = async (deviceId: string) => {
    setSelectedAudioInputDeviceId(deviceId);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
      });
      if (localStream) {
        const [newAudioTrack] = stream.getAudioTracks();
        const [oldAudioTrack] = localStream.getAudioTracks();
        if (oldAudioTrack) {
          localStream.removeTrack(oldAudioTrack);
          oldAudioTrack.stop();
        }
        localStream.addTrack(newAudioTrack);
      }
    } catch (error) {
      console.error("Error switching audio input:", error);
    }
  };

  const handleAudioOutputChange = (deviceId: string) => {
    setSelectedAudioOutputDeviceId(deviceId);
  };

  const handleMicrophoneChange = async (deviceId: string) => {
    setSelectedMicrophoneDeviceId(deviceId);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: { exact: deviceId } },
      });
      if (localStream) {
        const [newAudioTrack] = stream.getAudioTracks();
        const [oldAudioTrack] = localStream.getAudioTracks();
        if (oldAudioTrack) {
          localStream.removeTrack(oldAudioTrack);
          oldAudioTrack.stop();
        }
        localStream.addTrack(newAudioTrack);
      }
    } catch (error) {
      console.error("Error switching microphone:", error);
    }
  };

  useEffect(() => {
    const getAudioDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter(
          (device) => device.kind === "audioinput",
        );
        const audioOutputs = devices.filter(
          (device) => device.kind === "audiooutput",
        );
        const microphones = devices.filter(
          (device) => device.kind === "audioinput",
        );
        setAudioInputDevices(
          audioInputs.map((device) => ({
            key: device.deviceId,
            label: device.label,
            value: device.deviceId,
          })),
        );
        setAudioOutputDevices(
          audioOutputs.map((device) => ({
            key: device.deviceId,
            label: device.label,
            value: device.deviceId,
          })),
        );
        setMicrophoneDevices(
          microphones.map((device) => ({
            key: device.deviceId,
            label: device.label,
            value: device.deviceId,
          })),
        );
        if (audioInputs.length > 0) {
          setSelectedAudioInputDeviceId(audioInputs[0].deviceId);
        }
        if (audioOutputs.length > 0) {
          setSelectedAudioOutputDeviceId(audioOutputs[0].deviceId);
        }
        if (microphones.length > 0) {
          setSelectedMicrophoneDeviceId(microphones[0].deviceId);
        }

        // Set current devices which in use for init state
        if (localStream) {
          const [currentAudioTrack] = localStream.getAudioTracks();
          if (currentAudioTrack) {
            const currentDeviceId = currentAudioTrack.getSettings().deviceId;
            if (currentDeviceId) {
              setSelectedAudioInputDeviceId(currentDeviceId);
              setSelectedMicrophoneDeviceId(currentDeviceId);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching audio devices:", error);
      }
    };

    getAudioDevices();
  }, [localStream]);
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          mb: "12px",
        }}
      >
        Audio settings
      </Typography>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        {/* Audio devices */}
        <SettingSelect
          data={audioInputDevices}
          label="Audio devices"
          selectedValue={selectedAudioInputDeviceId}
          setSelectedValue={handleAudioInputChange}
        />

        {/* Speaker */}
        <SettingSelect
          data={audioOutputDevices}
          label="Speaker"
          selectedValue={selectedAudioOutputDeviceId}
          setSelectedValue={handleAudioOutputChange}
        />
        {/* Microphone */}
        <SettingSelect
          data={microphoneDevices}
          label="Microphone"
          selectedValue={selectedMicrophoneDeviceId}
          setSelectedValue={handleMicrophoneChange}
        />
      </Box>
    </Box>
  );
}
