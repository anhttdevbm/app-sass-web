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
        background: "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)",
        color: "white",
        padding: "10px 20px",
        borderRadius: "100px",
        border: "none",
        cursor: "pointer",
        boxShadow: "none",
        transition: "all 0.3s",
        textTransform: "capitalize",
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
