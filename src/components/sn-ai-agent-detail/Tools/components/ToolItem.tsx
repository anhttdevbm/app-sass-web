import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { PRIMARY_GRADIENT_COLOR } from "components/sn-ai-agent/components";
import useTheme from "hooks/useTheme";
import { backgroundImage } from "html2canvas/dist/types/css/property-descriptors/background-image";
import styled from "styled-components";

interface ToolItemProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

const GradientBorderStack = styled(Stack)(({ theme }) => ({
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
  },
  "&:hover": {
    "&:before": {
      background: "linear-gradient(90deg, #3699FF 0%, #00B8D9 100%)",
      transition: "background-image 0.5s",
    },
  },
}));

const Content = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  zIndex: 2,
  width: "100%",
  borderRadius: "2px",
}));

export const ToolItem = ({
  name,
  description,
  icon,
  onClick,
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
      theme={theme}
    >
      <Content
        padding={"16px 24px"}
        direction={"row"}
        spacing={2}
        theme={theme}
        alignItems={"center"}
      >
        {icon}
        <Stack direction={"column"} spacing={"4px"}>
          <Text variant={"h6"} fontWeight={400}>
            {name}
          </Text>
          <Text fontSize={"14px"} fontWeight={400} color={"grey.300"}>
            {description}
          </Text>
        </Stack>
      </Content>
    </GradientBorderStack>
  );
};
