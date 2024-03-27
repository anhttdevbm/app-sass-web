import { memo, useId, MouseEvent, useState } from "react";
import {
  AlertColor,
  Box,
  ButtonBase,
  ButtonBaseProps,
  MenuItem,
  MenuItemProps,
  MenuList,
  Popover,
  Stack,
  TableCellProps,
  popoverClasses,
} from "@mui/material";
import { BodyCell } from "components/Table";
import { IconButton, IconButtonProps, Text } from "components/shared";
import MoreSquareIcon from "icons/MoreSquareIcon";
import PencilIcon from "icons/PencilIcon";
import TrashIcon from "icons/TrashIcon";
import ConfirmDialog, { ConfirmDialogProps } from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";

type ActionOption = {
  icon: React.ReactNode;
  content: string;
  onClick?: ButtonBaseProps["onClick"];
};

type ActionsCellProps = {
  onEdit?: () => void;
  onDelete?: () => Promise<unknown> | void;
  options?: ActionOption[];
  hasPopup?: boolean;
  deleteProps?: Omit<ConfirmDialogProps, "open" | "onClose" | "onSubmit">;
  iconProps?: IconButtonProps;
} & Omit<TableCellProps, "children">;

const ActionsCell = (props: ActionsCellProps) => {
  const {
    options = [],
    onEdit,
    onDelete: onDeleteProps,
    hasPopup = true,
    deleteProps,
    iconProps = {},
    ...rest
  } = props;
  const { sx: sxIconProps, ...restIconProps } = iconProps;
  const { onAddSnackbar } = useSnackbar();
  const t = useTranslations(NS_COMMON);
  const { isDarkMode } = useTheme();

  const [isShow, onShow, onHide] = useToggle();
  const [isSubmitting, onSubmittingTrue, onSubmittingFalse] = useToggle(false);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();

  const onOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onEditClicked = () => {
    onEdit && onEdit();
    onClose();
  };
  const onDeleteClicked = () => {
    onDeleteProps && onDeleteProps();
    onClose();
  };

  const onShowDialogConfirm = () => {
    onShow();
    onClose();
  };
  const onCloseDialogDelete = () => {
    onClose();
    onHide();
  };

  const onDelete = async () => {
    if (!onDeleteProps) return;
    try {
      onSubmittingTrue();
      const response = await onDeleteProps();
      if (response) {
        onAddSnackbar("Delete successfully!", "success");
        onHide();
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, t), "error");
    } finally {
      onSubmittingFalse();
    }
  };

  if (!options.length && !onEdit && !onDeleteProps) {
    return <BodyCell align="left" fallback={null} {...rest}></BodyCell>;
  }

  return (
    <BodyCell align="left" {...rest}>
      <IconButton
        size="small"
        onClick={onOpen}
        sx={{
          backgroundColor: isDarkMode ? "grey.150" : "white",
          color: "grey.400",
          p: 1,
          '&:hover': {
            backgroundColor: 'unset',
            color: isDarkMode ? "black" : "grey.600",
          },
          ...sxIconProps,
        }}
        variant="contained"
        {...restIconProps}
      >
        <MoreSquareIcon sx={{ fontSize: 24 }} />
      </IconButton>
      <Popover
        id={popoverId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
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
            {options.map((option) => (
              <MenuItem
                key={option.content}
                component={ButtonBase}
                onClick={option?.onClick}
                sx={sxConfig.item}
              >
                {option.icon}
                <Text
                  ml={2}
                  variant="body2"
                  color="grey.400"
                  textTransform="capitalize"
                >
                  {option.content}
                </Text>
              </MenuItem>
            ))}

            {!!onEdit && (
              <MenuItem
                component={ButtonBase}
                onClick={onEditClicked}
                sx={sxConfig.item}
              >
                <PencilIcon sx={{ color: "grey.400" }} fontSize="medium" />
                <Text ml={2} variant="body2" color="grey.400">
                  {t("edit")}
                </Text>
              </MenuItem>
            )}
            {!!onDeleteProps && (
              <MenuItem
                component={ButtonBase}
                onClick={hasPopup ? onShowDialogConfirm : onDeleteClicked}
                sx={sxConfig.item}
              >
                <TrashIcon color="error" fontSize="medium" />
                <Text ml={2} variant="body2" color="grey.400">
                  {t("delete")}
                </Text>
              </MenuItem>
            )}
          </MenuList>
        </Stack>
      </Popover>
      <ConfirmDialog
        onSubmit={onDelete}
        open={isShow}
        onClose={onCloseDialogDelete}
        title={t("confirmDelete.title")}
        content={t("confirmDelete.content")}
        {...deleteProps}
      />
    </BodyCell>
  );
};

export default memo(ActionsCell);

const sxConfig = {
  item: {
    width: "100%",
    py: 1,
    px: 2,
  },
};
