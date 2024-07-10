import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { PRIMARY_GRADIENT_COLOR } from "components/sn-ai-agent/components";
import useTheme from "hooks/useTheme";
import styled from "styled-components";

interface ToolItemProps {
  name: string;
  description?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sxText?: any;
}

export const GradientBorderStack = styled(Stack)(() => ({
  position: "relative",
  padding: "2px",
  "&:before": {
    content: '""',
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundImage: PRIMARY_GRADIENT_COLOR,
    borderRadius: "inherit",
    zIndex: 1,
  }
}));

export const Content = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  zIndex: 2,
  width: "100%",
  borderRadius: "2px",
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    transition: "background-color 0.5s",
  }
}));

export const ToolItem = ({
  name,
  description,
  icon,
  onClick,
  sxText,
}: ToolItemProps) => {
  const theme = useTheme();

  return (
    <GradientBorderStack
      width={"100%"}
      borderRadius={"4px"}
      onClick={onClick}
      sx={{
        cursor: "pointer",
      }}
    >
      <Content
        padding={"16px 24px"}
        direction={"row"}
        spacing={2}
        theme={theme}
        alignItems={"center"}
      >
        {icon}
        <Stack direction={"column"} spacing={"4px"} alignItems={"flex-start"} justifyContent={"space-between"}>
          <Text variant={"h6"} fontWeight={400} sx={sxText}>
            {name}
          </Text>
          {description && (
            <Text fontSize={"14px"} fontWeight={400} color={"grey.300"}>
              {description}
            </Text>
          )}
        </Stack>
      </Content>
    </GradientBorderStack>
  );
};
