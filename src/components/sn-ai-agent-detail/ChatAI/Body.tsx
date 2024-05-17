import { Stack } from "@mui/material";
import { Title } from "./components/Title";
import { AddCommandButton } from "./components/AddCommandButton";
import { Textarea } from "../General/components";
import { useTranslations } from "next-intl";
import { NS_AI_AGENT } from "constant/index";
import { CommandButton } from "./components/CommandButton";

const ListCommands = [
  {
    id: "1",
    name: "Hello",
    description: "Hi there!",
  },
  {
    id: "2",
    name: "How are you?",
    description: "I'm good, thank you!",
  },
  // {
  //   id: "3",
  //   name: "What's your name?",
  //   description: "I'm AI Agent.",
  // },
];

export const Body = () => {
  const t = useTranslations(NS_AI_AGENT);

  const handleSendMsg = () => {
    console.log("Send Message");
  };

  const handleClickCommand = () => {
    console.log("Click Command");
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
      <Stack
        gap={2}
        direction="row"
        flexWrap="wrap"
        width={ListCommands.length === 0 ? "296px" : "100%"}
      >
        {ListCommands.map((item) => (
          <CommandButton
            key={item.id}
            icon={<></>}
            label={item.name}
            description={item.description}
            onClick={handleClickCommand}
          />
        ))}
        <AddCommandButton
          width={ListCommands.length % 2 === 0 ? "100%" : "calc(50% - 8px)"}
        />
      </Stack>
      <Textarea
        placeholder={t("chatAIAgent.askMeAnything")}
        isCount={false}
        onSend={handleSendMsg}
      />
    </Stack>
  );
};
