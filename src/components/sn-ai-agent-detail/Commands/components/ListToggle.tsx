import { ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { Switch, Text } from "components/shared";
import React from "react";

interface ListToggleProps {
  title: string;
  list: {
    icon: React.ReactNode;
    name: string;
    onClick?: () => void;
    checked?: boolean;
  }[];
}

export const ListSwitch = ({ title, list }: ListToggleProps) => {
  return (
    <Stack
      direction={"column"}
      spacing={2}
      bgcolor={"background.default"}
      padding={"8px 20px"}
    >
      <Typography fontSize={"12px"} fontWeight={400} color={"grey.300"}>
        {title}
      </Typography>
      {list.map((item, index) => (
        <Stack
          key={index}
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <Stack direction={"row"} spacing={1} alignItems={"center"}>
            {item.icon}
            <Text variant={"body2"}>{item.name}</Text>
          </Stack>
          <Switch
            onChange={item.onClick}
            checked={item.checked}
            color={"primary"}
            size={"small"}
          />
        </Stack>
      ))}
    </Stack>
  );
};
