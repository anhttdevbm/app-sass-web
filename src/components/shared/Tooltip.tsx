import { memo } from "react";
import {
  Tooltip as MuiTooltip,
  TooltipProps,
  Zoom,
  tooltipClasses,
} from "@mui/material";
import useTheme from "hooks/useTheme";

const Tooltip = (props: TooltipProps) => {
  const { children, sx, ...rest } = props;

  const { isDarkMode } = useTheme();

  return (
    <MuiTooltip
      placement="top"
      arrow
      TransitionComponent={Zoom}
      PopperProps={{
        sx: {
          [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: isDarkMode ? "background.paper" : "grey.900",
            fontSize: 12,
            lineHeight: 1.25,
            color: isDarkMode ? "common.white" : "grey.A200",
            px: 1.5,
            py: 0.75,
            borderRadius: 0.5,
            ...sx,
          },
          [`& .${tooltipClasses.arrow}`]: {
            color: isDarkMode ? "background.paper" : "grey.900",
          },
        },
      }}
      {...rest}
    >
      {children}
    </MuiTooltip>
  );
};

export default memo(Tooltip);
