import React, { Dispatch, SetStateAction, memo, useMemo, useRef } from "react";
import { Box, ButtonBase, MenuItem, MenuList, Stack } from "@mui/material";
import PopoverLayout from "./PopoverLayout";
import SortIcon from "icons/SortIcon";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useTranslations } from "next-intl";
import { Text } from "components/shared";

export enum Action {
  STATUS = 1,
  DUE_DATE,
  ASSIGNEE,
  TITLE,
  MANUAL,
}

type SortProps = {
  setAction: Dispatch<SetStateAction<Action | undefined>>;
};

const Sort = ({ setAction }: SortProps) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const options = useMemo(
    () => [
      { label: commonT("status"), value: Action.STATUS },
      {
        label: commonT("form.title.dueDate"),
        value: Action.DUE_DATE,
      },
      {
        label: projectT("detailTasks.assignee"),
        value: Action.ASSIGNEE,
      },
      {
        label: commonT("form.title.title"),
        value: Action.TITLE,
      },
      {
        label: projectT("taskDetail.manual"),
        value: Action.MANUAL,
      },
    ],
    [projectT, commonT],
  );

  const onAction = (action: Action) => {
    return () => {
      setAction(action);
      buttonRef?.current?.click();
    };
  };

  return (
    <>
      <PopoverLayout
        containerProps={{
          sx: { position: "absolute", top: -42, right: 0 },
        }}
        ref={buttonRef}
        label={<SortIcon />}
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
    </>
  );
};

export default memo(Sort);

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
