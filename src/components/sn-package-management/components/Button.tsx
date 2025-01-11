import Button from "@mui/material/Button";
import { SxProps, Theme } from "@mui/system";

type Props = {
  onClick?: () => void;
  height?: number;
  width?: string | number | { [key: string]: string | number }; // Responsive or fixed width
  text?: string;
  buttonDefault?: boolean;
  type?: string;
  sx?: SxProps<Theme>;
  disabled?: boolean;
};

const ButtonCustom = (props: Props) => {
  const { onClick, height, width, text, buttonDefault, type, sx, disabled } = props;

  const sxStyle: SxProps<Theme> | undefined = {
    boxShadow: "none",
    fontWeight: "600",
    background: buttonDefault
      ? "#fff"
      : "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
    "&:hover": {
      background: buttonDefault
        ? "#fff"
        : "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)!important",
    },
    borderRadius: "100px",
    height: height || 34,
    width: width || 158,
    color: buttonDefault ? "#0575E6" : "#fff",
    textTransform: "none",
    border: buttonDefault ? "1px solid #2AF598" : "",
    // ...sx,
  };

  return (
    <Button onClick={onClick} size="extraSmall" variant="primary" sx={sxStyle} disabled={disabled}>
      {text || ""}
    </Button>
  );
};

export default ButtonCustom;
