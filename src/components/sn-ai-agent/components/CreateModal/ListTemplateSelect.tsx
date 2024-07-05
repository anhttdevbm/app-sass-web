import { Box, List, Theme } from "@mui/material";
import { Text } from "components/shared";
import { OUTLINE_COLOR } from ".";
import { FC } from "react";
import { PromptTemplate } from "store/promptTemplate/types";
import { TemplateItem } from "components/sn-ai-agent/components/CreateModal/TemplateItem";

interface ListButtonSelectProps {
  selected: PromptTemplate;
  setSelected: (value: PromptTemplate) => void;
  theme: Theme;
  label?: string;
  templates: PromptTemplate[]
  blankTemplate?: PromptTemplate
}

export const ListTemplateSelect: FC<ListButtonSelectProps> = (props) => {
  const {
    selected,
    setSelected,
    theme,
    label,
    templates,
    blankTemplate
  } = props;

  return (
    <Box
      padding={"8px 20px"}
      mt={3}
      border={`1px solid ${OUTLINE_COLOR}`}
      sx={{
        background: theme.palette.grey[50],
      }}
      height={"200px"}
    >
      <Text
        fontSize={"12px"}
        fontWeight={400}
        color={theme.palette.grey[300]}
        mb={1}
      >
        {label}
      </Text>
      <List sx={listSx}>
        {blankTemplate && <TemplateItem selected={selected} setSelected={setSelected} template={blankTemplate} />}
        {templates.map((template, i) => (
          <TemplateItem
            key={template.id}
            selected={selected}
            setSelected={setSelected}
            template={template} />
        ))}
      </List>
    </Box>
  );
};

const listSx = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  padding: 0,
  gap: 2,
  overflow: "auto",
  maxHeight: "85%",
};
