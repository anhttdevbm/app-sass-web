import { AddCircle } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Button as SharedButton, Text } from "components/shared";
import { MouseEventHandler } from "react";

const Button = ({
  ...props
}: React.ComponentProps<typeof SharedButton> & {
  id?: string;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onClickDropdown?: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        background:
          "linear-gradient(90deg, rgba(41,242,155,1) 0%, rgba(1,160,250,1) 100%)",
        borderRadius: "2rem",
      }}
    >
      <SharedButton
        id={props.id}
        onClick={props.onClick}
        startIcon={<AddCircle />}
        variant="primary"
        sx={{
          borderRadius: "2rem 0 0 2rem",
          bgcolor: "transparent",
        }}
        {...props}
      >
        <Text sx={{ color: "white" }}>{props.text}</Text>
      </SharedButton>
    </Box>
  );
};

export default Button;
