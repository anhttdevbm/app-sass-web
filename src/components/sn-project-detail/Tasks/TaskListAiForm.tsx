import { CircularProgress, Modal, Paper } from "@mui/material";
import ProjectAiEdit from "components/sn-projects/components/ProjectAiEdit";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useChatWithAI } from "store/aiChat/selectors";
import { AiProjectData, CreateTaskPrompt } from "store/project/actions";
import { useTasksOfProject } from "store/project/selectors";
import TaskAiPrompt from "./components/TaskAiPrompt";

const CREATE_WITH_AI_COMMANDS = ["Subtask"];

const View = ["form", "edit", "loading"] as const;
type View = (typeof View)[number];

const TaskListAiForm = (props: {
  open: boolean;
  onClose: () => void;
  content: string;
}) => {
  const {
    tone: tones,
    onGetTone,
    persona: personas,
    onGetPersona,
  } = useChatWithAI();
  const { onCreateTaskListWithAi, onCreateTaskList, onCreateTask } =
    useTasksOfProject();
  const params = useParams();
  const projectId = useMemo(() => params.id, [params.id]) as string;

  useEffect(() => {
    Promise.allSettled([onGetTone({}), onGetPersona({})]).then(() =>
      setView("form"),
    );
  }, [onGetTone, onGetPersona]);

  const [view, setView] = useState<View>("form");
  const [taskListData, setTaskListData] = useState<AiProjectData | null>(null);
  const [tone, setTone] = useState("");
  const [persona, setPersona] = useState("");

  const onFormSubmit = async (data: CreateTaskPrompt) => {
    const result = await onCreateTaskListWithAi({
      tone: data.tone,
      persona: data.persona,
      prompt: data.content,
    });
    setTaskListData(result);
    setTone(data.tone);
    setPersona(data.persona);
    setView("edit");
  };

  const generateTaskList = async (data: AiProjectData) => {
    for (const _taskList of data.taskList) {
      const taskList = await onCreateTaskList({
        name: _taskList.title,
        project: projectId,
      });

      for (const _task of _taskList.tasks) {
        await onCreateTask({ name: _task }, taskList.id);
      }
    }
    props.onClose();
  };

  return (
    <Modal open={props.open} onClose={props.onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          maxHeight: "50%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {view === "form" ? (
          <TaskAiPrompt
            tones={tones}
            personas={personas}
            content={props.content}
            commands={CREATE_WITH_AI_COMMANDS}
            onSubmit={onFormSubmit}
            onClose={props.onClose}
          />
        ) : view === "edit" ? (
          <ProjectAiEdit
            tone={tone}
            persona={persona}
            projectData={taskListData!}
            onSubmit={generateTaskList}
          />
        ) : view === "loading" ? (
          <CircularProgress />
        ) : null}
      </Paper>
    </Modal>
  );
};

export default TaskListAiForm;
