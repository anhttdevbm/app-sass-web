import {
  Box,
  ButtonBase,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import { Text } from "components/shared";
import PopoverLayout from "components/sn-project-detail/Tasks/Detail/components/SubTasksOfTask/PopoverLayout";
import { NS_COMMON, NS_SALES } from "constant/index";
import useToggle from "hooks/useToggle";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";
// import { Action } from "../../SubItem";
import { Action } from "components/sn-sales-detail/components/TodoList/SubItem";
import DuplicateIcon from "icons/DuplicateIcon";
import MoreDotIcon from "icons/MoreDotIcon";

type ActionsProps = {
  service_id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeAction: (action: Action, data?: any) => void;
  onClose?: () => void;
  index: number;
};

const ServiceItemAction = (props: ActionsProps) => {
  const { service_id, onChangeAction, index, onClose } = props;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);
  const [isDelete, openConfirm, closeConfirm] = useToggle();
  const defaultSx = {
    item: {
      fontSize: 16,
      color: "text.primary",
      lineHeight: "22px",
      width: "100%",
      "& > img": {
        mr: 1,
      },
      "&:hover": {
        backgroundColor: "#D9F0FD",
        // "& svg": {
        //   color: "common.white",
        // },
      },
    },
  };
  const options = useMemo(() => {
    return [
      {
        label: salesT("detail.service.duplicate"),
        value: Action.DUPLICATE,
        icon: <DuplicateIcon />,
        color: "",
      },
      {
        label: commonT("delete"),
        value: Action.DELETE,
        icon: <TrashIcon color="error" />,
        color: "error.main",
      },
    ];
  }, [commonT, salesT]);

  const onAction = (action: Action) => {
    if (action === Action.DELETE) {
      return openConfirm;
    }
    return () => {
      onChangeAction(action, service_id);
      buttonRef?.current?.click();
    };
  };

  const onDelete = () => {
    onChangeAction(Action.DELETE, index);
    closeConfirm();
  };
  return (
    <>
      <PopoverLayout
        ref={buttonRef}
        onClose={onClose}
        label={
          <IconButton
            sx={{
              p: "4px",
            }}
          >
            <MoreDotIcon sx={{ fontSize: 22 }} />
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
              <Stack direction="row" spacing={1} alignItems="center">
                {option.icon}
                <Text variant="body2" color={option.color}>
                  {option.label}
                </Text>
              </Stack>
            </MenuItem>
          ))}
        </MenuList>
      </PopoverLayout>
      <ConfirmDialog
        onSubmit={onDelete}
        open={isDelete}
        onClose={closeConfirm}
        title={commonT("confirmDelete.title")}
        content={commonT("confirmDelete.content")}
      />
    </>
  );
};

export default ServiceItemAction;
