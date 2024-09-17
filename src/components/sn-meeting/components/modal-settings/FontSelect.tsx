import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useState } from "react";

enum HEIGHT {
  MEDIUM = "Medium",
  LARGE = "Large",
}

enum POSITION {
  BOTTOM = "At bottom",
  TOP = "At top",
}

enum FONT_SIZE {
  MEDIUM = "Medium",
  LARGE = "Large",
}

export default function BottomSelect() {
  const [height, setHeight] = useState<HEIGHT>(HEIGHT.MEDIUM);
  const [position, setPosition] = useState<POSITION>(POSITION.BOTTOM);
  const [fontSize, setFontSize] = useState<FONT_SIZE>(FONT_SIZE.MEDIUM);
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: "10px",
      }}
    >
      <FormControl
        sx={{
          width: "100%",
          background: "#F7F7FD",
          "& fieldset": {
            border: "none",
          },
        }}
      >
        <Select
          labelId="height-select-label"
          id="height-select"
          value={height}
          onChange={(e) => setHeight(e.target.value as HEIGHT)}
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
                Height
              </Typography>
              <Typography>{value}</Typography>
            </Box>
          )}
          sx={{
            fontSize: "14px",
            color: "#212121",
            py: 0,
            height: "54px",
          }}
        >
          {Object.values(HEIGHT).map((height) => (
            <MenuItem key={height} value={height}>
              {height}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          width: "100%",
          background: "#F7F7FD",
          "& fieldset": {
            border: "none",
          },
        }}
      >
        <Select
          labelId="height-select-label"
          id="height-select"
          value={position}
          onChange={(e) => setPosition(e.target.value as POSITION)}
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
                Position
              </Typography>
              <Typography>{value}</Typography>
            </Box>
          )}
          sx={{
            fontSize: "14px",
            color: "#212121",
            py: 0,
            height: "54px",
          }}
        >
          {Object.values(POSITION).map((position) => (
            <MenuItem key={position} value={position}>
              {position}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        sx={{
          width: "100%",
          background: "#F7F7FD",
          "& fieldset": {
            border: "none",
          },
        }}
      >
        <Select
          labelId="height-select-label"
          id="height-select"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value as FONT_SIZE)}
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
                Font size
              </Typography>
              <Typography>{value}</Typography>
            </Box>
          )}
          sx={{
            fontSize: "14px",
            color: "#212121",
            py: 0,
            height: "54px",
          }}
        >
          {Object.values(FONT_SIZE).map((fontSize) => (
            <MenuItem key={fontSize} value={fontSize}>
              {fontSize}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
