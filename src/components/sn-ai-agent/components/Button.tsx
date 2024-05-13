import { Button as MuiButtons, SvgIconProps, Typography } from "@mui/material";
import { PRIMARY_GRADIENT } from "./ActionCell";

type ButtonType = "outlined" | "gradient" | "upload";

interface ButtonProps {
  type: ButtonType;
  text: string;
  icon?: React.ElementType<SvgIconProps>;
  onClick?: () => void;
  style?: {};
}

export const Button = ({
  type,
  text,
  icon: Icon,
  onClick,
  style,
}: ButtonProps) => {
  let btnSx;
  switch (type) {
    case "outlined":
      btnSx = outlineBtnSx;
      break;
    case "gradient":
      btnSx = gradientBtnSx;
      break;
    case "upload":
      btnSx = uploadBtnSx;
      break;
    default:
      btnSx = {};
  }

  const variant = type === "outlined" ? "outlined" : "contained";

  const button = (
    <MuiButtons
      variant={variant}
      sx={{
        ...btnSx,
        ...style,
      }}
      onClick={onClick}
    >
      {Icon && <Icon fontSize="small" sx={{ marginRight: "6px" }} />}
      <Typography>{text}</Typography>
    </MuiButtons>
  );

  return button;
};

const outlineBtnSx = {
  background: "#FFFFFF",
  color: "#0575E6",
  textTransform: "capitalize",
  boxShadow: "none",
  padding: "12px 24px",
  border: "1px solid #0575E6",
};

const gradientBtnSx = {
  background: `${PRIMARY_GRADIENT}`,
  color: "#FFFFFF",
  textTransform: "capitalize",
  boxShadow: "none",
  padding: "12px 24px",
};

const uploadBtnSx = {
  background: "#E1F0FF",
  color: "#3699FF",
  textTransform: "capitalize",
  boxShadow: "none",
  padding: "8px 24px",
  border: "none",
  "&:hover": {
    opacity: 0.75,
    background: "#E1F0FF",
    boxShadow: "none",
  },
  transition: "all 0.3s",
};
