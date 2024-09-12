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
import SettingSelect from "./SettingSelect";

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

export default function CaptionTabPanel(props: TabPanelProps) {
  const { value, index, ...other } = props;
  const [selectedLanguage, setSelectedLanguage] = useState<LANGUAGES>(
    LANGUAGES.ENGLISH,
  );
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
          maxHeight: "80vh",
          overflowY: "auto",
        }}
        {...other}
      >
        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              mb: "12px",
            }}
          >
            Language
          </Typography>
          <div>
            <SettingSelect
              label="Spoken language"
              selectedValue={selectedLanguage}
              setSelectedValue={setSelectedLanguage}
              data={Object.values(LANGUAGES)}
            />
          </div>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#666666",
              my: "12px",
            }}
          >
            Transcript and captions will be generated in this language for the
            meeting.
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontWeight: 700,
              mb: "12px",
            }}
          >
            Style
          </Typography>
          <Box
            sx={{
              height: "70px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#F7F7FD",
            }}
          >
            <Typography
              sx={{
                fontSize: "20px",
                color: "#000",
                fontWeight: "700",
              }}
            >
              This is caption
            </Typography>
          </Box>
          <Typography
            sx={{
              fontSize: "12px",
              color: "#242424",
              mt: "8px",
              textAlign: "center",
            }}
          >
            This is what your captions will look like.
          </Typography>
        </Box>

        <Box>
          <Typography
            sx={{
              fontSize: "20px",
              color: "#000",
              fontWeight: "700",
            }}
          >
            Font colors
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: "8px",
              mt: "16px",
            }}
          >
            {colorsData.map((color) => (
              <Button
                key={color.colorHexCode}
                sx={{
                  width: "32px",
                  minWidth: "unset",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  border: "1px solid",
                  borderColor:
                    selectedColors === color.colorHexCode
                      ? "#3699FF"
                      : "transparent",
                }}
                onClick={() => setSelectedColors(color.colorHexCode)}
              >
                <Typography
                  sx={{
                    color: color.colorHexCode,
                    fontSize: "14px",
                    fontWeight: 700,
                    textTransform: "capitalize",
                  }}
                >
                  Aa
                </Typography>
              </Button>
            ))}
          </Box>

          <Box
            sx={{
              mt: "12px",
            }}
          >
            <BottomSelect />
          </Box>
        </Box>
      </Stack>
    )
  );
}
