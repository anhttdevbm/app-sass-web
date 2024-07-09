import { AddCircle, ExpandMore } from "@mui/icons-material";
import { Box } from "@mui/material";
import { Button, Text } from "components/shared";
import { MouseEventHandler } from "react";

const ButtonWithDropdown = ({
  ...props
}: React.ComponentProps<typeof Button> & {
  id?: string;
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  onClickDropdown?: MouseEventHandler<HTMLButtonElement>;
}) => {
  const { onClick, ...dropdownProps } = props;

  return (
    <Box
      sx={{
        display: "flex",
        background:
          "linear-gradient(90deg, rgba(41,242,155,1) 0%, rgba(1,160,250,1) 100%)",
        borderRadius: "2rem",
      }}
    >
      <Button
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
      </Button>
      <Button
        variant="primary"
        sx={{
          paddingLeft: 0,
          paddingRight: 1,
          borderRadius: "0 2rem 2rem 0",
          borderLeft: "solid 1px white",
          bgcolor: "transparent",
        }}
        onClick={props.onClickDropdown}
        {...dropdownProps}
      >
        <ExpandMore />
      </Button>
    </Box>
  );
};

export default ButtonWithDropdown;
