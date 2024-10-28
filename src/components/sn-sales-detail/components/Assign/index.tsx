import {
  Box,
  ButtonBase,
  Checkbox,
  CircularProgress,
  debounce,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import Avatar from "components/Avatar";
import { Search } from "components/Filters";
import { Text } from "components/shared";
import AvatarGroup, { AvatarProps } from "components/shared/AvatarGroup";
import PopoverLayout from "components/sn-project-detail/Tasks/Detail/components/SubTasksOfTask/PopoverLayout";
import useGetEmployeeOptions from "components/sn-sales/hooks/useGetEmployeeOptions";
import {
  NS_SALES
} from "constant/index";
import { Option, User } from "constant/types";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { memo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { useSnackbar } from "store/app/selectors";
import { useSaleDetail } from "store/sales/selectors";

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
    "& .MuiCheckbox-root": {
      padding: 1,
    },
  },
};

type AssignProps = {
  value: User[];
  isFilter?: boolean;
  onAssign: (name: string, data: User[]) => void;
};

const DisplayItem = ({
  users,
  isFilter,
}: {
  users: User[];
  isFilter?: boolean;
}) => {
  const { employeeOptions } = useGetEmployeeOptions();

  const salesT = useTranslations(NS_SALES);

  const avatars: AvatarProps[] = users?.reduce((acc, option) => {
    const user = employeeOptions.find((item) => item.value === option.id);
    if (user) {
      acc.push({
        src: user.avatar || UserPlaceholderImage.src,
      });
    }
    return acc;
  }, [] as AvatarProps[]);
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      {avatars?.length === 0 ? (
        <Text variant="body2">{salesT("detail.tab.assign")}</Text>
      ) : (
        <AvatarGroup max={3} size={24} fontSize={14} avatars={avatars || []} />
      )}
      <PlusIcon />
    </Stack>
  );
};

const Assign = (props: AssignProps) => {
  const { onAssign: onChange, value } = props;
  const { saleDetail } = useSaleDetail();
  const saleT = useTranslations(NS_SALES);
  const { onAddSnackbar } = useSnackbar();
  const { getValues } = useFormContext();
  const {
    employeeIsFetching,
    employeeOptions,
    onEndReachedEmployeeOptions,
    onSearchEmployee,
  } = useGetEmployeeOptions();

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
    const selectedItem = value.find((item) => item.id === user.value);
    const todoList = getValues("todo_list");
    const newSeleted = JSON.parse(JSON.stringify(value));

    const isAsisgned = Object.keys(todoList).some((key) => {
      return todoList[key].owner === user.value;
    });

    if (isAsisgned) {
      onAddSnackbar(saleT("detail.assignedUser"), "error");
      return;
    }
    if (selectedItem) {
      newSeleted.splice(
        newSeleted.findIndex((item) => user.value === item.id),
        1,
      );
    } else {
      newSeleted.push({
        id: user.value as string,
        fullname: user.label,
        email: "",
        avatar: user.avatar as string,
      } as User);
    }

    onChange && onChange("members", newSeleted);
  };

  return (
    <PopoverLayout
      label={<DisplayItem users={value} isFilter={props.isFilter} />}
      ref={buttonRef}
    >
      <MenuList
        onScroll={onScroll}
        component={Box}
        sx={{
          pb: 0,
          "& >button": {
            pr: "5px!important",
          },
        }}
      >
        <Search
          name="members.email"
          onChange={onChangeSearch}
          style={{
            marginLeft: "10px",
            marginRight: "10px",
            marginBottom: "6px",
          }}
        />
        {employeeOptions.map((option) => {
          const checked = value?.some((member) => option.value === member.id);
          const isDisabled = saleDetail?.owner?.id === option.value;
          return (
            <MenuItem
              component={ButtonBase}
              onClick={() => onAssign(option)}
              sx={{
                ...defaultSx.item,
              }}
              key={option.value}
              disabled={isDisabled}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                width="100%"
              >
                <Checkbox
                  checked={checked}
                  sx={{
                    "&.MuiButtonBase-root": {
                      padding: 0,
                    },
                  }}
                />
                <Avatar
                  src={option?.avatar ?? UserPlaceholderImage}
                  size={24}
                />
                <Stack
                  alignItems="flex-start"
                  sx={{
                    maxWidth: "90%",
                    width: "85%",
                    "& > p ": {
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      width: "90%",
                      pr: "1rem",
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

export default memo(Assign);
