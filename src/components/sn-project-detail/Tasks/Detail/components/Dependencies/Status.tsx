import { memo, useMemo, useRef } from "react";
import { Box, ButtonBase, MenuItem, MenuList, Stack } from "@mui/material";
import PopoverLayout from "./PopoverLayout";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";
import { Text } from "components/shared";
import { useSnackbar } from "store/app/selectors";
import { useTaskDetail } from "store/project/selectors";
import { getMessageErrorByAPI } from "utils/index";
import BlockingIcon from "icons/BlockingIcon";
import PauseCircleIcon from "icons/PauseCircleIcon";
import AttachCircleIcon from "icons/AttachCircleIcon";
import { DependencyStatus } from "store/project/actions";

type StatusDependencyProps = {
  status: DependencyStatus;
  dependencyId: string;
};

const StatusDependency = (props: StatusDependencyProps) => {
  const { status, dependencyId } = props;

  const { taskListId, taskId, onUpdateTask, task, subTaskId } = useTaskDetail();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { onAddSnackbar } = useSnackbar();

  const options = useMemo(
    () => OPTIONS.map((item) => ({ ...item, label: projectT(item.label) })),
    [projectT],
  );

  const iconSelected = useMemo(() => {
    switch (status) {
      case DependencyStatus.BLOCKING:
        return <BlockingIcon color="error" />;
      case DependencyStatus.WAITING_ON:
        return <PauseCircleIcon color="warning" />;
      case DependencyStatus.LINKED_TO:
        return <AttachCircleIcon sx={{ color: "grey.400" }} />;
      default:
        return null;
    }
  }, [status]);

  const onChangeStatus = (newStatus: DependencyStatus) => {
    return async () => {
      if (!taskListId || !taskId) return;

      try {
        const newDependencies = [...(task?.dependencies ?? [])];

        const indexUpdated = newDependencies.findIndex(
          (depen) => depen.id === dependencyId,
        );
        if (indexUpdated !== -1) {
          newDependencies[indexUpdated] = {
            ...newDependencies[indexUpdated],
            status: newStatus,
          };
        }
        const dependencies = newDependencies.map((item) => ({
          task_current: taskId,
          task_list_current: taskListId,
          task_list_update: item.id_task_list,
          task_update: item.id_task,
          status: item.status,

          sub_task_current: subTaskId,
          [subTaskId ? "sub_task_update" : "sub_task"]: item?.sub_task,
        }));
        await onUpdateTask({ dependencies }, taskListId, taskId, subTaskId);
        buttonRef?.current?.click();
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    };
  };
  return (
    <PopoverLayout ref={buttonRef} label={iconSelected}>
      <MenuList component={Box} sx={{ pb: 0 }}>
        {options.map((option) => (
          <MenuItem
            component={ButtonBase}
            onClick={onChangeStatus(option.value)}
            sx={defaultSx.item}
            key={option.value}
          >
            <Stack direction="row" alignItems="center" spacing={1} width="100%">
              {option.icon}
              <Text variant="body2">{option.label}</Text>
            </Stack>
          </MenuItem>
        ))}
      </MenuList>
    </PopoverLayout>
  );
};

export default memo(StatusDependency);

const OPTIONS = [
  {
    label: "taskDetail.waitingOn",
    value: DependencyStatus.WAITING_ON,
    icon: <PauseCircleIcon color="warning" />,
  },
  {
    label: "taskDetail.linkedTo",
    value: DependencyStatus.LINKED_TO,
    icon: <AttachCircleIcon sx={{ color: "grey.400" }} />,
  },
  {
    label: "taskDetail.blocking",
    value: DependencyStatus.BLOCKING,
    icon: <BlockingIcon color="error" />,
  },
];

const defaultSx = {
  item: {
    fontSize: 14,
    color: "text.primary",
    lineHeight: "22px",
    backgroundColor: "grey.50",
    width: "100%",
    "& > img": {
      mr: 1,
    },
    "&:hover": {
      backgroundColor: "primary.main",
      "& svg": {
        color: "common.white",
      },
    },
  },
};
