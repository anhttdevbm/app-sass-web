import { memo, useMemo, useRef } from "react";
import { Box, ButtonBase, MenuItem, MenuList, Stack } from "@mui/material";
import { Status } from "constant/enums";
import PopoverLayout from "./PopoverLayout";
import {
  AN_ERROR_TRY_AGAIN,
  COLOR_STATUS,
  NS_COMMON,
  STATUS_OPTIONS,
} from "constant/index";
import { useTranslations } from "next-intl";
import { Text } from "components/shared";
import { useSnackbar } from "store/app/selectors";
import { useTaskDetail } from "store/project/selectors";
import { getMessageErrorByAPI } from "utils/index";

type StatusTaskProps = {
  status: Status;
  subId: string;
};

const StatusTask = (props: StatusTaskProps) => {
  const { status, subId } = props;
  const { taskListId, taskId, onUpdateTask } = useTaskDetail();
  const commonT = useTranslations(NS_COMMON);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { onAddSnackbar } = useSnackbar();

  const options = useMemo(
    () =>
      STATUS_OPTIONS.map((item) => ({ ...item, label: commonT(item.label) })),
    [commonT],
  );

  const onChangeStatus = (newStatus: Status) => {
    return async () => {
      try {
        if (!taskListId || !taskId) {
          throw AN_ERROR_TRY_AGAIN;
        }
        await onUpdateTask({ status: newStatus }, taskListId, taskId, subId);
        buttonRef?.current?.click();
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    };
  };
  return (
    <PopoverLayout
      ref={buttonRef}
      label={
        <Box
          width={16}
          height={16}
          bgcolor={
            COLOR_STATUS[status] ? `${COLOR_STATUS[status]}.main` : "info.main"
          }
        />
      }
    >
      <MenuList component={Box} sx={{ pb: 0 }}>
        {options.map((option) => (
          <MenuItem
            component={ButtonBase}
            onClick={onChangeStatus(option.value as Status)}
            sx={defaultSx.item}
            key={option.value}
          >
            <Stack direction="row" alignItems="center" spacing={1} width="100%">
              <Box
                width={16}
                height={16}
                bgcolor={`${COLOR_STATUS[option.value]}.main`}
              />
              <Text variant="body2">{option.label}</Text>
            </Stack>
          </MenuItem>
        ))}
      </MenuList>
    </PopoverLayout>
  );
};

export default memo(StatusTask);

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
