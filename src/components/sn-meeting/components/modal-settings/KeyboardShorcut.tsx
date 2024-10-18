import { Box, Typography } from "@mui/material";
import PlusIcon from "icons/PlusIcon";
import React, { Fragment } from "react";

interface ShortcutItem {
  title: string;
  firstKey: string;
  secondKey: string;
}
const shortcuts: ShortcutItem[] = [
  {
    title: "Share screen",
    firstKey: "Alt",
    secondKey: "S",
  },
  {
    title: "Settings",
    firstKey: "Alt",
    secondKey: "P",
  },
  {
    title: "Toggle mute",
    firstKey: "Alt",
    secondKey: "M",
  },
  {
    title: "End call",
    firstKey: "Alt",
    secondKey: "E",
  },
  {
    title: "Toggle video",
    firstKey: "Alt",
    secondKey: "V",
  },
];

const ShortcutItem = ({ title, firstKey, secondKey }: ShortcutItem) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: "14px",
          color: "#242424",
        }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{
            border: "1px solid #3699FF",
            fontSize: "12px",
            color: "#3699FF",
            borderRadius: "4px",
            width: "24px",
            height: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 500,
          }}
        >
          {firstKey}
        </Typography>
        <PlusIcon
          sx={{
            stroke: "#3699FF",
            mx: "4px",
          }}
        />
        <Typography
          sx={{
            border: "1px solid #3699FF",
            fontSize: "12px",
            color: "#3699FF",
            borderRadius: "4px",
            width: "24px",
            height: "24px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 500,
          }}
        >
          {secondKey}
        </Typography>
      </Box>
    </Box>
  );
};

export default function KeyboardShorcut() {
  return (
    <Box>
      <Typography
        sx={{
          fontWeight: 700,
          mb: "12px",
        }}
      >
        Keyboard shortcuts
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "12px",
        }}
      >
        {shortcuts.map((shortcut, index) => (
          <Fragment key={index}>
            <ShortcutItem {...shortcut} />
            {index % 2 === 0 && <Box sx={{ gridColumn: "span 1" }} />}
          </Fragment>
        ))}
      </Box>
    </Box>
  );
}
