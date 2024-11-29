import { css, Global } from "@emotion/react";
import { Button, SxProps } from "@mui/material";
import Text from "components/shared/Text";
import { ReactNode } from "react";

const BLUE_COLOR = "#0575E6 5.8%";
const GREEN_COLOR = "#38E27B 96.38%";

interface AnimatedButtonProps {
    name: string;
    onClick?: () => void;
    icon?: ReactNode;
    sx?: SxProps;
}

export const ButtonOutlineGradient: React.FC<AnimatedButtonProps> = ({ name, onClick, icon, sx }) => {
    return (
        <>
            <Global styles={css`
          @property --rotate {
              syntax: "<angle>";
              initial-value: 132deg;
              inherits: false;
          }

          @keyframes spin {
              0% {
                  --rotate: 0deg;
              }
              100% {
                  --rotate: 360deg;
              }
          }

          .animated-button {
              &::before, &::after {
                  position: absolute;
                  content: "";
                  inset: -.15rem;
                  z-index: -1;
                  background-image: linear-gradient(var(--rotate), ${BLUE_COLOR}, ${GREEN_COLOR});
                  border-radius: inherit; /* Ensure border-radius is inherited */
              }

              &:hover {
                  &::before, &::after {
                      animation: spin 1s linear infinite;
                  }
              }
          }
      `} />
            <Button
                className="animated-button"
                sx={{
                    cursor: "pointer",
                    background: "white",
                    borderRadius: "12px", /* Ensure border-radius is applied */
                    position: "relative",
                    margin: ".15rem",
                    padding: "0.6rem 1.5rem",
                    border: "2px solid",
                    borderImageSource: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                    borderImageSlice: 1,

                    "&:hover": {
                        background: "white",
                    },

                    ...sx,
                }}
                onClick={onClick}
            >
                {icon}
                <Text
                    variant={"h6"}
                    sx={{
                        background: "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        textTransform: "capitalize",
                        marginLeft: "0.3rem",
                    }}
                >
                    {name}
                </Text>
            </Button>
        </>
    );
};