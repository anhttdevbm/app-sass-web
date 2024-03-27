import {
  Box,
  ButtonBase,
  Fade,
  Grow,
  MenuItem,
  MenuList,
  Popover,
  Popper,
  Stack,
  popoverClasses,
} from "@mui/material";
import { IconButton, IconButtonProps, Text, Tooltip } from "components/shared";
import {
  AN_ERROR_TRY_AGAIN,
  DATE_FORMAT_FORM,
  NS_COMMON,
  NS_PROJECT,
} from "constant/index";
import DuplicateIcon from "icons/DuplicateIcon";
import MoreDotIcon from "icons/MoreDotIcon";
import MoveArrowIcon from "icons/MoveArrowIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import {
  memo,
  MouseEvent,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTaskDetail, useTasksOfProject } from "store/project/selectors";
import { Selected, genName } from "./helpers";
import { Task, TaskList } from "store/project/reducer";
import { useParams } from "next/navigation";
import { useSnackbar } from "store/app/selectors";
import { formatDate, getMessageErrorByAPI } from "utils/index";
import {
  DeleteSubTasksData,
  DeleteTaskListsData,
  DeleteTasksData,
  TaskData,
} from "store/project/actions";
import Loading from "components/Loading";
import MoveTaskList from "../MoveTaskList";
import { string } from "yup";
import ConfirmDialog from "components/ConfirmDialog";
import HierarchyIcon from "icons/HierarchyIcon";
import AddSubTask from "../AddSubTask";
import ConvertIcon from "icons/ConvertIcon";
import ChangeIcon from "icons/ChangeIcon";
import MoveOtherTask from "../Detail/components/SubTasksOfTask/MoveOtherTask";
import { useOnClickOutside } from "hooks/useOnClickOutside";

type MoreListProps = {
  selectedList: Selected[];
  onReset: () => void;
  isClosed?: boolean;
} & IconButtonProps;

enum Action {
  RENAME,
  DUPLICATE = 1,
  MOVE,
  DELETE,
  ADD_SUB_TASK,
  CONVERT_SUB_TASK_TO_TASK,
  CHANGE_PARENT_TASK,
}

const MoreList = (props: MoreListProps) => {
  const { selectedList, onReset, isClosed, ...rest } = props;

  const {
    items,
    onCreateTaskList,
    onCreateTask,
    onDeleteTaskLists,
    onDeleteTasks,
    onDeleteSubTasks,
  } = useTasksOfProject();

  const { onConvertSubTaskToTask, onGetTaskList } = useTaskDetail();

  const handleClickOutside = () => {
    onClose();
  };

  const ref = useOnClickOutside(handleClickOutside);

  const projectT = useTranslations(NS_PROJECT);
  const { onAddSnackbar } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const params = useParams();
  const projectId = useMemo(() => params?.id, [params?.id]) as string;

  const { taskIds, taskListIds } = useMemo(() => {
    return selectedList.reduce(
      (
        out: { taskIds: { [key: string]: string[] }; taskListIds: string[] },
        item,
      ) => {
        if (!item?.subTaskId && item?.taskId) {
          const taskListId = item.taskListId as string;
          if (!out.taskListIds.includes(taskListId)) {
            out.taskListIds.push(taskListId);
          }
          out.taskIds[taskListId] = [
            ...(out.taskIds[taskListId] ?? []),
            item.taskId as string,
          ];
        }
        return out;
      },
      {
        taskIds: {},
        taskListIds: [],
      },
    );
  }, [selectedList]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();
  const commonT = useTranslations(NS_COMMON);

  const [type, setType] = useState<Action | undefined>();
  const [msg, setMsg] = useState<string | undefined>();

  const onOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onSetTType = (action?: Action) => {
    return () => {
      onClose();
      setType(action);
      if (!action) {
        onReset();
      }
    };
  };

  const onDuplicateTaskList = async (taskList: TaskList) => {
    try {
      if (!params?.id) {
        throw AN_ERROR_TRY_AGAIN;
      }
      const taskListNames = items.map((item) => item.name);

      const newTaskList = await onCreateTaskList({
        name: genName(taskListNames, taskList.name),
        project: projectId,
      });

      if (newTaskList?.id) {
        const tasksOfTaskList = items.find((item) => item.id === taskList.id);
        if (!tasksOfTaskList) {
          throw AN_ERROR_TRY_AGAIN;
        }
        const tasks: Task[] = [];
        for (const taskItem of tasksOfTaskList.tasks) {
          const newTask = (await onCreateTask(
            {
              name: taskItem.name,
              description: taskItem?.description,
              start_date: taskItem?.start_date
                ? formatDate(taskItem.start_date, DATE_FORMAT_FORM)
                : undefined,
              end_date: taskItem?.end_date
                ? formatDate(taskItem.end_date, DATE_FORMAT_FORM)
                : undefined,
              owner: taskItem?.owner?.id,
              estimated_hours: taskItem?.estimated_hours,
            },
            newTaskList.id,
          )) as { task: Task };
          if (newTask?.task?.id) {
            tasks.push(newTask.task);
          }
        }

        for (let i = 0; i < tasks.length; i++) {
          const subTasks = tasksOfTaskList.tasks[i]?.sub_tasks ?? [];
          for (const subTask of subTasks) {
            (await onCreateTask(
              {
                name: subTask.name,
                description: subTask?.description,
                start_date: subTask?.start_date
                  ? formatDate(subTask.start_date, DATE_FORMAT_FORM)
                  : undefined,
                end_date: subTask?.end_date
                  ? formatDate(subTask.end_date, DATE_FORMAT_FORM)
                  : undefined,
                owner: subTask?.owner?.id,
                estimated_hours: subTask?.estimated_hours,
              },
              newTaskList.id,
              tasks[i].id,
            )) as { task: Task };
          }
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const onDuplicateTask = async (task: Task & { task_list: string }) => {
    try {
      if (!task?.task_list) {
        throw AN_ERROR_TRY_AGAIN;
      }
      const taskList = items.find((item) => item.id === task.task_list);
      const taskNames = taskList?.tasks?.map((taskItem) => taskItem.name) ?? [];
      const newTask = (await onCreateTask(
        {
          name: genName(taskNames, task.name),
          description: task?.description,
          start_date: task?.start_date
            ? formatDate(task.start_date, DATE_FORMAT_FORM)
            : undefined,
          end_date: task?.end_date
            ? formatDate(task.end_date, DATE_FORMAT_FORM)
            : undefined,
          owner: task?.owner?.id,
          status: task?.status,
          estimated_hours: task?.estimated_hours,
        },
        task.task_list,
      )) as { task: Task };
      if (newTask?.task?.id && task?.sub_tasks?.length) {
        for (const subTask of task.sub_tasks) {
          (await onCreateTask(
            {
              name: subTask.name,
              description: subTask?.description,
              start_date: subTask?.start_date
                ? formatDate(subTask.start_date, DATE_FORMAT_FORM)
                : undefined,
              end_date: subTask?.end_date
                ? formatDate(subTask.end_date, DATE_FORMAT_FORM)
                : undefined,
              owner: subTask?.owner?.id,
              status: subTask?.status,
              estimated_hours: subTask?.estimated_hours,
            },
            task.task_list,
            newTask.task.id,
          )) as { task: Task };
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const onDuplicate = async () => {
    try {
      // DM01
      //   DM01-Task 01
      //     DM01-Task 01-SubTask 01
      //     DM01-Task 01-SubTask 02
      //   DM01-Task 02
      //     DM01-Task 02-SubTask 01
      //   DM01-Task 03
      //     DM01-Task 02-SubTask 01
      setIsSubmitting(true);
      setMsg(projectT("detailTasks.processingDuplicate"));
      onClose();
      const taskListGroup = selectedList.reduce(
        (
          out: {
            taskLists: TaskList[];
            tasks: (Task & { task_list: string })[];
            subTasks: (Partial<TaskData> & { name: string; id: string })[];
          },
          item,
          index,
        ) => {
          // let hasTaskList = Boolean(
          //   out.taskLists.length &&
          //     out.taskLists.some((taskList) => taskList.id === item.taskListId),
          // );
          // const taskList = items.find(
          //   (taskListItem) => taskListItem.id === item.taskListId,
          // );
          // if (!hasTaskList) {
          //   const nOfTaskOfSelected = selectedList.filter(
          //     (selected) =>
          //       !item?.subTaskId && selected?.taskId === item.taskId,
          //   ).length;

          //   hasTaskList = taskList?.tasks.length === nOfTaskOfSelected;
          // }

          const hasTaskList = selectedList.some(
            (selected) =>
              !selected?.subTaskId &&
              !selected?.taskId &&
              selected?.taskListId === item.taskListId,
          );
          const taskList = items.find(
            (taskListItem) => taskListItem.id === item.taskListId,
          );

          if (hasTaskList) {
            // DM01 selected

            if (taskList) {
              const isExisted = out.taskLists.some(
                (outTaskList) => outTaskList.id === taskList.id,
              );
              if (!isExisted) {
                out.taskLists.push(taskList);
              }
            }
          } else {
            const hasTask = selectedList.some(
              (selected) =>
                !selected?.subTaskId && selected?.taskId === item.taskId,
            );

            if (hasTask) {
              // DM01-Task 01 selected
              const isExisted = out.tasks.some(
                (outTask) => outTask.id === item.taskId,
              );
              if (!isExisted) {
                const indexTask = (taskList?.tasks ?? []).findIndex(
                  (taskItem) => taskItem.id === item.taskId,
                );
                if (indexTask !== -1) {
                  out.tasks.push({
                    ...taskList?.tasks[indexTask],
                    task_list: item.taskListId as string,
                  } as Task & { task_list: string });
                }
              }
            } else if (item?.subTaskId) {
              const isExisted = out.subTasks.some(
                (subTask) => subTask.id === item.subTaskId,
              );
              if (!isExisted) {
                const indexTask = (taskList?.tasks ?? []).findIndex(
                  (taskItem) => taskItem.id === item.taskId,
                );
                const subTask = (
                  taskList?.tasks[indexTask].sub_tasks ?? []
                ).find((subTaskItem) => subTaskItem.id === item.subTaskId);
                if (subTask) {
                  out.subTasks.push({
                    id: item.subTaskId,
                    name: subTask?.name,
                    task_list: item.taskListId,
                    task: item.taskId,

                    description: subTask?.description,
                    start_date: subTask?.start_date,
                    end_date: subTask?.end_date,
                    owner: subTask?.owner?.id,
                    status: subTask?.status,
                    estimated_hours: subTask?.estimated_hours,
                  });
                }
              }
            }
          }
          return out;
        },
        {
          taskLists: [],
          tasks: [],
          subTasks: [],
        },
      );

      for (const taskList of taskListGroup.taskLists) {
        await onDuplicateTaskList(taskList);
      }

      for (const task of taskListGroup.tasks) {
        await onDuplicateTask(task);
      }

      const subTaskNames = taskListGroup.subTasks.map(
        (subTask) => subTask.name,
      );
      for (const subTask of taskListGroup.subTasks) {
        const { id, ...data } = subTask;
        await onCreateTask(
          {
            ...data,
            start_date: data?.start_date
              ? formatDate(data.start_date, DATE_FORMAT_FORM)
              : undefined,
            end_date: data?.end_date
              ? formatDate(data.end_date, DATE_FORMAT_FORM)
              : undefined,
            name: genName(subTaskNames, data.name),
          },
          subTask.task_list as string,
          subTask.task as string,
        );
      }
      onAddSnackbar(
        projectT("detailTasks.notification.duplicateSuccess"),
        "success",
      );
      onSetTType()();
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      setIsSubmitting(false);
      setMsg(undefined);
    }
  };

  const onDelete = async () => {
    try {
      setIsSubmitting(true);
      const data = selectedList.reduce(
        (
          out: {
            tasks: {
              [key: string]: DeleteTasksData;
            };
            subTasks: {
              [key: string]: DeleteSubTasksData;
            };
            taskLists: DeleteTaskListsData;
          },
          item,
        ) => {
          if (item?.subTaskId) {
            const taskId = item.taskId as string;
            if (out.subTasks?.[taskId]) {
              out.subTasks[taskId].sub_tasks.push(item.subTaskId);
            } else {
              out.subTasks[taskId] = {
                task_list: item.taskListId as string,
                task: taskId,
                sub_tasks: [item.subTaskId],
              };
            }
          } else if (item?.taskId) {
            const taskListId = item.taskListId as string;
            if (out.tasks?.[taskListId]) {
              out.tasks[taskListId].tasks.push(item.taskId);
            } else {
              out.tasks[taskListId] = {
                task_list: taskListId,
                tasks: [item.taskId],
              };
            }
          } else {
            out.taskLists.tasks_list.push(item.taskListId as string);
          }
          return out;
        },
        {
          tasks: {},
          subTasks: {},
          taskLists: { project: projectId as string, tasks_list: [] },
        },
      );
      const promises: Promise<boolean>[] = [];

      Object.values(data.subTasks).forEach((item) => {
        promises.push(onDeleteSubTasks(item));
      });
      Object.values(data.tasks).forEach((item) => {
        promises.push(onDeleteTasks(item));
      });

      if (data.taskLists.tasks_list.length) {
        promises.push(onDeleteTaskLists(data.taskLists));
      }

      await Promise.all(promises);
      onSetTType()();
      onAddSnackbar(
        projectT("detailTasks.notification.deleteTasksSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConvertToTask = async () => {
    const taskListId = props?.selectedList[0]?.taskListId;
    const taskId = props?.selectedList[0]?.taskId;
    const subTaskId = props?.selectedList[0]?.subTaskId;
    if (!taskListId || !taskId || !subTaskId) return;
    setIsSubmitting(true);
    try {
      await onConvertSubTaskToTask({
        task_list: taskListId,
        task: taskId,
        sub_task: subTaskId,
      });
      await onGetTaskList(taskListId);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <IconButton
        disabled={!selectedList.length}
        noPadding
        onClick={(e) => {
          if (Boolean(anchorEl)) {
            onClose();
          } else {
            onOpen(e);
          }
        }}
        {...rest}
      >
        <MoreDotIcon fontSize="medium" sx={{ color: "grey.300" }} />
      </IconButton>
      <Popper
        ref={ref}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "white",
            minWidth: 150,
            maxWidth: 250,
          },
          zIndex: 0,
        }}
        transition
        placement={"bottom-start"}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={350}>
            <Stack
              py={2}
              sx={{
                boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.2)",
                border: "1px solid",
                borderTopWidth: 0,
                borderColor: "grey.100",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <MenuList component={Box} sx={{ py: 0 }}>
                {taskListIds.length > 0 && (
                  <MenuItem
                    onClick={onSetTType(Action.ADD_SUB_TASK)}
                    component={ButtonBase}
                    sx={sxConfig.item}
                  >
                    <HierarchyIcon
                      sx={{ color: "grey.400" }}
                      fontSize="medium"
                    />
                    <Text ml={2} variant="body2" color="grey.400">
                      {projectT("taskDetail.addSubTasks")}
                    </Text>
                  </MenuItem>
                )}
                <MenuItem
                  onClick={onDuplicate}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <DuplicateIcon sx={{ color: "grey.400" }} fontSize="medium" />
                  <Text ml={2} variant="body2" color="grey.400">
                    {commonT("duplicate")}
                  </Text>
                </MenuItem>
                {taskListIds.length === 0 && (
                  <MenuItem
                    onClick={onConvertToTask}
                    component={ButtonBase}
                    sx={sxConfig.item}
                  >
                    <ConvertIcon sx={{ color: "grey.400" }} fontSize="medium" />
                    <Text ml={2} variant="body2" color="grey.400">
                      {projectT("taskDetail.convertToTask")}
                    </Text>
                  </MenuItem>
                )}
                {taskListIds.length === 0 && (
                  <MenuItem
                    onClick={onSetTType(Action.CHANGE_PARENT_TASK)}
                    component={ButtonBase}
                    sx={sxConfig.item}
                  >
                    <ChangeIcon sx={{ color: "grey.400" }} fontSize="medium" />
                    <Text ml={2} variant="body2" color="grey.400">
                      {projectT("taskDetail.changeParentTask")}
                    </Text>
                  </MenuItem>
                )}
                {taskListIds.length > 0 && (
                  <Tooltip
                    title={
                      taskListIds.length
                        ? ""
                        : projectT("detailTasks.noTasksToMove")
                    }
                  >
                    <Stack direction="row" alignItems="center">
                      <MenuItem
                        onClick={onSetTType(Action.MOVE)}
                        component={ButtonBase}
                        sx={sxConfig.item}
                        disabled={!taskListIds.length}
                      >
                        <MoveArrowIcon
                          sx={{ color: "grey.400" }}
                          fontSize="medium"
                        />
                        <Text ml={2} variant="body2" color="grey.400">
                          {commonT("move")}
                        </Text>
                      </MenuItem>
                    </Stack>
                  </Tooltip>
                )}

                <MenuItem
                  onClick={onSetTType(Action.DELETE)}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <TrashIcon color="error" fontSize="medium" />
                  <Text ml={2} variant="body2" color="error.main">
                    {commonT("delete")}
                  </Text>
                </MenuItem>
              </MenuList>
            </Stack>
          </Grow>
        )}
      </Popper>
      <Loading open={isSubmitting} message={msg} />
      {type === Action.MOVE && (
        <MoveTaskList
          open
          onClose={onSetTType()}
          taskIds={taskIds}
          oldTaskListIds={taskListIds}
          setIsSubmitting={setIsSubmitting}
          sx={{
            overflow: "hidden",
          }}
        />
      )}
      {type === Action.DELETE && (
        <ConfirmDialog
          open
          onClose={onSetTType()}
          title={projectT("detailTasks.confirmDeleteTasks.title")}
          content={projectT("detailTasks.confirmDeleteTasks.content")}
          onSubmit={onDelete}
        />
      )}
      {type === Action.ADD_SUB_TASK && (
        <AddSubTask
          open
          taskListId={props?.selectedList[0]?.taskListId}
          taskId={props?.selectedList[0]?.taskId}
          onClose={onSetTType()}
          title={projectT("taskDetail.addSubTasks")}
          content={projectT("taskDetail.addSubTasks")}
          setIsSubmitting={setIsSubmitting}
        />
      )}
      {type === Action.CHANGE_PARENT_TASK &&
        props?.selectedList[0]?.subTaskId != null && (
          <MoveOtherTask
            subId={props?.selectedList[0]?.subTaskId as string}
            taskListIdProps={props?.selectedList[0]?.taskListId}
            taskIdProps={props?.selectedList[0]?.taskId}
            open
            onClose={onSetTType()}
          />
        )}
    </>
  );
};

export default memo(MoreList);

const sxConfig = {
  item: {
    width: "100%",
    py: 1,
    px: 2,
  },
};
