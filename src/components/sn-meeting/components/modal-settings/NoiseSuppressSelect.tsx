import { InfoOutlined } from "@mui/icons-material";
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { useState } from "react";
import SettingSelect from "./SettingSelect";

enum NOISE_SUPRESS {
  LOW = "Low",
  MEDIUM = "Medium",
  HIGH = "High",
}

export default function NoiseSuppressSelect() {
  const [selectedNoiseSuppress, setSelectedNoiseSuppress] =
    useState<NOISE_SUPRESS>(NOISE_SUPRESS.LOW);
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          mb: "12px",
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          Noise suppression
          <InfoOutlined
            sx={{
              width: "16px",
              height: "16px",
              fill: "#666",
            }}
          />
        </Typography>
        <Typography
          sx={{
            fontSize: "12px",
            color: "#666",
          }}
        >
          Choose Low if you want others to hear music.
        </Typography>
      </Box>
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <SettingSelect
          data={Object.values(NOISE_SUPRESS)}
          label="Noise suppress"
          selectedValue={selectedNoiseSuppress}
          setSelectedValue={setSelectedNoiseSuppress}
        />
      </Box>
    </Box>
  );
}
