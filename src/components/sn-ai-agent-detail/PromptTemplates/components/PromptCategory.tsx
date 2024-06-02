import React from "react";
import { SidebarPromptCategory } from "./Sidebar";
import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { PRIMARY_GRADIENT_COLOR } from "components/sn-ai-agent/components";

interface PromptCategoryProps {
  category: SidebarPromptCategory;
  onClick: () => void;
  isSelected: boolean;
}

export const PromptCategory = ({
  category,
  onClick,
  isSelected,
}: PromptCategoryProps) => {
  return (
    <Stack
      padding={"8px 12px"}
      onClick={onClick}
      direction={"row"}
      spacing={1}
      width={"100%"}
      borderRadius={"4px"}
      sx={{
        cursor: "pointer",
        background: isSelected ? PRIMARY_GRADIENT_COLOR : "transparent",
      }}
    >
      <Text
        fontSize={"14px"}
        fontWeight={400}
        color={isSelected ? "white" : "grey.400"}
        style={{
          textOverflow: "ellipsis",
          overflow: "hidden",
          whiteSpace: "nowrap",
          maxWidth: "100%",
        }}
      >
        {category.name}
      </Text>
      <Stack
        borderRadius={"8px"}
        padding={"2px 8px"}
        bgcolor={isSelected ? "background.default" : "transparent"}
        border={"1px solid"}
        borderColor={isSelected ? "white" : "grey.100"}
      >
        <Text fontSize={"12px"} fontWeight={700} color={"#404040"}>
          {category.quantity}
        </Text>
      </Stack>
    </Stack>
  );
};
