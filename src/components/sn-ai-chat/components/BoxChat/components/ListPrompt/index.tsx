import { Button, Grid, Box } from "@mui/material";
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
  return (
    <Grid container spacing={2} marginTop={4}>
      {prompts &&
        prompts.length > 0 &&
        prompts.map((item, i) => (
          <Grid item xs={6} key={i}>
            <Box width={1} height={1}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => handleClick(`${item.prompt}`)}
                sx={{
                  backgroundColor: "white",
                  color: "grey.300",
                  padding: "16px 21px",
                  height: "100%",
                }}
              >
                {item.prompt}
              </Button>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};
