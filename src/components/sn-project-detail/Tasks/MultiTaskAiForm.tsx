import { Modal, Paper } from "@mui/material";
import TaskAiPrompt from "./components/TaskAiPrompt";
import { useEffect } from "react";
import { useChatWithAI } from "store/aiChat/selectors";
import { CreateTaskPrompt } from "store/project/actions";

const CREATE_WITH_AI_COMMANDS = [
  "Prioritize",
  "Subtask",
  "Brainstorm",
  "Outline",
  "Expand",
  "Fix spelling and grammar",
];

const MultiTaskAiForm = (props: { open: boolean; onClose: () => void }) => {
  const {
    tone: tones,
    persona: personas,
    onGetTone,
    onGetPersona,
  } = useChatWithAI();
  useEffect(() => {
    Promise.allSettled([onGetTone({}), onGetPersona({})]);
  }, [onGetPersona, onGetTone]);

  const onFormSubmit = async (data: CreateTaskPrompt) => {
    // TODO
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
        }}
      >
        <TaskAiPrompt
          tones={tones}
          personas={personas}
          content={""}
          commands={CREATE_WITH_AI_COMMANDS}
          onSubmit={onFormSubmit}
          onClose={props.onClose}
        />
      </Paper>
    </Modal>
  );
};

export default MultiTaskAiForm;
