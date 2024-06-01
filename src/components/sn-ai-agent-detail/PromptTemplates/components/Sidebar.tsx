import { Stack } from "@mui/material";
import { useState } from "react";
import { PromptCategory } from "components/sn-ai-agent-detail/PromptTemplates/components/PromptCategory";

export interface SidebarPromptCategory {
  name: string;
  quantity: number;
}

interface SidebarProps {
  listCategories: SidebarPromptCategory[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export const Sidebar = ({
  listCategories,
  onSelectCategory,
  selectedCategory
}: SidebarProps) => {
  return (
    <Stack direction={"column"} padding={2} width={"240px"}>
      {listCategories.map((category) => (
        <PromptCategory
          key={category.name}
          category={category}
          onClick={() => onSelectCategory(category.name)}
          isSelected={selectedCategory === category.name}
        />
      ))}
    </Stack>
  );
};
