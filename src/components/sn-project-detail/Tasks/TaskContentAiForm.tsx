import { Popover, Paper, Modal } from "@mui/material";
import { useEffect, useState } from "react";
import { useChatWithAI } from "store/aiChat/selectors";
import { AiTaskData, CreateTaskPrompt } from "store/project/actions";
import TaskAiEdit from "./components/TaskAiEdit";
import TaskAiPrompt from "./components/TaskAiPrompt";
import { useTasksOfProject } from "store/project/selectors";

const View = ["form", "edit"] as const;
type View = (typeof View)[number];

const CREATE_WITH_AI_COMMANDS = [
  "Subtask",
  "Brainstorm",
  "Outline",
  "Expand",
  "Fix spelling and grammar",
];

const TaskContentAiForm = (props: {
  open: boolean;
  onClose: () => void;
  taskListId: string;
  parentTaskId: string;
  parentTaskName: string;
}) => {
  const {
    tone: tones,
    persona: personas,
    onGetTone,
    onGetPersona,
  } = useChatWithAI();
  useEffect(() => {
    Promise.allSettled([onGetTone({}), onGetPersona({})]);
  }, [onGetPersona, onGetTone]);

  const { onCreateTaskWithAi, onCreateTask, items, onDeleteSubTasks } =
    useTasksOfProject();

  const [view, setView] = useState<View>("form");
  const [taskData, setTaskData] = useState<AiTaskData | null>(null);
  const [taskPrompt, setTaskPrompt] = useState<CreateTaskPrompt | null>(null);

  const onFormSubmit = async (data: CreateTaskPrompt) => {
    setTaskPrompt(data);
    const result = await onCreateTaskWithAi(data);
    setTaskData(result);
    setView("edit");
  };

  const onInsert = async (data: AiTaskData) => {
    if (taskPrompt?.method === "Subtask") {
      await Promise.allSettled(
        data.subtask.map((_subtask) =>
          onCreateTask(
            {
              name: _subtask,
            },
            props.taskListId,
            props.parentTaskId,
          ),
        ),
      );
    } else {
      // TODO
    }
    props.onClose();
  };

  const onReplace = async (data: AiTaskData) => {
    if (taskPrompt?.method === "Subtask") {
      const task = items
        .find((item) => item.id === props.taskListId)!
        .tasks.find((task) => task.id === props.parentTaskId)!;
      await onDeleteSubTasks({
        task_list: props.taskListId,
        task: props.parentTaskId,
        sub_tasks: (task.sub_tasks ?? []).map((_sub_task) => _sub_task.id),
      });
      await onInsert(data);
    }
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
          width: "50%",
          bgcolor: "background.paper",
        }}
      >
        {view === "form" ? (
          <TaskAiPrompt
            tones={tones}
            personas={personas}
            content={props.parentTaskName}
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
        ) : null}
      </Paper>
    </Modal>
  );
};

export default TaskContentAiForm;
