import { Button as MuiButtons, SvgIconProps, Typography } from "@mui/material";

type ButtonType = "primary" | "gradient";

interface CreateButtonProps {
  type: ButtonType;
  text: string;
  icon?: React.ElementType<SvgIconProps>;
}

export const Button = ({ type, text, icon: Icon }: CreateButtonProps) => {
  const btnSx = type === "primary" ? primaryBtnSx : gradientBtnSx;
  return (
    <MuiButtons
      variant={type === "primary" ? "outlined" : "contained"}
      sx={btnSx}
    >
      {Icon && <Icon fontSize="small" sx={{ marginRight: "6px" }} />}
      <Typography marginLeft={1}>{text}</Typography>
    </MuiButtons>
  );
};

const primaryBtnSx = {
  background: "#FFFFFF",
  color: "#0575E6",
  textTransform: "capitalize",
  boxShadow: "none",
  padding: "12px 24px",
  border: "1px solid #0575E6",
};

const gradientBtnSx = {
  background: "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)",
  color: "#FFFFFF",
  textTransform: "capitalize",
  boxShadow: "none",
  padding: "12px 24px",
};
