/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import PlusIcon from "icons/PlusIcon";
import { Button, Text } from "components/shared";
import { Dropdown, Search } from "components/Filters";
import { getPath } from "utils/index";
import { memo, useEffect, useMemo, useState } from "react";
import { NS_COMMON, NS_COMPANY, NS_DOCS } from "constant/index";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { Box, Stack } from "@mui/material";
import { usePathname, useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";
import { useDocs } from "store/docs/selectors";
import NoneIcon from "icons/NoneIcon";
import FilterSearchDocs from "./FilterSearchDocs/FilterSearchDocs";
import { DocGroupByEnum } from "constant/enums";
import { useAppSelector } from "store/hooks";
import { useParams, useSearchParams } from "next/navigation";

function convertStringToArray(inputString) {
  let idArray = inputString.split(",");

  let resultArray = idArray.map((id) => {
    return { id: id, name: "" };
  });

  return resultArray;
}

type ActionProps = {
  isProjectTabMode: boolean;
};

const Actions = ({ isProjectTabMode }: ActionProps) => {
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);
  const docsT = useTranslations(NS_DOCS);
  const { filters, onCreateDoc, loading } = useDocs();
  const { perm } = useAppSelector((state) => state.doc);
  const pathname = usePathname();
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const [queries, setQueries] = useState<any>({});
  const grOptions = useMemo(
    () => Group_OPTIONS.map((item) => ({ ...item, label: docsT(item.label) })),
    [companyT],
  );

  const onChangeQueries = (name: string, value: any) => {
    setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
  };
  const { id } = useParams();

  const handleCreateDoc = () => {
    onCreateDoc(id as string);
    // if (id && id !== undefined && isProjectTabMode) {
    // }
  };

  const onSearch = () => {
    let newQueries = {
      ...queries,
      page: 1,
      group_by: DocGroupByEnum.PROJECT_ID,
    };

    if (queries?.user_id?.length > 0) {
      const newListId = queries?.user_id?.map((person) => `${person.id}`);

      newQueries = {
        ...queries,
        user_id: newListId.join(","),
      };
    }
    const path = getPath(pathname, newQueries);
    console.log("New path", { path });
    push(path);
  };

  useEffect(() => {
    let newFilter = filters;

    if (filters?.user_id) {
      newFilter = {
        ...filters,
        user_id: convertStringToArray(filters?.user_id),
      };
    }

    setQueries(newFilter);
  }, [filters]);

  useEffect(() => {
    setQueries({ search_key: searchParams.get("search_key") });
  }, [searchParams.get("search_key")]);

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 1, md: 3 }}
        px={{ xs: 0, md: 3 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          spacing={{ xs: 2, md: 0 }}
        >
          <Text variant="h4" display={{ md: "none" }}>
            {docsT("title")}
          </Text>
          <Box onClick={handleCreateDoc}>
            <Button
              disabled={loading}
              startIcon={<PlusIcon />}
              size="extraSmall"
              variant="primary"
              sx={{
                height: 32,
                px: ({ spacing }) => `${spacing(2)}!important`,
              }}
            >
              {docsT("button.add")}
            </Button>
          </Box>
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          py={{ xs: 1.25, md: 0.5, lg: 1.25 }}
          px={{ md: 1, lg: 2 }}
          borderRadius={1}
          width={{ xs: "100%", md: "100%" }}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          maxWidth={{ xs: "100%", md: "fit-content" }}
          overflow="auto"
          minWidth={{ md: "fit-content" }}
        >
          <Search
            placeholder={docsT("filter.search", { name: "email" })}
            name="search_key"
            onChange={onChangeQueries}
            value={queries?.search_key}
            sx={{ width: 200, minWidth: 200 }}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.key === "Enter") {
                onSearch();
              }
            }}
          />

          <Dropdown
            placeholder={
              isProjectTabMode
                ? docsT("filter.all")
                : docsT("filter.group.none")
            }
            options={grOptions}
            name="group_by"
            hasAll={false}
            onChange={onChangeQueries}
            defaultValue={
              isProjectTabMode ? docsT("filter.all") : queries?.group_by
            }
            value={isProjectTabMode ? docsT("filter.all") : queries?.group_by}
          />
          <FilterSearchDocs queries={queries} onChange={onChangeQueries} />
          <Button
            size="extraSmall"
            sx={{
              display: { xs: "none", md: "flex" },
              height: 32,
              px: ({ spacing }) => `${spacing(2)}!important`,
            }}
            onClick={onSearch}
            variant="secondary"
          >
            {commonT("search")}
          </Button>
        </Stack>
        <Button
          size="small"
          sx={{
            height: 40,
            display: { md: "none" },
            width: "fit-content",
            marginBottom: "20px",
          }}
          onClick={onSearch}
          variant="secondary"
        >
          {commonT("search")}
        </Button>
      </Stack>
    </>
  );
};

export default memo(Actions);

const Group_OPTIONS = [
  {
    label: "filter.filter.creator",
    value: DocGroupByEnum.CREATED_BY,
    icon: <NoneIcon></NoneIcon>,
  },
  {
    label: "filter.filter.project",
    value: DocGroupByEnum.PROJECT_ID,
    icon: <NoneIcon></NoneIcon>,
  },
];
const Filter_Options = [
  { label: "filter.filter.creator", value: 1 },
  { label: "filter.filter.lastEdited", value: 2 },
  { label: "filter.filter.name", value: 3 },
  { label: "filter.filter.project", value: 4 },
  { label: "filter.filter.projectStatus", value: 5 },
];
