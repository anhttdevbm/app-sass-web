import { Stack } from "@mui/material";
import { Template } from "./Template";
import { PromptTemplate } from "store/promptTemplate/types";

interface ContentProps {
  listTemplates: PromptTemplate[];
}

export const ListTemplates = ({ listTemplates }: ContentProps) => {
  return (
    <Stack direction={"column"} spacing={1} width={"100%"}>
      {listTemplates.map((template) => (
        <Template
          key={template.id}
          id={template.id}
          title={template.name}
          description={template.description}
        />
      ))}
    </Stack>
  );
};
