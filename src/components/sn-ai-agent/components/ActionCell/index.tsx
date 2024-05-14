import {
  Box,
  ButtonBase,
  ButtonBaseProps,
  MenuItem,
  MenuList,
  Popover,
  Stack,
  TableCellProps,
  popoverClasses,
} from "@mui/material";
import { styled } from "@mui/system";
import { ConfirmDialogProps } from "components/ConfirmDialog";
import { BodyCell } from "components/Table";
import { IconButton, IconButtonProps, Text } from "components/shared";
import { AN_ERROR_TRY_AGAIN, NS_COMMON } from "constant/index";
import useTheme from "hooks/useTheme";
import useToggle from "hooks/useToggle";
import AIGradientIcon from "icons/AIGradientIcon";
import MoreSquareIcon from "icons/MoreSquareIcon";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { MouseEvent, memo, useId, useState } from "react";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { Dialog } from "../Dialog";

export const PRIMARY_GRADIENT_COLOR =
  "linear-gradient(89.64deg, #0575E6 5.8%, #38E27B 96.38%)";

type ActionOption = {
  icon: React.ReactNode;
  content: string;
  onClick?: ButtonBaseProps["onClick"];
};

type ActionsCellProps = {
  onEdit?: () => void;
  onDelete?: () => Promise<unknown> | void;
  onChat?: () => void;
  options?: ActionOption[];
  hasPopup?: boolean;
  deleteProps?: Omit<ConfirmDialogProps, "open" | "onClose" | "onSubmit">;
  iconProps?: IconButtonProps;
} & Omit<TableCellProps, "children">;

const ActionsCell = (props: ActionsCellProps) => {
  const {
    options = [],
    onEdit,
    onChat,
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

  const onChatClicked = () => {
    onChat && onChat();
    onClose();
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

  const onOptionClick = (event, option) => {
    option?.onClick();
    onClose();
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
          "&:hover": {
            backgroundColor: "unset",
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
                onClick={(event) => onOptionClick(event, option)}
                sx={sxConfig.item}
              >
                {option.icon}
                <Text
                  ml={2}
                  variant="body2"
                  color={"grey.400"}
                  textTransform="capitalize"
                >
                  {option.content}
                </Text>
              </MenuItem>
            ))}

            {!!onChat && (
              <MenuItem
                component={ButtonBase}
                onClick={onChatClicked}
                sx={sxConfig.item}
              >
                <AIGradientIcon fontSize="medium" />
                <GradientText>{t("chat")}</GradientText>
              </MenuItem>
            )}

            {!!onEdit && (
              <MenuItem
                component={ButtonBase}
                onClick={onEditClicked}
                sx={sxConfig.item}
              >
                <PencilUnderlineIcon
                  sx={{ color: "grey.400" }}
                  fontSize="medium"
                />
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
                <Text ml={2} variant="body2" color="error.main">
                  {t("delete")}
                </Text>
              </MenuItem>
            )}
          </MenuList>
        </Stack>
      </Popover>
      <Dialog
        open={isShow}
        onClose={onCloseDialogDelete}
        title={t("confirmDelete.title")}
        content={t("confirmDelete.content")}
        onSubmit={onDelete}
        headerProps={{
          justifyContent: "center",
        }}
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

const GradientText = styled("span")`
  margin-left: 16px;
  background: ${PRIMARY_GRADIENT_COLOR};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;
