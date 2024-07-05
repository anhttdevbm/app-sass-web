import {
  debounce,
  Stack,
  MenuList,
  Box,
  MenuItem,
  ButtonBase,
  CircularProgress,
  Checkbox,
} from "@mui/material";
import { Search } from "components/Filters";
import PopoverLayout from "components/sn-project-detail/Tasks/Detail/components/SubTasksOfTask/PopoverLayout";
import {
  NS_COMMON,
  NS_PROJECT,
  AN_ERROR_TRY_AGAIN,
  NS_SALES,
} from "constant/index";
import ChevronIcon from "icons/ChevronIcon";
import { useTranslations } from "next-intl";
import React, { memo, useMemo, useRef, useState } from "react";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import Avatar from "components/Avatar";
import { IconButton, Text } from "components/shared";
import useGetEmployeeOptions, {
  useGetMemberOptions,
} from "components/sn-sales/hooks/useGetEmployeeOptions";
import AvatarGroup, { AvatarProps } from "components/shared/AvatarGroup";
import PlusIcon from "icons/PlusIcon";
import { useFormContext } from "react-hook-form";
import { Option, User } from "constant/types";
import CircleCloseIcon from "icons/CircleCloseIcon";
import useTheme from "hooks/useTheme";

const WRONG_NUMBER = 10;

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
    "&.MuiButtonBase-root": {
      pr: "0.25rem",
    },
  },
};

type AssignProps = {
  value: string;
  name: string;
  onAssign: (name: string, data: User) => void;
};

const DisplayItem = ({
  user,
  onRemoveAssign,
}: {
  user: Option;
  onRemoveAssign: (id: string) => void;
}) => {
  const { isDarkMode } = useTheme();

  const { label } = (user ?? {}) as Option;

  return (
    <Stack
      direction="row"
      py={0.25}
      px={0.5}
      borderRadius={5}
      bgcolor={isDarkMode ? "background.default" : "primary.light"}
      spacing={1}
      display="inline-flex"
      width="fit-content"
    >
      <Text variant="body2" maxWidth={150} noWrap tooltip={label}>
        {label}
      </Text>
      <IconButton
        noPadding
        sx={{ position: "relative", zIndex: 0 }}
        onClick={() => onRemoveAssign(user.value as string)}
      >
        <CircleCloseIcon sx={{ color: "grey.400" }} />
      </IconButton>
    </Stack>
  );
};

const AssignTodo = (props: AssignProps) => {
  const { onAssign: onChange, value, name } = props;
  const salesT = useTranslations(NS_SALES);

  const { employeeIsFetching, onEndReachedEmployeeOptions, onSearchEmployee } =
    useGetEmployeeOptions();
  const { memberOptions } = useGetMemberOptions();

  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const onChangeSearch = (name: string, newValue?: string | number) => {
    onSearchEmployee(name, newValue as string);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = debounce((event: any) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - WRONG_NUMBER) {
      onEndReachedEmployeeOptions && onEndReachedEmployeeOptions();
    }
  }, 250);

  const onAssign = (user: Option) => {
    buttonRef.current?.click();
    onChange &&
      onChange(name, {
        id: user.value,
        fullname: user.label,
        avatar: user.avatar,
      } as User);
  };

  const mappedOwner = useMemo(
    () =>
      memberOptions.find((option) => {
        return option.value === value;
      }),
    [memberOptions, value],
  );

  const onRemoveAssign = (id) => {
    onChange &&
      onChange(name, {
        id: "undefined",
        fullname: "",
      } as User);
  };
  return (
    <PopoverLayout
      label={
        mappedOwner ? (
          <DisplayItem user={mappedOwner} onRemoveAssign={onRemoveAssign} />
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Text variant="body2" noWrap>
              {salesT("detail.tab.assign")}
            </Text>
            <ChevronIcon />
          </Stack>
        )

        // <DisplayItem users={value} />
      }
      ref={buttonRef}
    >
      <MenuList onScroll={onScroll} component={Box} sx={{ pb: 0 }}>
        <Search
          name="members.email"
          onChange={onChangeSearch}
          emitWhenEnter
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "6px",
          }}
        />
        {memberOptions.map((option) => {
          return (
            <MenuItem
              component={ButtonBase}
              onClick={() => onAssign(option)}
              sx={defaultSx.item}
              key={option.value}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                width="100%"
              >
                <Avatar
                  src={option?.avatar ?? UserPlaceholderImage}
                  size={24}
                />
                <Stack
                  alignItems="flex-start"
                  sx={{
                    "&": { maxWidth: "90%", width: "90%" },
                    "& > p ": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "90%",
                      textAlign: "left",
                    },
                  }}
                >
                  <Text variant="body2">{option.label}</Text>
                  <Text variant="body2" className="sub">
                    {option.subText}
                  </Text>
                </Stack>
              </Stack>
            </MenuItem>
          );
        })}
        {employeeIsFetching && (
          <MenuItem sx={defaultSx.item}>
            <CircularProgress size={20} sx={{ mx: "auto" }} color="primary" />
          </MenuItem>
        )}
      </MenuList>
    </PopoverLayout>
  );
};

export default memo(AssignTodo);
