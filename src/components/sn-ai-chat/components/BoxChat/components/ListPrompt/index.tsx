import { Button, Grid } from '@mui/material';
import React from 'react';

interface ListPromptProps {
  texts: string[];
  handleClick: (value: string) => void;
}

export const ListPrompt: React.FC<ListPromptProps> = ({ texts, handleClick }) => {
  return (
    <Grid container spacing={2} marginTop={4}>
      {texts.map((text, i) => (
        <Grid item xs={6} key={i}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={() => handleClick(`Button: ${text}, Row: ${i+1}`)}
            sx={{
              backgroundColor: 'white',
              color: 'grey.300',
              padding: '16px 21px'
            }}
          >
            {text}
          </Button>
        </Grid>
      ))}
    </Grid>
  )
}
