import { memo, useState } from "react";
import { Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import CircleTickIcon from "icons/CircleTickIcon";
import useToggle from "hooks/useToggle";

type PackageItemProps = {};

const PackageItem = (props: PackageItemProps) => {
  const [isHovered, onHovered, onHoveredFalse] = useToggle(false);

  return (
    <Stack sx={sxConfig.root} width={220} alignItems="center" spacing={2}>
      <Text variant="h4">Starter 1 month</Text>
      <Stack direction="row" alignItems="center" spacing={0.5}>
        <Text variant="h3">$</Text>
        <Text variant="h1">9.99</Text>
      </Stack>

      <Button
        variant={isHovered ? "primary" : "secondary"}
        fullWidth
        size="small"
        onMouseMove={onHovered}
        onMouseLeave={onHoveredFalse}
      >
        Get start
      </Button>
      <Stack flex={1} spacing={1.25}>
        <Stack direction="row" spacing={1}>
          <CircleTickIcon fontSize="medium" color="success" />
          <Text variant="body2">
            Nemo enim ipsam volup tatem quia volu ptas sit aspernatur
          </Text>
        </Stack>
        <Stack direction="row" spacing={1}>
          <CircleTickIcon fontSize="medium" color="success" />
          <Text variant="body2">
            Nemo enim ipsam volup tatem quia volu ptas sit aspernatur
          </Text>
        </Stack>
        <Stack direction="row" spacing={1}>
          <CircleTickIcon fontSize="medium" color="success" />
          <Text variant="body2">
            Nemo enim ipsam volup tatem quia volu ptas sit aspernatur
          </Text>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(PackageItem);

const sxConfig = {
  root: {
    border: "1px solid",
    borderColor: "grey.200",
    borderRadius: 4,
    py: 2,
    px: 1.25,
    height: "auto",
    minHeight: 400,
    "&:hover": {
      backgroundColor: "grey.50",
      boxShadow: "0px 10px 15px rgba(33, 33, 33, 0.1)",
      // px: 3.125,
      // py: 4.5,
    },
  },
};
