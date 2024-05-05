import { Button, Grid, Box } from "@mui/material";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import { useLocale } from "next-intl";
import React from "react";
import { ExamplePrompt } from "store/aiChat/type";

interface ListPromptProps {
  prompts?: ExamplePrompt[];
  handleClick: (value: string) => void;
  isMobile?: boolean;
}

export const ListPrompt: React.FC<ListPromptProps> = ({
  prompts = [],
  handleClick,
  isMobile = false,
}) => {
  const { isMdSmaller, isLgSmaller } = useBreakpoint();
  const { isDarkMode } = useTheme();
  const locale = useLocale();

  const getDisplayedPrompts = () => {
    if (isMobile) {
      return prompts.slice(0, 2);
    } else if (isMdSmaller) {
      return prompts.slice(0, 2);
    } else if (isLgSmaller) {
      return prompts.slice(0, 4);
    } else {
      return prompts;
    }
  };

  const displayedPrompts = getDisplayedPrompts();

  const renderPrompt = (item: ExamplePrompt, i: number) => {
    const padding = isMobile
      ? "12px 16px"
      : isMdSmaller
      ? "8px 10px"
      : "16px 21px";

    const backgroundColor = isDarkMode ? "info.dark" : "white";
    const borderColor = isDarkMode ? "info.dark" : "primary.main";

    return (
      <Grid item xs={isMobile ? 12 : 6} key={i}>
        <Box width={1} height={1}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => handleClick(`${item.prompt[locale]}`)}
            sx={{
              backgroundColor,
              color: "grey.300",
              padding,
              height: "100%",
              borderColor,
              fontSize: "14px",
            }}
          >
            {item.prompt[locale]}
          </Button>
        </Box>
      </Grid>
    );
  };

  return (
    <Grid container spacing={2} rowSpacing={1} marginTop={4}>
      {displayedPrompts.map(renderPrompt)}
    </Grid>
  );
};
