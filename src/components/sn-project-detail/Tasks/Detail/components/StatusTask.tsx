import { memo, useEffect, useState } from "react";
import { Button, Text } from "components/shared";
import { useTaskDetail } from "store/project/selectors";
import FormLayout from "components/FormLayout";
import useToggle from "hooks/useToggle";
import { Radio, Stack } from "@mui/material";
import CircleTickIcon from "icons/CircleTickIcon";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { useTranslations } from "next-intl";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_PROJECT } from "constant/index";
import { Status } from "constant/enums";
import { TASK_STATUS_OPTIONS } from "../../components";

const StatusTask = () => {
  const { task, taskListId, onUpdateTask, taskId, subTaskId } = useTaskDetail();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const [isShow, onShow, onHide] = useToggle();
  const [status, setStatus] = useState<Status | undefined>();

  const onChange = (newStatus: Status) => {
    return () => {
      setStatus(newStatus);
    };
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!status || !taskListId || !taskId) {
        throw AN_ERROR_TRY_AGAIN;
      }
      const newData = await onUpdateTask(
        { status },
        taskListId,
        taskId,
        subTaskId,
      );
      if (newData) {
        onAddSnackbar(
          projectT("detail.notification.changeStatusSuccess"),
          "success",
        );
        onHide();
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  useEffect(() => {
    setStatus(task?.status);
  }, [isShow, task?.status]);

  return (
    <>
      <Button
        onClick={onShow}
        variant="secondary"
        size="small"
        sx={{ minHeight: "32px!important", py: "7px!important" }}
      >
        {projectT("detail.changeStatus")}
      </Button>

      <FormLayout
        open={isShow}
        onClose={onHide}
        label={projectT("taskDetail.changeStatusTask")}
        onSubmit={onSubmit}
        disabled={!status}
        sx={{
          maxWidth: 320,
          minWidth: { xs: 320, sm: 400 },
          minHeight: "fit-content",
          zIndex: 1201,
        }}
        contentProps={{
          sx: {
            "&>div": {
              alignItems: "center",
            },
          },
        }}
        zIndex={1200}
      >
        <Stack>
          {TASK_STATUS_OPTIONS.map((item) => (
            <Stack key={item.value} direction="row" alignItems="center">
              <Radio
                checked={item.value === status}
                onClick={onChange(item.value)}
                checkedIcon={<CircleTickIcon color="success" />}
                sx={{ color: "grey.300" }}
              />
              <Text variant="body2">{commonT(item.label)}</Text>
            </Stack>
          ))}
        </Stack>
      </FormLayout>
    </>
  );
};

export default memo(StatusTask);
