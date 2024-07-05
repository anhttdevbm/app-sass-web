import { memo, useMemo } from "react";
import { IconButton } from "components/shared";
import { useTaskDetail } from "store/project/selectors";
import { DataAction } from "constant/enums";
import useToggle from "hooks/useToggle";
import Form from "components/sn-project-detail/Tasks/Form";
import PencilIcon from "icons/PencilIcon";
import { TaskFormData } from "components/sn-project-detail/Tasks/components";
import { AN_ERROR_TRY_AGAIN } from "constant/index";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";
import useTheme from "hooks/useTheme";

const EditTask = () => {
  const [isShow, onShow, onHide] = useToggle();

  const {
    task,
    taskListId,
    taskId,
    subTaskId,
    onUpdateTask: onUpdateTaskAction,
  } = useTaskDetail();
  const { isDarkMode } = useTheme();

  const initValues = useMemo(
    () =>
      task
        ? {
            name: task.name,
            estimated_hours: task?.estimated_hours,
            owner: task?.owner?.id,
            start_date: task?.start_date,
            end_date: task?.end_date,
            description: task?.description,
          }
        : undefined,
    [task],
  );

  const onUpdateTask = async (values: TaskFormData) => {
    try {
      if (!taskListId || !taskId) {
        throw AN_ERROR_TRY_AGAIN;
      }
      return await onUpdateTaskAction(values, taskListId, taskId, subTaskId);
    } catch (error) {
      throw error;
    }
  };

  if (!taskListId || !task) return null;

  return (
    <>
      <IconButton
        onClick={onShow}
        variant="contained"
        size="small"
        sx={{
          backgroundColor: isDarkMode ? "grey.50" : "primary.light",
          color: "text.primary",
          p: 1,
          "&:hover svg": {
            color: "common.white",
          },
        }}
      >
        <PencilUnderlineIcon sx={{ fontSize: 16 }} />
      </IconButton>

      {isShow && (
        <Form
          open
          onClose={onHide}
          type={DataAction.UPDATE}
          initialValues={initValues}
          onSubmit={onUpdateTask}
        />
      )}
    </>
  );
};

export default memo(EditTask);
