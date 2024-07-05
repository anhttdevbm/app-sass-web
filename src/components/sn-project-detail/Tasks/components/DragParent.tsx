import {
  Box,
  ButtonBase,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  popoverClasses,
} from "@mui/material";
import { Button, Checkbox, IconButton, Text } from "components/shared";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_PROJECT } from "constant/index";
import useToggle from "hooks/useToggle";
import CaretIcon from "icons/CaretIcon";
import DuplicateIcon from "icons/DuplicateIcon";
import MoreDotIcon from "icons/MoreDotIcon";
import MoveArrowIcon from "icons/MoveArrowIcon";
import PencilIcon from "icons/PencilIcon";
import PlusIcon from "icons/PlusIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import {
  Dispatch,
  HTMLAttributes,
  memo,
  MouseEvent,
  SetStateAction,
  useId,
  useMemo,
  useState,
} from "react";
import { Draggable } from "react-beautiful-dnd";
import Form from "../Form";
import { DataAction } from "constant/enums";
import { TaskListData } from "store/project/actions";
import { useTasksOfProject } from "store/project/selectors";
import TaskListForm from "../TaskListForm";
import MoveTaskList from "../MoveTaskList";
import { Selected, TaskFormData, genName } from "./helpers";
import { useParams } from "next/navigation";
import { Task } from "store/project/reducer";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import ConfirmDialog from "components/ConfirmDialog";
import DialogLayout from "components/DialogLayout";
import Loading from "components/Loading";

type DragParentProps = {
  id: string;
  index: number;
  count: number;
  name: string;
  checked: boolean;
  onChange: () => void;
  setSelectedList: Dispatch<SetStateAction<Selected[]>>;
} & HTMLAttributes<HTMLDivElement>;

type MoreListProps = {
  id: string;
  name: string;
  setSelectedList: Dispatch<SetStateAction<Selected[]>>;
};

const DragParent = (props: DragParentProps) => {
  const {
    id,
    index,
    count,
    name,
    checked,
    onChange,
    setSelectedList,
    ...rest
  } = props;
  const projectT = useTranslations(NS_PROJECT);
  const { onCreateTask: onCreateTaskAction } = useTasksOfProject();

  const [isShow, , , onToggle] = useToggle(true);
  const [isShowCreate, onShowCreate, onHideCreate] = useToggle();
  const [isPreviewName, onShowPreviewName, onHidePreviewName] = useToggle();

  const onCreateTask = async (data: TaskFormData) => {
    return await onCreateTaskAction(data, id);
  };

  return (
    <>
      <Draggable draggableId={id} index={index} isDragDisabled>
        {(provided) => {
          return (
            <>
              <div ref={provided.innerRef} {...rest}>
                <Stack
                  direction="row"
                  alignItems="center"
                  height={48}
                  pl={{ xs: 1, md: 2 }}
                  width="100%"
                  justifyContent="space-between"
                  borderBottom={{ md: "1px solid" }}
                  borderColor={{ md: "grey.100" }}
                >
                  <Stack direction="row" alignItems="center" overflow="hidden">
                    <Checkbox checked={checked} onChange={onChange} />
                    <IconButton
                      noPadding
                      sx={{
                        ml: { md: 6 },
                        transform: isShow ? undefined : "rotate(180deg)",
                      }}
                      onClick={onToggle}
                    >
                      <CaretIcon sx={{ color: "grey.300" }} />
                    </IconButton>
                    <Text
                      variant="h5"
                      color="grey.300"
                      onClick={onShowPreviewName}
                      noWrap
                      sx={{ cursor: "pointer" }}
                    >
                      {name}
                    </Text>
                    <Text
                      mr={1}
                      ml={0.5}
                      variant="h5"
                      fontWeight={400}
                      color="grey.300"
                    >
                      {`(${count})`}
                    </Text>
                    <MoreList
                      id={id}
                      name={name}
                      setSelectedList={setSelectedList}
                    />
                  </Stack>
                  <Button
                    onClick={onShowCreate}
                    startIcon={<PlusIcon />}
                    variant="text"
                    size="small"
                    color="secondary"
                    sx={{ mr: { xs: 1.5, md: 4 } }}
                  >
                    {projectT("detailTasks.addNewTask")}
                  </Button>
                </Stack>

                {isShow && props.children}
              </div>
              {isShowCreate && (
                <Form
                  open={isShowCreate}
                  onClose={onHideCreate}
                  type={DataAction.CREATE}
                  onSubmit={onCreateTask}
                />
              )}
            </>
          );
        }}
      </Draggable>

      <DialogLayout open={isPreviewName} onClose={onHidePreviewName}>
        <Text variant="body2" fontWeight={600} px={3}>
          {name}
        </Text>
      </DialogLayout>
    </>
  );
};

export default memo(DragParent);

enum Action {
  RENAME = 1,
  DUPLICATE,
  MOVE,
  DELETE,
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
      <IconButton noPadding onClick={onOpen}>
        <MoreDotIcon fontSize="medium" sx={{ color: "grey.300" }} />
      </IconButton>
      <Popover
        id={popoverId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 150,
            maxWidth: 150,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              mt: 0.5,
            },
          },
        }}
      >
        <Stack
          py={2}
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderTopWidth: 0,
            borderColor: "grey.100",
            borderRadius: 1,
          }}
        >
          <MenuList component={Box} sx={{ py: 0 }}>
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
                <MoveArrowIcon sx={{ color: "grey.400" }} fontSize="medium" />
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
      </Popover>
      <Loading open={!!msg} message={msg} />

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
