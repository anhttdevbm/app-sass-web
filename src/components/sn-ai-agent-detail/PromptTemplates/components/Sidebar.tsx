import { Stack } from "@mui/material";
import { PromptTemplateItem } from "./PromptTemplateItem";
import { useState } from "react";

export interface PromptTemplate {
  id: string;
  name: string;
  quantity: number;
}

interface SidebarProps {
  listTemplates: PromptTemplate[];
}

export const Sidebar = ({ listTemplates }: SidebarProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplate(id);
  };

  return (
    <Stack direction={"column"} padding={2} width={"240px"}>
      {listTemplates.map((template) => (
        <PromptTemplateItem
          key={template.id}
          template={template}
          onClick={() => handleSelectTemplate(template.id)}
          isSelected={selectedTemplate === template.id}
        />
      ))}
    </Stack>
  );
};
