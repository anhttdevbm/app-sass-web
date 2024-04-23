import { Button, Grid, Box } from "@mui/material";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import React from "react";
import { ExamplePrompt } from "store/aiChat/type";

interface ListPromptProps {
  prompts: ExamplePrompt[];
  handleClick: (value: string) => void;
}

export const ListPrompt: React.FC<ListPromptProps> = ({
  prompts,
  handleClick,
}) => {
  const { isMdSmaller, isLgSmaller } = useBreakpoint();

  const { isDarkMode } = useTheme();

  let displayedPrompts = prompts;
  if (isMdSmaller) {
    displayedPrompts = prompts.slice(0, 2);
  } else if (isLgSmaller) {
    displayedPrompts = prompts.slice(0, 4);
  }

  const renderPrompt = (item: ExamplePrompt, i: number) => (
    <Grid item xs={isMdSmaller ? 12 : 6} key={i}>
      <Box width={1} height={1}>
        <Button
          variant="outlined"
          fullWidth
          onClick={() => handleClick(`${item.prompt}`)}
          sx={{
            backgroundColor: isDarkMode ? "info.dark" : "white",
            color: "grey.300",
            padding: isMdSmaller ? "8px 10px" : "16px 21px",
            height: "100%",
            borderColor: isDarkMode ? "info.dark" : "primary.main",
          }}
        >
          {item.prompt}
        </Button>
      </Box>
    </Grid>
  );

  return (
    <Grid container spacing={2} marginTop={4}>
      {displayedPrompts &&
        displayedPrompts.length > 0 &&
        displayedPrompts.map(renderPrompt)}
    </Grid>
  );
};
