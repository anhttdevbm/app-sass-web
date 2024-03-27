import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import React from "react";

interface Props {
  content: string;
}

const DescriptionRow = ({ content }: Props) => {
  const saleT = useTranslations(NS_SALES);

  return (
    <Stack
      direction="column"
      sx={{
        width: "100%",
      }}
    >
      <Text variant="caption" color="grey.300">
        {saleT("detail.service.table.description")}
      </Text>
      <Text
        variant="body2"
        sx={{
          wordBreak: "break-word",
        }}
      >
        {content}
      </Text>
    </Stack>
  );
};

export default DescriptionRow;
