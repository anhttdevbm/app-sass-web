import { Stack } from "@mui/material";
import { Title } from "./components/Title";
import { AddCommandButton } from "./components/AddCommandButton";
import { Textarea } from "../General/components";
import { useTranslations } from "next-intl";
import { NS_AI_AGENT } from "constant/index";

export const Body = () => {
  const t = useTranslations(NS_AI_AGENT);

  const handleSendMsg = () => {
    console.log("Send Message");
  };

  return (
    <Stack
      padding={3}
      alignItems={"center"}
      justifyContent={"space-between"}
      spacing={3}
      width={"100%"}
    >
      <Title />
      <Stack width={"296px"}>
        <AddCommandButton />
      </Stack>
      <Textarea
        placeholder={t("chatAIAgent.askMeAnything")}
        isCount={false}
        onSend={handleSendMsg}
      />
    </Stack>
  );
};
