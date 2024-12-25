import {
  Box,
  ButtonBase,
  IconButton,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import { Text } from "components/shared";
import PopoverLayout from "components/sn-project-detail/Tasks/Detail/components/SubTasksOfTask/PopoverLayout";
import { NS_COMMON, NS_SALES } from "constant/index";
import CopyIcon from "icons/CopyIcon";
import MoreSquareIcon from "icons/MoreSquareIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { useMemo, useRef } from "react";

type ActionsProps = {
  serviceId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onChangeAction: (action: Action, data?: any) => void;
  index: number;
};

export enum Action {
  RENAME = 1,
  DELETE,
  SECTION_DELETE,
  DUPLICATE,
  SHOW_DISCOUNT,
  SHOW_MARKUP,
  SHOW_FIXED_PRICE,
  SHOW_ESTIMATE,
  SHOW_DESCRIPTION,
}

const ServiceItemAction = (props: ActionsProps) => {
  const { serviceId, onChangeAction, index } = props;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);

  const options = useMemo(() => {
    return [
      {
        label: salesT("detail.service.duplicate"),
        value: Action.DUPLICATE,
        icon: <CopyIcon />,
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
    return () => onChangeAction(action, { index, serviceId });
  };

  return (
    <>
      <PopoverLayout
        ref={buttonRef}
        label={
          <IconButton>
            <MoreSquareIcon sx={{ fontSize: 24 }} />
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
      {/* <ConfirmDialog
        onSubmit={onDelete}
        open={isDelete}
        onClose={closeConfirm}
        title={commonT("confirmDelete.title")}
        content={commonT("confirmDelete.content")}
      /> */}
    </>
  );
};

export default ServiceItemAction;

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
      backgroundColor: "primary.main",
      "& svg": {
        color: "common.white",
      },
    },
  },
};
