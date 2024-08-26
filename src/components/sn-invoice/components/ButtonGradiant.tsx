import { Button, ButtonProps } from "@mui/material";

export interface ButtonGradiantProps extends ButtonProps {
  children: React.ReactNode;
}

export const ButtonGradiant = ({
  children,
  ...buttonProps
}: ButtonGradiantProps) => {
  return (
    <Button
      {...buttonProps}
      sx={{
        backgroundImage: "linear-gradient(to right, #2AF598, #009EFD)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "100px",
        border: "none",
        cursor: "pointer",
        boxShadow: "none",
        transition: "all 0.3s",
        textTransform: "capitalize",
        fontWeight: 700,
        "&:hover": {
          opacity: 0.9,
          transition: "all 0.3s",
        },
        ...buttonProps.sx,
      }}
    >
      {children}
    </Button>
  );
};
