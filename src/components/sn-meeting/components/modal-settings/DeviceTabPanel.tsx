import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Theme,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import FontSelect from "./FontSelect";
import BottomSelect from "./FontSelect";
import AudioSelect from "./AudioSelect";
import NoiseSuppressSelect from "./NoiseSuppressSelect";
import VideoSelect from "./VideoSelect";
import KeyboardShorcut from "./KeyboardShorcut";

interface TabPanelProps {
  index: number;
  value: number;
}

const colorsData = [
  {
    colorHexCode: "#242424",
  },
  {
    colorHexCode: "#237B4B",
  },
  {
    colorHexCode: "#0000FF",
  },
  {
    colorHexCode: "#835C00",
  },
];

enum LANGUAGES {
  ENGLISH = "English",
  VIETNAMESE = "Vietnamese",
}

export default function DeviceTabPanel(props: TabPanelProps) {
  const { value, index, ...other } = props;
  const [language, setLanguages] = useState<LANGUAGES>(LANGUAGES.ENGLISH);
  const [selectedColors, setSelectedColors] = useState<string>(
    colorsData[0].colorHexCode,
  );

  return (
    value === index && (
      <Stack
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        sx={{
          p: "24px",
          flex: 1,
          gap: "20px",
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        {...other}
      >
        <AudioSelect />

        <NoiseSuppressSelect />

        <VideoSelect />

        <KeyboardShorcut />
      </Stack>
    )
  );
}
