import { Button as MuiButtons, SvgIconProps, Typography } from "@mui/material";

type ButtonType = "outlined" | "gradient" | "upload";

const PRIMARY_GRADIENT_COLOR =
  "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)";

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
        minWidth: "150px",
      }}
      onClick={onClick}
    >
      {Icon && <Icon fontSize="small" sx={{ marginRight: "6px" }} />}
      <Typography fontSize={"14px"} lineHeight={"16px"}>{text}</Typography>
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
  background: `${PRIMARY_GRADIENT_COLOR}`,
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
