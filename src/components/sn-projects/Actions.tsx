"use client";

import { memo, useState, useEffect, useMemo } from "react";
import {
  Box,
  IconButton,
  InputLabel,
  Stack,
  Theme,
  selectClasses,
} from "@mui/material";
import { Button, Select, Text } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { Search, Switch } from "components/Filters";
import { INITIAL_VALUES, STATUS_OPTIONS } from "./components/helpers";
import { useProjects } from "store/project/selectors";
import { getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import useToggle from "hooks/useToggle";
import { DataAction } from "constant/enums";
import Form, { ProjectDataForm } from "./Form";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import SearchIcon from "icons/SearchIcon";
import Dropdown from "./components/Dropdown";
import ButtonWithDropdown from "./components/ButtonWithDropdown";

const Actions = () => {
  const { items, filters, onGetProjects, pageSize, onCreateProject } =
    useProjects();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const pathname = usePathname();
  const { push } = useRouter();
  const [isShow, onShow, onHide] = useToggle();

  const [queries, setQueries] = useState<Params>({});

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((item) => ({ ...item, label: commonT(item.label) })),
    [commonT],
  );

  const assignerOptions = useMemo(
    () =>
      Array.from(
        items.reduce((map, item) => {
          if (item.owner && !map.has(item.owner.id)) {
            map.set(item.owner.fullname, item.owner.id);
          }

          return map;
        }, new Map<string, string>()),
      ).map(([label, value]) => ({ label, value })),
    [items],
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (name: string, value: any) => {
    const newQueries = {
      ...queries,
      /**
       * Updates the value of a specific action based on the provided name and value.
       * If the name is "sort" and a value is provided, it sets the value to LATEST_VALUE.
       * If the name is "sort" and no value is provided, it sets the value to undefined.
       * If the name is "saved" and no value is provided, it sets the value to undefined.
       * Otherwise, it sets the value to the provided value.
       **/
      [name]:
        name === "sort" && value
          ? LATEST_VALUE
          : name === "sort"
          ? undefined
          : name === "saved" && !value
          ? undefined
          : value,
    };
    onSearch(newQueries);
  };

  const onSearch = (newQueries: Params) => {
    const path = getPath(pathname, newQueries);
    push(path);

    // onGetProjects({ ...newQueries, pageIndex: 1, pageSize });
  };

  const onClear = () => {
    const newQueries = { pageIndex: 1, pageSize };
    const path = getPath(pathname, newQueries);
    push(path);
    onGetProjects(newQueries);
  };

  const onRefresh = () => {
    onGetProjects({ ...filters, pageIndex: 1, pageSize });
  };

  useEffect(() => {
    setQueries(filters);
  }, [filters]);

  return (
    <>
      <>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          justifyContent="space-between"
          borderBottom="1px solid"
          borderColor="grey.100"
          spacing={{ xs: 2, md: 3 }}
          px={{ md: 3 }}
          pt={{ md: 1, lg: 1.5 }}
          pb={{ xs: 1.5, md: 1, lg: 1.5 }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={3}
            borderRadius={1}
            justifyContent={{ xs: "flex-end", md: "flex-start" }}
            overflow="auto"
            width="100%"
          >
            <Switch
              name="sort"
              onChange={onChangeQueries}
              size="small"
              reverse
              label={projectT("list.filter.recent")}
              value={queries?.sort === LATEST_VALUE}
            />
            <Switch
              name="saved"
              onChange={onChangeQueries}
              size="small"
              reverse
              label={projectT("list.filter.saved")}
              value={queries?.saved}
            />

            <Dropdown
              prefixLabel={commonT("status")}
              placeholder={commonT("all")}
              options={statusOptions}
              name="status"
              onChange={onChangeQueries}
              value={queries?.status}
            />

            <Dropdown
              prefixLabel={commonT("assigner")}
              placeholder={commonT("all")}
              options={statusOptions}
              name="owner"
              onChange={onChangeQueries}
              value={queries?.status}
            />
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={{ xs: 2, md: 0 }}
            width={{ xs: "100%", md: "fit-content" }}
          >
            <Text variant={{ xs: "h3", md: "h4" }} display={{ md: "none" }}>
              {projectT("list.title")}
            </Text>

            <ButtonWithDropdown text={commonT("createNew")} onClick={onShow} />
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "flex",
            py: 2,
            px: 3,
            marginBottom: 1.5,
          }}
        >
          <Search
            placeholder={commonT("searchBy", { name: projectT("list.key") })}
            name="name"
            onChange={onChangeQueries}
            value={queries?.["name"]}
            startNode={null}
            endNode={
              <SearchIcon sx={{ fontSize: 16 }} htmlColor="dodgerblue" />
            }
            sx={{ display: { xs: "flex" }, width: "35%" }}
            rootSx={{ borderRadius: "1.5rem" }}
          />
        </Box>
      </>

      {isShow && (
        <Form
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES as unknown as ProjectDataForm}
          onSubmit={onCreateProject}
        />
      )}
    </>
  );
};

export default memo(Actions);

const LATEST_VALUE = "updated_time=-1";
