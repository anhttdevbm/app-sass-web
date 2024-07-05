import { memo, useRef } from "react";
import { Box, ButtonBase, MenuItem, MenuList } from "@mui/material";
import { NS_COMMON } from "constant/index";
import { IconButton, Text } from "components/shared";
import MoreSquareIcon from "icons/MoreSquareIcon";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import PopoverLayout from "./PopoverLayout";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import { getMessageErrorByAPI } from "utils/index";

type ActionsProps = {
  onDelete: () => Promise<boolean | undefined>;
};

const Actions = (props: ActionsProps) => {
  const { onDelete } = props;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const { onAddSnackbar } = useSnackbar();

  const commonT = useTranslations(NS_COMMON);

  const [isShow, onShow, onHide] = useToggle();

  const onSubmit = async () => {
    try {
      await onDelete();
      onHide();
      buttonRef?.current?.click();
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  return (
    <>
      <PopoverLayout
        ref={buttonRef}
        label={
          <IconButton>
            <MoreSquareIcon sx={{ fontSize: 20 }} />
          </IconButton>
        }
      >
        <MenuList component={Box} sx={{ pb: 0 }}>
          <MenuItem component={ButtonBase} onClick={onShow} sx={defaultSx.item}>
            <Text variant="body2">{commonT("delete")}</Text>
          </MenuItem>
        </MenuList>
      </PopoverLayout>
      <ConfirmDialog
        onSubmit={onSubmit}
        open={isShow}
        onClose={onHide}
        title={commonT("confirmDelete.title")}
        content={commonT("confirmDelete.content")}
      />
    </>
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
