"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import { Stack } from "@mui/material";
import { Clear, Search, Refresh } from "components/Filters";
import { getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import AddMembers from "./AddMembers";
import { useMembersOfProject } from "store/project/selectors";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";

const Actions = () => {
  const { filters, onGetMembersOfProject, pageSize, id } =
    useMembersOfProject();
  const commonT = useTranslations(NS_COMMON);
  const filtersRef = useRef<Params>(filters);

  const pathname = usePathname();
  const { push } = useRouter();

  const onChangeData = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (name: string, value: any) => {
      if (!id) return;
      const newQueries = {
        ...filtersRef.current,
        [name]: value,
      };
      const path = getPath(pathname, newQueries);
      push(path);

      onGetMembersOfProject(id, { ...newQueries, pageIndex: 1, pageSize });
    },
    [id, onGetMembersOfProject, pageSize, pathname, push],
  );

  const onClear = () => {
    if (!id) return;

    const newQueries = { pageIndex: 1, pageSize };
    const path = getPath(pathname, newQueries);
    push(path);
    onGetMembersOfProject(id, newQueries);
  };

  const onRefresh = () => {
    if (!id) return;

    onGetMembersOfProject(id, { ...filters, pageIndex: 1, pageSize });
  };

  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={3}
      py={{ xs: 1.5, md: 1, lg: 1.5 }}
      px={{ xs: 0, md: 3 }}
      display={{ xs: "none", md: "flex" }}
    >
      <AddMembers />
      {/* <Stack direction="row" alignItems="center" spacing={3}>
        <Search
          placeholder={commonT("searchBy", { name: "email" })}
          name="members.email"
          onChange={onChangeData}
          value={filters?.["members.email"]}
          emitWhenEnter
        />
        <Refresh onClick={onRefresh} />
        {!!Object.keys(filters).length && <Clear onClick={onClear} />}
      </Stack> */}
    </Stack>
  );
};

export default memo(Actions);
