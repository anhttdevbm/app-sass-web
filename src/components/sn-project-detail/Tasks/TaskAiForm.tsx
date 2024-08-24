import { CircularProgress, Modal, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { useChatWithAI } from "store/aiChat/selectors";
import TaskAiPrompt from "./components/TaskAiPrompt";
import TaskAiEdit from "./components/TaskAiEdit";
import { AiTaskData, CreateTaskPrompt } from "store/project/actions";
import { useTasksOfProject } from "store/project/selectors";

const View = ["form", "edit", "loading"] as const;
type View = (typeof View)[number];

const CREATE_WITH_AI_COMMANDS = ["Subtask"];

const TaskAiForm = (props: {
  open: boolean;
  onClose: () => void;
  taskListId: string;
  taskListName: string;
}) => {
  const {
    tone: tones,
    persona: personas,
    onGetTone,
    onGetPersona,
  } = useChatWithAI();
  useEffect(() => {
    Promise.allSettled([onGetTone({}), onGetPersona({})]).then(() => {
      setView("form");
    });
  }, [onGetPersona, onGetTone]);

  const { onCreateTaskWithAi, onCreateTask, items, onDeleteTasks } =
    useTasksOfProject();

  const [view, setView] = useState<View>("loading");
  const [taskData, setTaskData] = useState<AiTaskData | null>(null);
  const [taskPrompt, setTaskPrompt] = useState<CreateTaskPrompt | null>(null);

  const onFormSubmit = async (data: CreateTaskPrompt) => {
    setTaskPrompt(data);
    const result = await onCreateTaskWithAi(data);
    setTaskData(result);
    setView("edit");
  };

  const onInsert = async (data: AiTaskData) => {
    await Promise.allSettled(
      data.subtask.map((_subtask) =>
        onCreateTask(
          {
            name: _subtask,
          },
          props.taskListId,
        ),
      ),
    );
    props.onClose();
  };

  const onReplace = async (data: AiTaskData) => {
    const taskList = items.find((item) => item.id === props.taskListId)!;
    await onDeleteTasks({
      task_list: props.taskListId,
      tasks: taskList.tasks.map((_task) => _task.id),
    });
    await onInsert(data);
    props.onClose();
  };

  const onRegenerate = async () => {
    return onCreateTaskWithAi(taskPrompt!);
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
          bgcolor: "background.paper",
        }}
      >
        {view === "form" ? (
          <TaskAiPrompt
            tones={tones}
            personas={personas}
            content={props.taskListName}
            commands={CREATE_WITH_AI_COMMANDS}
            onSubmit={onFormSubmit}
            onClose={props.onClose}
          />
        ) : view === "edit" ? (
          <TaskAiEdit
            tone={taskPrompt!.tone}
            persona={taskPrompt!.persona}
            taskData={taskData!}
            onInsert={onInsert}
            onReplace={onReplace}
            onRegenerate={onRegenerate}
          />
        ) : view === "loading" ? (
          <CircularProgress />
        ) : null}
      </Paper>
    </Modal>
  );
};

export default TaskAiForm;
