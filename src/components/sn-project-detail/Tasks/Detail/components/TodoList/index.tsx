import { ChangeEvent, memo, useState } from "react";
import { Stack, TextField } from "@mui/material";
import { Checkbox, Collapse, IconButton, Text } from "components/shared";
import { NS_PROJECT, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import { useTaskDetail } from "store/project/selectors";
import PlusIcon from "icons/PlusIcon";
import { getMessageErrorByAPI } from "utils/index";
import { TaskDetail, TaskList, Todo } from "store/project/reducer";
import Assign from "./Assign";
import Actions, { Action } from "./Actions";
import ConfirmDialog from "components/ConfirmDialog";
import { TaskData } from "store/project/actions";
import useToggle from "hooks/useToggle";
import Loading from "components/Loading";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "react-beautiful-dnd";
import MoveDotIcon from "icons/MoveDotIcon";
import { reorder } from "components/sn-project-detail/Tasks/components";

const TodoList = ({ open }: { open: boolean }) => {
  const projectT = useTranslations(NS_PROJECT);
  const {
    task,
    taskListId,
    taskId,
    subTaskId,
    onUpdateTask,
    onUpdateOrderTodo,
    onGetTaskList,
    onUpdateTaskDetail,
  } = useTaskDetail();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const [isProcessing, onProcessingTrue, onProcessingFalse] = useToggle();

  const onSubmit = async (nameValue: string) => {
    if (!taskListId || !taskId) return;
    try {
      onProcessingTrue();
      const newTodoList = [
        ...(task?.todo_list ?? []),
        {
          name: nameValue,
        },
      ] as TaskData["todo_list"];
      return await onUpdateTask(
        { todo_list: newTodoList },
        taskListId,
        taskId,
        subTaskId,
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!taskListId || !taskId) return;
    const { source, destination } = result;
    if (!destination) return;

    const newData = [...(task?.todo_list ?? [])];

    const updatedOrder = reorder(
      newData,
      source.index,
      destination.index,
    ) as Todo[];

    const id_priorities = updatedOrder.map((item) => item.id);
    try {
      onProcessingTrue();
      await onUpdateOrderTodo({
        task_list: taskListId,
        task: taskId,
        sub_task: subTaskId,
        id_priorities,
      });

      onGetTaskList(taskListId);
      onUpdateTaskDetail({
        taskId,
        taskListId,
        subTaskId,
        ...task,
        todo_list: updatedOrder,
      } as TaskDetail);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }

    // newData = newData.map((todoItem) =>
    //   taskListItem.id !== sourceTaskListId
    //     ? taskListItem
    //     : { ...taskListItem, tasks: updatedOrder },
    // );
    // setDataList(updatedDataList);
  };

  if (!open) return null;

  return (
    <>
      <Collapse
        initCollapse
        label={
          <Text color="text.primary" variant="h6" textTransform="uppercase">
            {`${projectT("taskDetail.toDoList")} (${
              task?.todo_list?.length ?? 0
            })`}
          </Text>
        }
      >
        <Stack mt={2} maxWidth="100%" overflow="auto">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppableId">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {task?.todo_list?.map((toDo, index) => (
                    <SubItem
                      key={toDo.id}
                      {...toDo}
                      todoId={toDo.id}
                      index={index}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <Stack direction="row" alignItems="center" spacing={1}>
            <PlusIcon />
            <TodoName
              onSubmit={onSubmit}
              autoFocus={!task?.todo_list?.length}
            />
          </Stack>
        </Stack>
      </Collapse>
      <Loading open={isProcessing} />
    </>
  );
};

export default memo(TodoList);
export const TODO_LIST_ID = "todo_list_id";

const TodoName = ({
  onSubmit,
  value = "",
  autoFocus,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (name: string) => Promise<any>;
  value?: string;
  autoFocus?: boolean;
}) => {
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const [name, setName] = useState<string>(value);
  const [error, setError] = useState<string>("");

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
    setError("");
  };

  const onKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") return;
    const nameTrimmed = name?.trim();
    if (nameTrimmed) {
      await onSubmit(nameTrimmed);
      setName("");
    } else {
      setError(
        commonT("form.error.required", {
          name: projectT("detailTasks.form.title.name"),
        }),
      );
    }
  };

  return (
    <Stack width="100%">
      <TextField
        value={name}
        onKeyDown={onKeyDown}
        fullWidth
        variant="filled"
        size="small"
        onChange={onChange}
        autoFocus={autoFocus}
        sx={{
          "& >div": {
            bgcolor: "transparent!important",
          },
          "& input": {
            fontSize: 15,
          },
        }}
      />
      {!!error && (
        <Text variant="caption" color="error">
          {error}
        </Text>
      )}
    </Stack>
  );
};

const SubItem = (props: Todo & { todoId: string; index: number }) => {
  const { name, is_done, owner, todoId, index } = props;
  const {
    task,
    taskListId,
    taskId,
    subTaskId,
    onUpdateTask,
    onConvertToTask,
    onUpdateTodoStatus,
    onGetTaskList,
    onConvertToSubTask,
    onDeleteTodo,
    onUpdateTaskDetail,
  } = useTaskDetail();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);

  const [action, setAction] = useState<Action | undefined>();
  const [isProcessing, onProcessingTrue, onProcessingFalse] = useToggle();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onUpdateTodoList = async (name: string, value: any) => {
    if (!taskListId || !taskId) return;
    onProcessingTrue();
    try {
      const newTodoList = [...(task?.todo_list ?? [])].map((item) => ({
        id: item.id,
        name: item.name,
        is_done: item?.is_done,
        owner: item?.owner?.id,
      }));
      const indexUpdated = newTodoList?.findIndex(
        (todoItem) => todoItem.id === todoId,
      );

      newTodoList[indexUpdated] = {
        ...newTodoList[indexUpdated],
        [name]: value,
      };

      const result = await onUpdateTask(
        { todo_list: newTodoList },
        taskListId,
        taskId,
        subTaskId,
      );
      setAction(undefined);
      return result;
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }
  };

  const onChangeName = async (newName: string) => {
    await onUpdateTodoList("name", newName);
  };

  const onConvertToDoToTask = async () => {
    if (!taskListId || !taskId) return;

    try {
      await onConvertToTask({
        task_list: taskListId,
        task: taskId,
        sub_task: subTaskId,
        id_todo_list: todoId,
      });
      onGetTaskList(taskListId);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const onConvertToDoToSubTask = async () => {
    if (!taskListId || !taskId) return;

    try {
      await onConvertToSubTask({
        task_list: taskListId,
        task: taskId,
        sub_task: subTaskId,
        id_todo_list: todoId,
      });
      const taskList: TaskList = await onGetTaskList(taskListId);

      if (!subTaskId) {
        const taskItem = taskList.tasks.find(
          (taskItem) => taskItem.id === taskId,
        );
        if (taskItem) {
          onUpdateTaskDetail({
            ...taskItem,
            taskListId,
            taskId,
          });
        }
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const onDelete = async () => {
    if (!taskListId || !taskId) return;

    try {
      await onDeleteTodo({
        task_list: taskListId,
        task: taskId,
        sub_task: subTaskId,
        id_todo_list: todoId,
      });
      setAction(undefined);
      onGetTaskList(taskListId);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const onChangeAction = (newAction?: Action) => {
    switch (newAction) {
      case Action.CONVERT_TO_TASK:
        onConvertToDoToTask();
        break;
      case Action.CONVERT_TO_SUB_TASK:
        onConvertToDoToSubTask();
        break;
      default:
        setAction(newAction);
        break;
    }
  };

  const onChangeStatus = async (_, checked: boolean) => {
    if (!taskListId || !taskId) return;

    try {
      await onUpdateTodoStatus({
        task_list: taskListId,
        task: taskId,
        sub_task: subTaskId,
        id_todo_list: todoId,
        is_done: checked,
      });
      onGetTaskList(taskListId);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const onResetAction = () => {
    setAction(undefined);
  };

  const onEditName = () => {
    setAction(Action.RENAME);
  };

  return (
    <>
      <Draggable draggableId={todoId} index={index}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={2}
              width="100%"
              justifyContent="space-between"
            >
              <Stack direction="row" alignItems="center" spacing={0.5} flex={1}>
                <Checkbox
                  size="small"
                  checked={is_done}
                  onChange={onChangeStatus}
                />
                <IconButton noPadding {...provided.dragHandleProps}>
                  <MoveDotIcon fontSize="small" sx={{ color: "grey.A200" }} />
                </IconButton>
                {action === Action.RENAME ? (
                  <TodoName onSubmit={onChangeName} value={name} />
                ) : (
                  <Text
                    variant="body2"
                    sx={{
                      textDecoration: is_done ? "line-through" : undefined,
                    }}
                    noWrap
                    onClick={onEditName}
                    mt={0.25}
                  >
                    {name}
                  </Text>
                )}
              </Stack>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Assign owner={owner} todoId={todoId} />
                <Actions todoId={todoId} onChangeAction={onChangeAction} />
              </Stack>
            </Stack>
          </div>
        )}
      </Draggable>

      {action === Action.DELETE && (
        <ConfirmDialog
          onSubmit={onDelete}
          open
          onClose={onResetAction}
          title={commonT("confirmDelete.title")}
          content={commonT("confirmDelete.content")}
        />
      )}
      <Loading open={isProcessing} />
    </>
  );
};
