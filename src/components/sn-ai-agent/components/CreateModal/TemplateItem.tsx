import { ListItem, ListItemButton, ListItemIcon } from "@mui/material";
import { PromptTemplate } from "store/promptTemplate/types";
import { OUTLINE_COLOR } from "components/sn-ai-agent/components";
import useTheme from "hooks/useTheme";

interface TemplateItemProps {
  selected: PromptTemplate;
  setSelected: (value: PromptTemplate) => void;
  template: PromptTemplate;
}

export const TemplateItem = (props: TemplateItemProps) => {
  const { selected, setSelected, template } = props;

  const theme = useTheme()

  const itemBtnSx = {
    borderRadius: "20px",
    border: `2px solid ${theme.palette.grey[100]}`,
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.background.paper,
    fontSize: "14px",
    fontWeight: 400,
    "&:hover": {
      outline: `none`,
      border: `2px solid ${OUTLINE_COLOR}`,
      backgroundColor: theme.palette.primary.light,
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.light,
      border: `2px solid ${OUTLINE_COLOR}`,
      color: theme.palette.primary.main,
    },
    '& .MuiTouchRipple-root': {
      display: 'none',
    },
  };

  const handleOnClick = (template: PromptTemplate) => {
    setSelected(template)
  }

  return (
    <ListItem
      key={template.id}
      disablePadding
      sx={{
        width: "auto",
      }}
    >
      <ListItemButton
        onClick={() => handleOnClick(template)}
        selected={selected?.id === template.id}
        sx={itemBtnSx}
      >
        {template.icon &&
          <ListItemIcon sx={{ minWidth: "8px"}}>
            {template.icon}
          </ListItemIcon>}
        {template.name}
      </ListItemButton>
    </ListItem>
  )
}