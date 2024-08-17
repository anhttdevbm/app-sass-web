import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  ButtonBase,
  Grow,
  InputAdornment,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Popper,
  Stack,
  SvgIcon,
  SvgIconProps,
  TextField,
  popoverClasses,
  useTheme,
} from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import DialogLayout from "components/DialogLayout";
import Loading from "components/Loading";
import { IconButton, Text } from "components/shared";
import CheckBoxCustom from "components/shared/CheckBoxCustom";
import { DataAction } from "constant/enums";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_PROJECT } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import useToggle from "hooks/useToggle";
import AIGradientIcon from "icons/AIGradientIcon";
import DuplicateIcon from "icons/DuplicateIcon";
import MoreDotIcon from "icons/MoreDotIcon";
import MoveArrowIcon from "icons/MoveArrowIcon";
import PencilIcon from "icons/PencilIcon";
import PlusIcon from "icons/PlusIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import {
  Dispatch,
  HTMLAttributes,
  MouseEvent,
  SetStateAction,
  memo,
  useId,
  useMemo,
  useState,
} from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useSnackbar } from "store/app/selectors";
import { TaskListData } from "store/project/actions";
import { Task } from "store/project/reducer";
import { useTasksOfProject } from "store/project/selectors";
import { checkIsMobile, getMessageErrorByAPI } from "utils/index";
import Form from "../Form";
import MoveTaskList from "../MoveTaskList";
import TaskListForm from "../TaskListForm";
import { Selected, TaskFormData, genName } from "./helpers";
import TaskAiForm from "../TaskAiForm";

type DroppableTaskListProps = {
  id: string;
  count: number;
  name: string;
  checked: boolean;
  isDragging: boolean;
  onChange: () => void;
  setSelectedList: Dispatch<SetStateAction<Selected[]>>;
  index: number;
  showPopup?: boolean | true;
} & HTMLAttributes<HTMLDivElement>;

type MoreListProps = {
  id: string;
  name: string;
  setSelectedList: Dispatch<SetStateAction<Selected[]>>;
};

const DroppableTaskList = (props: DroppableTaskListProps) => {
  const {
    id,
    count,
    name,
    checked,
    onChange,
    setSelectedList,
    isDragging,
    index,
    ...rest
  } = props;
  const { isXlSmaller } = useBreakpoint();

  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);
  const { onCreateTask: onCreateTaskAction } = useTasksOfProject();

  const isMobile = useMemo(() => checkIsMobile(), []);

  const [isShow, , , onToggle] = useToggle(true);
  const [isShowCreate, onShowCreate, onHideCreate] = useToggle();
  const [isPreviewName, onShowPreviewName, onHidePreviewName] = useToggle();

  const onCreateTask = async (data: TaskFormData) => {
    return await onCreateTaskAction(data, id);
  };
  const { onAddSnackbar } = useSnackbar();

  const [taskName, setTaskName] = useState<string>("");

  const changeNameTask = (event) => {
    setTaskName(event.target.value);
  };

  const theme = useTheme();

  const onKeyDownTaskName = async (
    event: React.KeyboardEvent<HTMLDivElement>,
    taskListId: string,
  ) => {
    if (event.key !== "Enter") return;
    const nameTrimmed = taskName?.trim();

    if (!nameTrimmed) {
      onAddSnackbar(
        projectT("detailTasks.notification.taskNameIsRequired", {
          label: commonT("createNew"),
        }),
        "error",
      );
      return;
    }

    const newItem = await onCreateTask({
      task_list: taskListId,
      name: nameTrimmed,
      description: "",
      end_date: "",
      start_date: "",
    });
    if (newItem) {
      setTaskName("");
      onAddSnackbar(
        projectT("detailTasks.notification.taskSuccess", {
          label: commonT("createNew"),
        }),
        "success",
      );
    }
  };

  return (
    <>
      <Droppable droppableId={id} type="TASK_LIST">
        {(provided, taskListDropSnapshot) => {
          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              style={{
                border: isDragging ? "1px dashed" : undefined,
              }}
            >
              <Draggable draggableId={id} index={index}>
                {(dragProvided) => (
                  <div
                    ref={dragProvided.innerRef}
                    {...dragProvided.draggableProps}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      height={48}
                      pl={{ xs: 0, md: 2 }}
                      width="100%"
                      spacing={3}
                      borderTop={index !== 0 ? { md: "1px solid" } : undefined}
                      borderBottom={{ md: "1px solid" }}
                      borderColor={{ md: "grey.100" }}
                      bgcolor="#e8f2e8"
                      borderRadius="1rem 1rem 0 0"
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        overflow="hidden"
                      >
                        <CheckBoxCustom
                          size="small"
                          className="checkbox"
                          checked={checked}
                          onChange={onChange}
                        />
                        <IconButton
                          noPadding
                          sx={{
                            ml: { md: 1.5 },
                            transform: isShow ? undefined : "rotate(180deg)",
                          }}
                          onClick={onToggle}
                        >
                          <ExpandMore sx={{ color: "text.primary" }} />
                        </IconButton>
                        <Text
                          variant={isXlSmaller ? "h6" : "h5"}
                          color="text.primary"
                          onClick={onShowPreviewName}
                          noWrap
                          sx={{ cursor: "pointer" }}
                          {...dragProvided.dragHandleProps}
                        >
                          {name}
                        </Text>
                        <Text
                          mr={1}
                          ml={0.5}
                          variant="h5"
                          fontWeight={400}
                          color="text.primary"
                        >
                          {`(${count})`}
                        </Text>
                        <MoreList
                          id={id}
                          name={name}
                          setSelectedList={setSelectedList}
                        />
                      </Stack>
                    </Stack>
                    {isShow && props.children}
                    {provided.placeholder}
                    {/* Show form add new task */}
                    {isShow && (
                      <Stack
                        width="100%"
                        direction="row"
                        spacing={0}
                        alignItems="flex-end"
                        sx={{ ml: { xs: 2, md: 3.5 } }}
                      >
                        <PlusIcon sx={{ color: "dodgerblue", mr: 1, my: 1 }} />
                        <TextField
                          label={projectT("detailTasks.addNewTask")}
                          variant="standard"
                          value={taskName}
                          onChange={changeNameTask}
                          onKeyDown={(e) => onKeyDownTaskName(e, id)}
                          InputLabelProps={{ sx: { color: "dodgerblue" } }}
                          sx={{
                            "& .MuiInput-underline": {
                              ":before": {
                                borderBottomColor: "transparent",
                              },
                            },
                          }}
                        />
                      </Stack>
                    )}
                  </div>
                )}
              </Draggable>
            </div>
          );
        }}
      </Droppable>

      {isShowCreate && (
        <Form
          open={isShowCreate}
          onClose={onHideCreate}
          type={DataAction.CREATE}
          onSubmit={onCreateTask}
        />
      )}
      <DialogLayout open={isPreviewName} onClose={onHidePreviewName}>
        <Text variant="body2" fontWeight={600} px={3}>
          {name}
        </Text>
      </DialogLayout>
    </>
  );
};

export default memo(DroppableTaskList);

enum Action {
  RENAME = 1,
  DUPLICATE,
  MOVE,
  DELETE,
  ADD_NEW_TASK,
  AI_ADD_NEW_TASK,
}

export const MoreList = (props: MoreListProps) => {
  const { id, name, setSelectedList } = props;

  const {
    onUpdateTaskList: onUpdateTaskListAction,
    items,
    onCreateTaskList,
    onCreateTask,
    onDeleteTaskLists: onDeleteTaskListAction,
  } = useTasksOfProject();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);
  const params = useParams();
  const { onAddSnackbar } = useSnackbar();

  const projectId = useMemo(() => params?.id, [params?.id]) as string;

  const taskListNameList = useMemo(
    () => items.map((task) => task.name),
    [items],
  );
  const taskIds = useMemo(() => {
    const indexTaskList = items.findIndex((item) => item.id === id);
    if (indexTaskList === -1) return [];
    return items[indexTaskList].tasks.map((task) => task.id);
  }, [id, items]);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();

  const [type, setType] = useState<Action | undefined>();
  const [msg, setMsg] = useState<string | undefined>();

  const handleClickOutside = () => {
    onClose();
  };

  const ref = useOnClickOutside(handleClickOutside);

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
    };
  };

  const onCreateTaskHandle = async (data: TaskFormData) => {
    return await onCreateTask(data, id);
  };

  const onUpdateTaskList = async (values: Omit<TaskListData, "project">) => {
    return await onUpdateTaskListAction(id, values.name);
  };

  const onDeleteTaskList = async () => {
    try {
      const isSuccess = await onDeleteTaskListAction({
        project: projectId,
        tasks_list: [id],
      });
      if (isSuccess === true) {
        onAddSnackbar(
          projectT("detailTasks.notification.deleteTaskListSuccess"),
          "success",
        );
        onSetTType();
        setSelectedList((prevSelected) => {
          const newSelected = [...prevSelected];
          return newSelected.filter((item) => item.taskListId !== id);
        });
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const onDuplicateTaskList = async () => {
    try {
      if (!projectId) {
        throw AN_ERROR_TRY_AGAIN;
      }
      onClose();
      setMsg(projectT("detailTasks.processingDuplicate"));
      const newTaskList = await onCreateTaskList({
        name: genName(taskListNameList, name),
        project: projectId,
      });

      if (newTaskList?.id) {
        const tasksOfTaskList = items.find((item) => item.id === id);
        if (!tasksOfTaskList) {
          throw AN_ERROR_TRY_AGAIN;
        }
        const tasks: Task[] = [];

        for (const taskItem of tasksOfTaskList.tasks) {
          const newTask = (await onCreateTask(
            {
              name: taskItem.name,
              description: taskItem?.description,
              start_date: taskItem?.start_date,
              end_date: taskItem?.end_date,
              status: taskItem?.status,
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
                start_date: subTask?.start_date,
                end_date: subTask?.end_date,
                status: subTask?.status,
                owner: subTask?.owner?.id,
                estimated_hours: subTask?.estimated_hours,
              },
              newTaskList.id,
              tasks[i].id,
            )) as { task: Task };
          }
        }

        onAddSnackbar(
          projectT("detailTasks.notification.duplicateSuccess"),
          "success",
        );
        onSetTType();
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      setMsg(undefined);
    }
  };

  return (
    <>
      <IconButton
        noPadding
        onClick={(e) => {
          if (Boolean(anchorEl)) {
            onClose();
          } else {
            onOpen(e);
          }
        }}
      >
        <MoreDotIcon fontSize="small" sx={{ color: "grey.300" }} />
      </IconButton>

      <Popper
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "white",
            minWidth: 200,
            maxWidth: 250,
          },
          zIndex: 1,
        }}
        transition
        placement={"bottom-start"}
        ref={ref}
      >
        {({ TransitionProps }) => (
          <Grow {...TransitionProps} timeout={350}>
            <Stack
              py={2}
              sx={{
                boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.5)",
                border: "1px solid",
                borderTopWidth: 0,
                borderColor: "grey.100",
                borderRadius: 1,
                bgcolor: "background.paper",
              }}
            >
              <MenuList component={Box} sx={{ py: 0 }}>
                <MenuItem
                  onClick={onSetTType(Action.AI_ADD_NEW_TASK)}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <AIGradientIcon fontSize="medium" />
                  <Text ml={2} variant="body2" color="grey.400">
                    AI Assistant
                  </Text>
                </MenuItem>
                <MenuItem
                  onClick={onSetTType(Action.ADD_NEW_TASK)}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <PlusIcon sx={{ color: "grey.400" }} fontSize="medium" />
                  <Text ml={2} variant="body2" color="grey.400">
                    {projectT("detailTasks.addNewTask")}
                  </Text>
                </MenuItem>
                <MenuItem
                  onClick={onSetTType(Action.RENAME)}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <PencilIcon sx={{ color: "grey.400" }} fontSize="medium" />
                  <Text ml={2} variant="body2" color="grey.400">
                    {commonT("rename")}
                  </Text>
                </MenuItem>
                <MenuItem
                  onClick={onDuplicateTaskList}
                  component={ButtonBase}
                  sx={sxConfig.item}
                >
                  <DuplicateIcon sx={{ color: "grey.400" }} fontSize="medium" />
                  <Text ml={2} variant="body2" color="grey.400">
                    {commonT("duplicate")}
                  </Text>
                </MenuItem>
                {!!taskIds.length && (
                  <MenuItem
                    onClick={onSetTType(Action.MOVE)}
                    component={ButtonBase}
                    sx={sxConfig.item}
                  >
                    <MoveArrowIcon
                      sx={{ color: "grey.400" }}
                      // sx={{ color: "red" }}
                      fontSize="medium"
                    />
                    <Text ml={2} variant="body2" color="grey.400">
                      {commonT("move")}
                    </Text>
                  </MenuItem>
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
      <Loading open={!!msg} message={msg} />

      <Form
        open={type === Action.ADD_NEW_TASK}
        onClose={onSetTType()}
        type={DataAction.CREATE}
        onSubmit={onCreateTaskHandle}
      />
      {type === Action.AI_ADD_NEW_TASK && (
        <TaskAiForm
          open
          onClose={onSetTType()}
          taskListId={id}
          taskListName={name}
        />
      )}
      {type === Action.RENAME && (
        <TaskListForm
          open
          onClose={onSetTType()}
          type={DataAction.UPDATE}
          initialValues={{ name }}
          onSubmit={onUpdateTaskList}
        />
      )}
      {type === Action.MOVE && (
        <MoveTaskList
          oldTaskListIds={[id]}
          taskIds={{
            [id]: taskIds,
          }}
          open
          onClose={onSetTType()}
        />
      )}
      {type === Action.DELETE && (
        <ConfirmDialog
          open
          onClose={onSetTType()}
          title={projectT("detailTasks.confirmDeleteTaskList.title")}
          content={projectT("detailTasks.confirmDeleteTaskList.content", {
            name,
          })}
          onSubmit={onDeleteTaskList}
        />
      )}
    </>
  );
};

const sxConfig = {
  item: {
    width: "100%",
    py: 1,
    px: 2,
  },
};
