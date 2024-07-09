"use client";

import { memo, useState, useEffect, useMemo } from "react";
import {
  Box,
  Stack,
  Theme,
  selectClasses,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Button, Text } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { Search } from "components/Filters";
import {
  useMemberOptions,
  useProjects,
  useTasksOfProject,
} from "store/project/selectors";
import { getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import useToggle from "hooks/useToggle";
import { DataAction } from "constant/enums";
// import Form, { ProjectDataForm } from "./Form";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useTranslations } from "next-intl";
import {
  DATE_FORMAT_HYPHEN,
  NS_COMMON,
  NS_PROJECT,
  STATUS_OPTIONS,
} from "constant/index";
import { AssignerFilter, TASK_STATUS_OPTIONS } from "./components";
import TaskListForm from "./TaskListForm";
import { useParams } from "next/navigation";
import { TaskListData } from "store/project/actions";
import { useHeaderConfig } from "store/app/selectors";
import Link from "components/Link";
import ChevronIcon from "icons/ChevronIcon";
import useBreakpoint from "hooks/useBreakpoint";
import ButtonWithDropdown from "components/sn-projects/components/ButtonWithDropdown";
import SearchIcon from "icons/SearchIcon";
import Dropdown from "components/sn-projects/components/Dropdown";
import Date from "components/sn-projects/components/Date";

const Actions = () => {
  const {
    filters,
    pageSize,
    onCreateTaskList: onCreateTaskListAction,
    onGetTasksOfProject,
  } = useTasksOfProject();
  const { onGetOptions } = useMemberOptions();
  const { title, prevPath } = useHeaderConfig();
  const { isMdSmaller } = useBreakpoint();
  const { breakpoints } = useTheme();
  const is1440Larger = useMediaQuery(breakpoints.up(1440));

  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const pathname = usePathname();
  const { push } = useRouter();
  const [isShow, onShow, onHide] = useToggle();

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
        direction={{ sm: "row" }}
        alignItems="center"
        justifyContent="space-between"
        px={2}
        spacing={{ xs: 1, md: 2 }}
        py={{ xs: 0.75, md: 1 }}
        position="relative"
        // top={{ xs: 108, md: 36 }}
        zIndex={12}
        bgcolor="background.paper"
        width="100%"
      >
        {/* <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          flex={1}
          width="50%"
        >
          {!!prevPath && (
            <Link
              href={prevPath}
              sx={{ height: isMdSmaller ? 16 : 24, display: { sm: "none" } }}
            >
              <ChevronIcon
                sx={{
                  color: "text.primary",
                  transform: "rotate(90deg)",
                }}
                fontSize={isMdSmaller ? "small" : "medium"}
              />
            </Link>
          )}
          <Text variant={{ xs: "body2", md: "h4" }} display={{ sm: "none" }}>
            {title ?? ""}
          </Text>
        </Stack> */}

        <ButtonWithDropdown
          id="add_new_id"
          size="small"
          text={projectT("detailTasks.createNewTaskList")}
          onClick={onShow}
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

          <Dropdown
            prefixLabel={commonT("status")}
            placeholder={commonT("all")}
            options={statusOptions}
            name="tasks.status"
            onChange={onChangeQueries}
            value={queries?.["tasks.status"]}
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
      {isShow && (
        <TaskListForm
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES}
          onSubmit={onCreateTaskList}
        />
      )}
    </>
  );
};

export default memo(Actions);

const INITIAL_VALUES = {
  name: "",
} as TaskListData;
