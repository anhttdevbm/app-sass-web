import React from "react";
import Button from "@mui/material/Button";

type Props = {
  onClick?: () => void;
  height?: number;
  width?: number;
  text?: string;
  buttonDefault?: boolean;
  type?: string;
};

const ButtonCustom = (props: Props) => {
  const { onClick, height, width, text, buttonDefault, type } = props;
  return (
    <Button
      onClick={onClick}
      size="extraSmall"
      variant="primary"
      sx={{
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
        border: buttonDefault ? "1px solid  #2AF598 " : "",
      }}
    >
      {text || ""}
    </Button>
  );
};

export default ButtonCustom;
