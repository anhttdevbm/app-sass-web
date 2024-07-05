import { memo, useRef } from "react";
import {
  Box,
  ButtonBase,
  CircularProgress,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import { IconButton, Text } from "components/shared";
import CircleCloseIcon from "icons/CircleCloseIcon";
import { User } from "constant/types";
import useTheme from "hooks/useTheme";
import { Task } from "store/project/reducer";
import PopoverLayout from "./PopoverLayout";
import { useMemberOptions, useTaskDetail } from "store/project/selectors";
import { NS_COMMON, NS_PROJECT, AN_ERROR_TRY_AGAIN } from "constant/index";
import { useTranslations } from "next-intl";
import { useSnackbar } from "store/app/selectors";
import { debounce, getMessageErrorByAPI } from "utils/index";
import { useParams } from "next/navigation";
import { Search } from "components/Filters";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import Avatar from "components/Avatar";
import ChevronIcon from "icons/ChevronIcon";

type AssignProps = {
  owner?: Task["owner"];
  subId: string;
};

const Assign = (props: AssignProps) => {
  const { owner, subId } = props;
  const { taskListId, taskId, onUpdateTask } = useTaskDetail();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);
  const {
    options,
    onGetOptions,
    isFetching,
    totalPages,
    pageIndex,
    pageSize,
    filters,
  } = useMemberOptions();

  const { id: projectId } = useParams() as { id: string };
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions(projectId, { ...filters, pageSize, pageIndex: pageIndex + 1 });
  };

  const onChangeSearch = (name: string, newValue?: string | number) => {
    onGetOptions(projectId, {
      ...filters,
      pageIndex: 1,
      pageSize,
      [name]: newValue,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = debounce((event: any) => {
    const { scrollTop, clientHeight, scrollHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - WRONG_NUMBER) {
      onEndReached && onEndReached();
    }
  }, 250);

  const onAssign = (id?: string) => {
    return async () => {
      try {
        if (!taskListId || !taskId) {
          throw AN_ERROR_TRY_AGAIN;
        }
        await onUpdateTask({ owner: id }, taskListId, taskId, subId);
        buttonRef?.current?.click();
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    };
  };

  return (
    <PopoverLayout
      label={
        owner?.id ? (
          <DisplayItem user={owner} subId={subId} />
        ) : (
          <Stack direction="row" alignItems="center" spacing={1}>
            <Text variant="body2" noWrap>
              {projectT("taskDetail.assignTask")}
            </Text>
            <ChevronIcon />
          </Stack>
        )
      }
      ref={buttonRef}
    >
      <MenuList onScroll={onScroll} component={Box} sx={{ pb: 0 }}>
        <Search
          name="members.email"
          onChange={onChangeSearch}
          emitWhenEnter
          search={filters?.["members.email"]}
          style={{ marginLeft: '10px', marginRight: '10px' }}
        />
        {options.map((option) => (
          <MenuItem
            component={ButtonBase}
            onClick={onAssign(option.value as string)}
            sx={defaultSx.item}
            key={option.value}
          >
            <Stack direction="row" alignItems="center" spacing={1} width="100%">
              <Avatar src={option?.avatar ?? UserPlaceholderImage} size={24} />
              <Stack alignItems="flex-start" sx={{
                '&': { maxWidth: '90%', width: '100%' },
                '& > p ': {
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '90%',
                  textAlign: 'left'
                }
              }}>
                <Text variant="body2">{option.label}</Text>
                <Text variant="body2" className="sub">
                  {option.subText}
                </Text>
              </Stack>
            </Stack>
          </MenuItem>
        ))}
        {isFetching && (
          <MenuItem sx={defaultSx.item}>
            <CircularProgress size={20} sx={{ mx: "auto" }} color="primary" />
          </MenuItem>
        )}
      </MenuList>
    </PopoverLayout>
  );
};

export default memo(Assign);

const DisplayItem = (props: { user?: User; subId: string }) => {
  const { user = {}, subId } = props;

  const { fullname } = (user ?? {}) as User;

  const { isDarkMode } = useTheme();

  const { taskListId, taskId, subTaskId, onUpdateTask } = useTaskDetail();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);

  const onRemoveAssign = async (event) => {
    event.stopPropagation();
    try {
      if (!taskListId || !taskId) {
        throw AN_ERROR_TRY_AGAIN;
      }
      await onUpdateTask({ owner: "" }, taskListId, taskId, subId);
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

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
      <Text variant="body2" maxWidth={150} noWrap tooltip={fullname}>
        {fullname}
      </Text>
      <IconButton noPadding onClick={onRemoveAssign}>
        <CircleCloseIcon sx={{ color: "grey.400" }} />
      </IconButton>
    </Stack>
  );
};

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

const WRONG_NUMBER = 10;
