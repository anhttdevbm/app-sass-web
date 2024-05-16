import { Stack } from "@mui/material";
import { Switch as SwitchCommon, Text } from "components/shared";
import {
  Content,
  GradientBorderStack,
} from "components/sn-ai-agent-detail/Tools/components";
import useTheme from "hooks/useTheme";

interface SwitchProps {
  name: string;
  onClick?: () => void;
  isSwitched?: boolean;
}

export const Switch = ({ name, onClick, isSwitched }: SwitchProps) => {
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
        theme={theme}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <Stack direction={"column"} spacing={"4px"}>
          <Text variant={"h6"} fontWeight={400}>
            {name}
          </Text>
        </Stack>
        <SwitchCommon checked={isSwitched} />
      </Content>
    </GradientBorderStack>
  );
};
