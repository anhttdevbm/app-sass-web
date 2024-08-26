"use client";

import { memo, useState, useEffect, useMemo } from "react";
import {
  Box,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  SvgIcon,
  SvgIconProps,
  Theme,
  selectClasses,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Button } from "components/shared";
import { Search } from "components/Filters";
import { useMemberOptions, useTasksOfProject } from "store/project/selectors";
import { getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import useToggle from "hooks/useToggle";
import { DataAction } from "constant/enums";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useTranslations } from "next-intl";
import { DATE_FORMAT_HYPHEN, NS_COMMON, NS_PROJECT } from "constant/index";
import { AssignerFilter, TASK_STATUS_OPTIONS } from "./components";
import TaskListForm from "./TaskListForm";
import { useParams } from "next/navigation";
import { TaskListData } from "store/project/actions";
import { useHeaderConfig } from "store/app/selectors";
import useBreakpoint from "hooks/useBreakpoint";
import ButtonWithDropdown from "components/sn-projects/components/ButtonWithDropdown";
import SearchIcon from "icons/SearchIcon";
import Dropdown from "components/sn-projects/components/Dropdown";
import Date from "components/sn-projects/components/Date";
import AIGradientIcon from "icons/AIGradientIcon";
import TaskListAiForm from "./TaskListAiForm";
import CreateNewTaskListButton from "./components/CreateNewTaskListButton";
import StatusDropdown from "components/sn-projects/components/StatusDropdown";

const Actions = () => {
  const {
    filters,
    pageSize,
    onCreateTaskList: onCreateTaskListAction,
    onGetTasksOfProject,
  } = useTasksOfProject();
  const { onGetOptions } = useMemberOptions();
  const { breakpoints } = useTheme();
  const is1440Larger = useMediaQuery(breakpoints.up(1440));
  const { title } = useHeaderConfig();

  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const pathname = usePathname();
  const { push } = useRouter();
  const [isShow, onShow, onHide] = useToggle();
  const [isShowAiForm, onShowAiForm, onHideAiForm] = useToggle();

  const [queries, setQueries] = useState<Params>({});
  const params = useParams();

  const projectId = useMemo(() => params.id, [params.id]) as string;

  const statusOptions = useMemo(
    () =>
      TASK_STATUS_OPTIONS.map((item) => ({
        ...item,
        label: commonT(item.label),
      })),
    [commonT],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (name: string, value: any) => {
    // console.log("Change queries:---", name, value);
    setQueries((prevQueries) => ({
      ...prevQueries,
      [name]: value,
    }));
  };

  const onSearch = () => {
    const path = getPath(pathname, queries);
    push(path);

    onGetTasksOfProject(projectId, { ...queries, pageIndex: 1, pageSize });
  };

  const onClear = () => {
    const newQueries = { pageIndex: 1, pageSize };
    const path = getPath(pathname, newQueries);
    push(path);
    onGetTasksOfProject(projectId, newQueries);
  };

  const onRefresh = () => {
    onGetTasksOfProject(projectId, { ...filters, pageIndex: 1, pageSize });
  };

  const onCreateTaskList = async (values: Omit<TaskListData, "project">) => {
    return await onCreateTaskListAction({
      project: projectId,
      name: values.name,
    });
  };

  useEffect(() => {
    setQueries(filters);
  }, [filters]);

  useEffect(() => {
    if (!projectId) return;
    onGetOptions(projectId, { pageIndex: 1, pageSize: 20 });
  }, [onGetOptions, projectId]);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        px={2}
        spacing={{ xs: 1, md: 2 }}
        py={{ xs: 0.75, md: 1 }}
        position="relative"
        zIndex={12}
        bgcolor="background.paper"
        width="100%"
      >
        <CreateNewTaskListButton
          sx={{ display: { xs: "none", sm: "inherit" } }}
        />

        <Box mb={1} display="flex">
          <Search
            placeholder={commonT("searchBy", {
              name: projectT("detailTasks.key"),
            })}
            name="tasks.name"
            onChange={onChangeQueries}
            onEnter={(name, value) => {
              onChangeQueries(name, value);
              onSearch();
            }}
            value={queries?.["tasks.name"]}
            startNode={null}
            endNode={
              <SearchIcon sx={{ fontSize: 16 }} htmlColor="dodgerblue" />
            }
            sx={{
              minWidth: { xs: is1440Larger ? 220 : 160 },
            }}
            rootSx={{ height: 32, borderRadius: "1.5rem" }}
          />
        </Box>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
        >
          <AssignerFilter
            onChange={onChangeQueries}
            value={queries?.["tasks.owner"]}
            hasAvatar
            sx={{ display: { xs: "none", md: "initial" } }}
            rootSx={{
              "& >svg": { fontSize: 16 },
              px: "0px!important",
              [`& .${selectClasses.outlined}`]: {
                pr: "0!important",
                mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                  `${spacing(4)}!important`,
                "& .sub": {
                  display: "none",
                },
              },
            }}
          />

          <Box px={2} border="solid 1px lightgray" borderRadius="2rem">
            <Date
              label={commonT("form.title.startDate")}
              name="tasks.start_date"
              onChange={onChangeQueries}
              value={queries?.["tasks.start_date"]}
              format={DATE_FORMAT_HYPHEN}
              iconProps={{
                sx: { fontSize: 24 },
              }}
            />
          </Box>

          <StatusDropdown
            value={queries?.["tasks.status"] ?? ""}
            onChange={(value) => onChangeQueries("tasks.status", value)}
          />

          <Button
            size="small"
            sx={{
              display: { xs: "none", md: "flex" },
              borderRadius: "2rem",
            }}
            onClick={onSearch}
            variant="secondary"
          >
            {commonT("search")}
          </Button>

          <Button
            size="small"
            sx={{ height: 40, display: { md: "none" }, width: "fit-content" }}
            onClick={onSearch}
            variant="secondary"
          >
            {commonT("search")}
          </Button>
        </Stack>
      </Stack>
    </>
  );
};

export default memo(Actions);
