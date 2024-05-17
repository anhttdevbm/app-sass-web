import { Stack } from "@mui/material";
import { ContentItem, ContentItemProps } from "./ContentItem";
import { useState } from "react";

interface ContentProps {
  listContent: ContentItemProps[];
}

export const Content = ({ listContent }: ContentProps) => {
  const [selectedContent, setSelectedContent] = useState<string | null>(null);

  const handleSelectContent = (title: string) => {
    setSelectedContent(title);
  };

  return (
    <Stack direction={"column"} spacing={1} width={"100%"}>
      {listContent.map((content, index) => (
        <ContentItem
          key={content.id}
          id={content.id}
          title={content.title}
          description={content.description}
          isSelected={selectedContent === content.id}
          onClick={() => handleSelectContent(content.id)}
        />
      ))}
    </Stack>
  );
};
