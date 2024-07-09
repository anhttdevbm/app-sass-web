import { memo } from "react";
import { AlertColor } from "@mui/material";
import { Text, TextProps } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import useTheme from "hooks/useTheme";

type TextStatusProps = {
  text: string;
  color: AlertColor | "purple" | "positive" | "common";
  width?: TextProps["minWidth"];
  namespace?: string;
  isActive?: boolean;
} & Omit<TextProps, "color">;

const TextStatus = (props: TextStatusProps) => {
  const { isDarkMode } = useTheme();

  const {
    text,
    color,
    width,
    namespace = NS_COMMON,
    children,
    isActive,
    ...rest
  } = props;

  const t = useTranslations(namespace);

  return (
    <Text
      color={({ palette }) =>
        isActive ? (isDarkMode ? "white" : "black") : palette?.[color]?.main
      }
      bgcolor={({ palette }) =>
        isActive ? "transparent" : palette?.[color]?.light
      }
      variant="caption"
      fontWeight={isActive ? 700 : 500}
      py={0.5}
      px={{ xs: 0.5, md: 1 }}
      borderRadius="1.5rem"
      textAlign="center"
      display="inline-block"
      minWidth={width}
      {...rest}
    >
      {children || t(text)}
    </Text>
  );
};

export default memo(TextStatus);
