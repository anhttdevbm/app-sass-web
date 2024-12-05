import { Stack } from "@mui/material";
import { GradientBorderStack } from "components/sn-ai-agent-detail/Tools/components";
import useTheme from "hooks/useTheme";
import React from "react";
import styled from "styled-components";

interface ButtonOutlineGradientProps {
  name: string;
  onClick?: () => void;
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
  borderRadius: "20px",
}));

export const ButtonOutlineGradient: React.FC<ButtonOutlineGradientProps> = ({
  name,
  onClick,
}) => {
  const theme = useTheme();

  return (
    <GradientBorderStack
      borderRadius={"20px"} // Ensure border radius is applied
      sx={{
        cursor: "pointer",
        border: "2px solid",
        borderImageSlice: 1,
        borderWidth: "2px",
        borderImageSource: "linear-gradient(to right, #0575e6, #38e27b)", // Linear gradient border
        padding: "12px 24px", // Add padding to ensure content is inside the border
      }}
      onClick={onClick}
      flex={1}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Content
        direction={"row"}
        theme={theme}
        flex={1}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <GradientText>{name}</GradientText>
      </Content>
    </GradientBorderStack>
  );
};