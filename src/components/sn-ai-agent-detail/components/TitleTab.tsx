"use client";

import { Stack } from "@mui/material";
import { Text } from "components/shared";

interface TitleTabProps {
  title: string;
  description: string;
}

export const TitleTab = ({ title, description }: TitleTabProps) => {
  return (
    <Stack direction={"column"} spacing={1}>
      <Text variant={"h5"}>{title}</Text>
      <Text fontSize={"14px"} fontWeight={400} color={"grey.300"}>
        {description}
      </Text>
    </Stack>
  );
};
