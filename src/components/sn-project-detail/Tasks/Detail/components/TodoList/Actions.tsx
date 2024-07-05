import { Dispatch, memo, useMemo, useRef } from "react";
import { Box, ButtonBase, MenuItem, MenuList, Stack } from "@mui/material";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { IconButton, Text } from "components/shared";
import MoreSquareIcon from "icons/MoreSquareIcon";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import { useTaskDetail } from "store/project/selectors";
import PopoverLayout from "./PopoverLayout";

type ActionsProps = {
  todoId: string;
  onChangeAction: (action: Action) => void;
};

export enum Action {
  RENAME = 1,
  CONVERT_TO_TASK,
  CONVERT_TO_SUB_TASK,
  DELETE,
}

const Actions = (props: ActionsProps) => {
  const { todoId, onChangeAction } = props;
  const { subTaskId, taskId, onUpdateTask } = useTaskDetail();
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { onAddSnackbar } = useSnackbar();

  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const options = useMemo(() => {
    if (subTaskId) {
      return [
        {
          label: projectT("taskDetail.convertToTask"),
          value: Action.CONVERT_TO_TASK,
        },
        { label: commonT("delete"), value: Action.DELETE },
      ];
    }
    return [
      {
        label: projectT("taskDetail.convertToTask"),
        value: Action.CONVERT_TO_TASK,
      },
      {
        label: projectT("taskDetail.convertToSubTask"),
        value: Action.CONVERT_TO_SUB_TASK,
      },
      { label: commonT("delete"), value: Action.DELETE },
    ];
  }, [projectT, commonT, subTaskId]);

  const onAction = (action: Action) => {
    return () => {
      onChangeAction(action);
      buttonRef?.current?.click();
    };
  };

  return (
    <PopoverLayout
      ref={buttonRef}
      label={
        <IconButton>
          <MoreSquareIcon sx={{ fontSize: 20 }} />
        </IconButton>
      }
    >
      <MenuList component={Box} sx={{ pb: 0 }}>
        {options.map((option) => (
          <MenuItem
            component={ButtonBase}
            onClick={onAction(option.value)}
            sx={defaultSx.item}
            key={option.value}
          >
            <Text variant="body2">{option.label}</Text>
          </MenuItem>
        ))}
      </MenuList>
    </PopoverLayout>
  );
};

export default memo(Actions);

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
