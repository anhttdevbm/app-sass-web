import { Box, List, ListItem, ListItemButton, Theme } from "@mui/material";
import { Text } from "components/shared";
import { OUTLINE_COLOR } from ".";
import { FC } from "react";

interface ListButtonSelectProps {
  selected: number | null;
  setSelected: (value: number) => void;
  theme: Theme;
  label?: string;
}

export const ListButtonSelect: FC<ListButtonSelectProps> = ({
  selected,
  setSelected,
  theme,
  label,
}) => {
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
      <List
        sx={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 0,
          gap: 2,
          overflow: "auto",
          maxHeight: "85%",
        }}
      >
        {Array.from({ length: 20 }, (_, i) => (
          <ListItem
            key={i}
            disablePadding
            sx={{
              width: "auto",
            }}
          >
            <ListItemButton
              onClick={() => setSelected(i)}
              selected={selected === i}
              sx={{
                borderRadius: "20px",
                border: `2px solid ${theme.palette.grey[100]}`,
                color: theme.palette.text.primary,
                fontSize: "14px",
                fontWeight: 400,
                "&:hover": {
                  outline: `none`,
                  border: `2px solid ${OUTLINE_COLOR}`,
                },
                "&.Mui-selected": {
                  backgroundColor: theme.palette.primary.light,
                  border: `2px solid ${OUTLINE_COLOR}`,
                  color: theme.palette.primary.main,
                },
              }}
            >
              {`Agent name ${i + 1}`}
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};
