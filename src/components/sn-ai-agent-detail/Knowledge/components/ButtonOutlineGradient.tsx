import { Stack } from "@mui/material";
import { GradientBorderStack } from "components/sn-ai-agent-detail/Tools/components";
import useTheme from "hooks/useTheme";
import React from "react";
import styled from "styled-components";

interface ButtonOutlineGradientProps {
  name: string;
  onClick?: () => void;
  icon: React.ReactNode;
}

const GradientText = styled.span`
  background: linear-gradient(to right, #0575e6, #38e27b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-left: 6px;
`;

const Content = styled(Stack)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  zIndex: 2,
  width: "100%",
  borderRadius: "2px",
}));

export const ButtonOutlineGradient: React.FC<ButtonOutlineGradientProps> = ({
  name,
  onClick,
  icon,
}) => {
  const theme = useTheme();

  return (
    <GradientBorderStack
      borderRadius={"4px"}
      sx={{
        cursor: "pointer",
      }}
      onClick={onClick}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Content
        padding={"12px 24px"}
        direction={"row"}
        theme={theme}
        flex={1}
        justifyContent={"center"}
        alignItems={"center"}
      >
        {icon}
        <GradientText>{name}</GradientText>
      </Content>
    </GradientBorderStack>
  );
};
