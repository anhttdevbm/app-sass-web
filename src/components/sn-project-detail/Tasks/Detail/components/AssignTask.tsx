import { memo, useEffect } from "react";
import { MenuItem, MenuList, Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_PROJECT } from "constant/index";
import DialogLayout from "components/DialogLayout";
import useToggle from "hooks/useToggle";
import { Search } from "components/Filters";
import Avatar from "components/Avatar";
import { useMemberOptions, useTaskDetail } from "store/project/selectors";
import { useSnackbar } from "store/app/selectors";
import { debounce, getMessageErrorByAPI } from "utils/index";
import { useParams } from "next/navigation";

type AssignTaskProps = {};

const AssignTask = (props: AssignTaskProps) => {
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const {
    onGetOptions,
    options,
    pageIndex,
    pageSize,
    isFetching,
    totalPages,
    filters,
  } = useMemberOptions();
  const { task, taskListId, taskId, subTaskId, onUpdateTask } = useTaskDetail();
  const { onAddSnackbar } = useSnackbar();

  const [isShow, onShow, onHide] = useToggle();

  const { id: projectId } = useParams() as { id: string };

  const onAssign = (owner: string) => {
    return async () => {
      try {
        if (!taskListId || !taskId) {
          throw AN_ERROR_TRY_AGAIN;
        }
        const newData = await onUpdateTask(
          { owner },
          taskListId,
          taskId,
          subTaskId,
        );
        if (newData) {
          onAddSnackbar(
            projectT("taskDetail.notification.assignSuccess"),
            "success",
          );
          onHide();
        }
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    };
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onScroll = debounce((event: any) => {
    if (isFetching || !totalPages || pageIndex >= totalPages) return;
    const { scrollTop, clientHeight, scrollHeight } = event.target;

    if (scrollTop + clientHeight >= scrollHeight - WRONG_NUMBER) {
      onGetOptions(projectId, { pageIndex: pageIndex + 1, pageSize });
    }
  }, 250);

  const onChangeSearch = (name: string, newValue?: string) => {
    onGetOptions(projectId, {
      pageIndex: 1,
      pageSize: 20,
      [name]: newValue ?? "",
    });
  };

  useEffect(() => {
    onGetOptions(projectId, { pageIndex: 1, pageSize: 20 });
  }, [onGetOptions, projectId]);

  return (
    <>
      <Button
        variant="secondary"
        size="small"
        onClick={onShow}
        sx={{
          minHeight: "32px!important",
          py: "7px!important",
          lineHeight: 1.28,
        }}
      >
        {projectT("taskDetail.assignTask")}
      </Button>

      <DialogLayout
        sx={{
          zIndex: 1201,
          minWidth: { xs: "calc(100vw - 24px)", sm: 600 },
          height: 600,
        }}
        renderHeader={projectT("taskDetail.assignTask")}
        contentProps={{
          sx: {
            overflow: "hidden",
          },
        }}
        open={isShow}
        onClose={onHide}
      >
        <Stack flex={1} p={3} height="100%" spacing={2} overflow="hidden">
          <Search
            name="members.email"
            placeholder={commonT("searchBy", { name: "email" })}
            onChange={onChangeSearch}
            value={filters?.["members.email"]}
            emitWhenEnter
          />
          <Stack flex={1} overflow="hidden">
            <MenuList
              sx={{
                overflow: "auto",
              }}
              onScroll={onScroll}
            >
              {options.map((option) => (
                <MenuItem
                  key={option.value}
                  sx={sxConfig.item}
                  onClick={onAssign(option.value as string)}
                >
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar src={option?.avatar} size={24} />
                    <Stack>
                      <Text variant="body2">{option.label}</Text>
                      <Text variant="body2" className="sub">
                        {option.subText}
                      </Text>
                    </Stack>
                  </Stack>
                </MenuItem>
              ))}
            </MenuList>
          </Stack>
        </Stack>
      </DialogLayout>
    </>
  );
};

export default memo(AssignTask);

const sxConfig = {
  item: {
    fontSize: 14,
    color: "text.primary",
    // backgroundColor: "grey.50",
    backgroundColor: "primary.paper",
    lineHeight: "22px",
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
