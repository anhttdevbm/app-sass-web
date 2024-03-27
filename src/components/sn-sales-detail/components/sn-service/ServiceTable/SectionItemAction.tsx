import {
  IconButton,
  MenuList,
  Box,
  MenuItem,
  ButtonBase,
  Stack,
} from "@mui/material";
import PopoverLayout from "components/sn-project-detail/Tasks/Detail/components/SubTasksOfTask/PopoverLayout";
import { NS_COMMON, NS_SALES } from "constant/index";
import MoreSquareIcon from "icons/MoreSquareIcon";
import { useTranslations } from "next-intl";
import React, { useCallback, useContext, useMemo, useRef } from "react";
import { Action } from "../../TodoList/SubItem";
import { Text } from "components/shared";
import MoreDotIcon from "icons/MoreDotIcon";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import { EditContext } from "../context/EditContext";
import { useSaleDetail, useSalesService } from "store/sales/selectors";
import { ServiceColumn } from "components/sn-sales-detail/hooks/useGetHeaderColumn";

type ActionsProps = {
  sectionId: string;
  sectionIndex: number;
  onChangeAction: (action: Action) => void;
};

const SectionItemAction = (props: ActionsProps) => {
  const { sectionId, onChangeAction, sectionIndex } = props;
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);
  const [isDelete, onOpen, onClose] = useToggle();
  const { isEdit } = useContext(EditContext);
  const { sectionColumns } = useSalesService();

  const checkIsShowText = (col: ServiceColumn) => {
    const isShow = sectionColumns[sectionIndex]?.columns.includes(col);
    return isShow ? commonT("hide") : commonT("show");
  };

  const options = useMemo(() => {
    return [
      {
        label: salesT("detail.service.showDiscount", {
          isShow: checkIsShowText(ServiceColumn.DISCOUNT),
        }),
        value: Action.SHOW_DISCOUNT,
      },
      {
        label: salesT("detail.service.showMarkup", {
          isShow: checkIsShowText(ServiceColumn.MARK_UP),
        }),
        value: Action.SHOW_MARKUP,
      },
      {
        label: salesT("detail.service.showFixedPrice", {
          isShow: checkIsShowText(ServiceColumn.PRICE),
        }),
        value: Action.SHOW_FIXED_PRICE,
      },
      {
        label: salesT("detail.service.showEstimate", {
          isShow: checkIsShowText(ServiceColumn.ESTIMATE),
        }),
        value: Action.SHOW_ESTIMATE,
      },
      {
        label: salesT("detail.service.ShowDescription", {
          isShow: checkIsShowText(ServiceColumn.DESCRIPTION),
        }),
        value: Action.SHOW_DESCRIPTION,
      },
      {
        label: commonT("delete", {
          isShow: checkIsShowText(ServiceColumn.DESCRIPTION),
        }),
        value: Action.SECTION_DELETE,
        color: "error.main",
        onClick: onOpen,
      },
    ];
  }, [commonT, salesT, sectionColumns]);

  const onAction = (action: Action) => {
    onChangeAction(action);
    buttonRef?.current?.click();
  };

  return (
    <PopoverLayout
      ref={buttonRef}
      label={
        <IconButton>
          <MoreDotIcon
            sx={{
              fontSize: 20,
            }}
          />
        </IconButton>
      }
    >
      <MenuList component={Box} sx={{ pb: 0 }}>
        {options.map((option) => (
          <MenuItem
            component={ButtonBase}
            onClick={() =>
              option.value === Action.SECTION_DELETE
                ? onOpen()
                : onAction(option.value)
            }
            sx={defaultSx.item}
            key={option.value}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Text variant="body2" color={option.color}>
                {option.label}
              </Text>
            </Stack>
          </MenuItem>
        ))}
      </MenuList>
      <ConfirmDialog
        onSubmit={() => onAction(Action.SECTION_DELETE)}
        open={isDelete}
        onClose={onClose}
        title={commonT("confirmDelete.title")}
        content={commonT("confirmDelete.content")}
      />
    </PopoverLayout>
  );
};

export default SectionItemAction;

const defaultSx = {
  item: {
    fontSize: 14,
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
