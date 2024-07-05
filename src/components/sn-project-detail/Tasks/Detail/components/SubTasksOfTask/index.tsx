import { ChangeEvent, memo, useMemo, useState } from "react";
import { Box, Stack, TextField } from "@mui/material";
import { Collapse, Text } from "components/shared";
import { NS_PROJECT, NS_COMMON, DATE_FORMAT_FORM } from "constant/index";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import { useTaskDetail, useTasksOfProject } from "store/project/selectors";
import PlusIcon from "icons/PlusIcon";
import { formatDate, getMessageErrorByAPI } from "utils/index";
import { Task, TaskDetail } from "store/project/reducer";
import PDate from "./PDate";
import Assign from "./Assign";
import StatusTask from "./Status";
import Actions, { Action } from "./Actions";
import { genName } from "components/sn-project-detail/Tasks/components";
import { Status } from "constant/enums";
import MoveOtherTask from "./MoveOtherTask";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import Loading from "components/Loading";
import Sort, { Action as SortAction } from "./Sort";

type SubTasksOfTaskProps = {
  open: boolean;
};

const SubTasksOfTask = ({ open }: SubTasksOfTaskProps) => {
  const projectT = useTranslations(NS_PROJECT);
  const { task, taskListId, taskId } = useTaskDetail();
  const { onCreateTask } = useTasksOfProject();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);

  const [action, setAction] = useState<SortAction | undefined>();

  const subTasks = useMemo(() => {
    const originItems = [...(task?.sub_tasks ?? [])].map((item) => ({
      ...item,
      statusNumber:
        item?.status === Status.ACTIVE
          ? 0
          : item?.status === Status.PAUSE
          ? 1
          : 2,
    }));
    switch (action) {
      case SortAction.TITLE:
        return originItems.sort((a, b) => a.name.localeCompare(b.name));
      case SortAction.DUE_DATE:
        return originItems.sort(
          (a, b) =>
            new Date(a?.end_date ?? TOMORROW_TIME).getTime() -
            new Date(b?.end_date ?? TOMORROW_TIME).getTime(),
        );
      case SortAction.ASSIGNEE:
        return originItems.sort((a, b) =>
          (a?.owner?.fullname ?? "z").localeCompare(b?.owner?.fullname ?? "z"),
        );
      case SortAction.STATUS:
        return originItems.sort((a, b) => a.statusNumber - b.statusNumber);
      case SortAction.MANUAL:
      default:
        return originItems;
    }
  }, [task?.sub_tasks, action]);

  const onSubmit = async (nameValue: string) => {
    if (!taskListId) return;
    try {
      return await onCreateTask(
        { name: nameValue, status: Status.ACTIVE },
        taskListId,
        taskId,
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  if (!open) return null;

  return (
    <>
      <Box component="span" id={SUB_TASKS_ID} hidden />
      <Collapse
        initCollapse
        label={
          <Text color="text.primary" variant="h6" textTransform="uppercase">
            {`${projectT("taskDetail.subTasks")} (${
              task?.sub_tasks?.length ?? 0
            })`}
          </Text>
        }
      >
        <Stack mt={2} position="relative" maxWidth="100%" height="100%">
          {subTasks.map((subTask) => (
            <SubTaskItem key={subTask.id} subId={subTask.id} {...subTask} />
          ))}
          <Stack direction="row" alignItems="center" spacing={1}>
            <PlusIcon />
            <TaskName
              onSubmit={onSubmit}
              autoFocus={!task?.sub_tasks?.length}
            />
          </Stack>
          <Sort setAction={setAction} />
        </Stack>
      </Collapse>
    </>
  );
};

export default memo(SubTasksOfTask);

export const SUB_TASKS_ID = "sub_tasks_id";

const TOMORROW_TIME = 4107690000000;

const TaskName = ({
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

const SubTaskItem = (props: Task & { subId: string }) => {
  const { status, name, end_date, start_date, owner, description, subId } =
    props;
  const {
    task,
    taskListId,
    taskId,
    onUpdateTask,
    onUpdateTaskDetail,
    onConvertSubTaskToTask,
    onGetTaskList,
  } = useTaskDetail();
  const { onAddSnackbar } = useSnackbar();
  const { onCreateTask, onDeleteSubTasks } = useTasksOfProject();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const [action, setAction] = useState<Action | undefined>();
  const [isProcessing, onProcessingTrue, onProcessingFalse] = useToggle(false);

  const onChangeDate = async (name: string, value?: string) => {
    if (!taskListId || !taskId) return;

    onProcessingTrue();

    try {
      await onUpdateTask(
        { [name]: formatDate(value, DATE_FORMAT_FORM) },
        taskListId,
        taskId,
        subId,
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }
  };

  const onChangeName = async (newName: string) => {
    if (!taskListId || !taskId) return;

    onProcessingTrue();
    try {
      await onUpdateTask({ name: newName }, taskListId, taskId, subId);
      setAction(undefined);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }
  };

  const onDuplicate = async () => {
    if (!taskListId || !taskId) return;
    onProcessingTrue();

    const subTaskNames = (task?.sub_tasks ?? []).map((item) => item.name);
    try {
      await onCreateTask(
        {
          status,
          name: genName(subTaskNames, name),
          end_date,
          start_date,
          owner: owner?.id,
          description,
        },
        taskListId,
        taskId,
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }
  };

  const onConvertToTask = async () => {
    if (!taskListId || !taskId) return;
    onProcessingTrue();
    try {
      await onConvertSubTaskToTask({
        task_list: taskListId,
        task: taskId,
        sub_task: subId,
      });
      await onGetTaskList(taskListId);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }
  };

  const onDelete = async () => {
    if (!taskListId || !taskId) return;

    onProcessingTrue();
    try {
      await onDeleteSubTasks({
        task: taskId,
        task_list: taskListId,
        sub_tasks: [subId],
      });
      setAction(undefined);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      onProcessingFalse();
    }
  };

  const onChangeAction = (newAction?: Action) => {
    switch (newAction) {
      case Action.DUPLICATE_SUB_TASK:
        onDuplicate();
        break;
      case Action.CONVERT_TO_TASK:
        onConvertToTask();
        break;
      default:
        setAction(newAction);
        break;
    }
  };

  const onResetAction = () => {
    setAction(undefined);
  };

  const onSetTask = () => {
    onUpdateTaskDetail({
      ...props,
      taskListId,
      taskId,
      subTaskId: subId,
    } as TaskDetail);
  };

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        width="100%"
        justifyContent="space-between"
      >
        <Stack
          direction="row"
          minWidth={185}
          alignItems="center"
          spacing={2}
          flex={1}
        >
          <StatusTask status={status} subId={subId} />
          {action === Action.RENAME ? (
            <TaskName onSubmit={onChangeName} value={name} />
          ) : (
            <Text
              variant="body2"
              onClick={onSetTask}
              noWrap
              sx={{
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              maxWidth={150}
            >
              {name}
            </Text>
          )}
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          flex={1}
          justifyContent="flex-end"
        >
          <PDate
            label={
              start_date
                ? formatDate(start_date)
                : commonT("form.title.startDate")
            }
            name="start_date"
            maxDate={end_date}
            onChange={onChangeDate}
            value={start_date}
          />
          <PDate
            label={
              end_date
                ? formatDate(end_date)
                : projectT("taskDetail.setDueDate")
            }
            name="end_date"
            minDate={start_date}
            onChange={onChangeDate}
            value={end_date}
          />
          <Assign owner={owner} subId={subId} />
          <Actions subId={subId} onChangeAction={onChangeAction} />
        </Stack>
      </Stack>
      {action === Action.CHANGE_PARENT_TASK && (
        <MoveOtherTask subId={subId} open onClose={onResetAction} />
      )}
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
