import { memo, useEffect, useState } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Dropdown, Search as SearchInput } from "components/Filters";
import { Button } from "components/shared";
import { useTranslations } from "next-intl";
import {
  DATE_FORMAT_FORM,
  NS_BUDGETING,
  NS_COMMON,
  NS_PROJECT,
} from "constant/index";
import { formatDate, getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import { useParams, useSearchParams } from "next/navigation";
import Filter from "components/sn-project-detail/Budget/Actions/Filter";
import { TBudgetListQueries } from "store/project/budget/action";

const Search = ({ projectId }: { projectId?: string }) => {
  const [queries, setQueries] = useState<any>({});

  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);
  const pathname = usePathname();
  const { push } = useRouter();
  const param = useSearchParams();

  useEffect(() => {
    const newQueries = {};
    param.forEach((value, key) => {
      if (key === "start_date" || key === "end_date") {
        newQueries[key] = new Date(value);
      } else {
        newQueries[key] = value;
      }
    });
    setQueries(newQueries);
  }, []);

  const onChangeQueries = (name: string, value: any) => {
    setQueries((prevQueries: any) => ({ ...prevQueries, [name]: value }));
  };

  const onSearch = () => {
    let newQueries: TBudgetListQueries = {};
    if (projectId) {
      newQueries.project_id = projectId;
    }
    if (
      typeof queries?.user_id === "object" &&
      Array.isArray(queries.user_id) &&
      queries.user_id.length > 0
    ) {
      const newListId = queries.user_id.map(({ id }) => id);
      newQueries.user_id = newListId.join(",");
      delete queries.user_id;
    }
    if (queries.start_date) {
      newQueries.start_date = formatDate(queries.start_date, DATE_FORMAT_FORM);
      delete queries.start_date;
    }
    if (queries.end_date) {
      newQueries.end_date = formatDate(queries.end_date, DATE_FORMAT_FORM);
      delete queries.end_date;
    }
    const path = getPath(pathname, {
      ...queries,
      ...newQueries,
      pageIndex: 1,
    });
    push(path);
  };

  const GroupOption: { label: string; value: string }[] = [
    { label: projectT("budget.groupBy.dateCreated"), value: "created_time" },
    { label: projectT("budget.groupBy.dateUpdated"), value: "updated_time" },
    { label: projectT("budget.groupBy.startDate"), value: "start_date" },
    { label: projectT("budget.groupBy.endDate"), value: "end_date" },
    { label: projectT("budget.groupBy.owner"), value: "owner" },
  ];

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      alignItems={{ md: "center" }}
      justifyContent="space-between"
      spacing={{ xs: 1, md: 3 }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={3}
        py={{ xs: 1.25, md: 0.5, lg: 1.25 }}
        borderRadius={1}
        width={{ xs: "100%", md: "100%" }}
        justifyContent={{ xs: "flex-start", md: "flex-end" }}
        maxWidth={{ xs: "100%", md: "fit-content" }}
        overflow="auto"
        minWidth={{ md: "fit-content" }}
      >
        <Dropdown
          placeholder={projectT("budget.titleGroupBy")}
          options={GroupOption}
          name="group_by"
          hasAll={false}
          onChange={onChangeQueries}
          defaultValue={queries?.group_by}
          value={queries?.group_by}
        />
        <Filter queries={queries} onChange={onChangeQueries} />
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
    </Stack>
  );
};

export default memo(Search);

export const SearchWithOnlyInput = () => {
  const [queries, setQueries] = useState<any>({});
  const { id: projectId } = useParams();
  const projectT = useTranslations(NS_BUDGETING);
  const { breakpoints } = useTheme();
  const is1440Larger = useMediaQuery(breakpoints.up(1440));
  const param = useSearchParams();
  const pathname = usePathname();
  const { push } = useRouter();

  useEffect(() => {
    const newQueries = {};
    param.forEach((value, key) => {
      newQueries[key] = value;
    });
    setQueries(newQueries);
  }, []);

  const onSearch = () => {
    let newQueries: TBudgetListQueries = {};

    if (projectId) {
      newQueries.project_id = String(projectId);
    }

    const path = getPath(pathname, {
      ...queries,
      ...newQueries,
      pageIndex: 1,
    });

    push(path);
  };

  const onChangeQueries = (name: string, value?: string) => {
    setQueries({
      ...queries,
      [name]: value ?? "",
    });
    // clearTimeout(window["timeoutStartSearch"]);
    // window["timeoutStartSearch"] = setTimeout(onSearch, 1000);
  };

  return (
    <SearchInput
      placeholder={projectT("toolbar.search")}
      name="search_key"
      onChange={onChangeQueries}
      onEnter={(name: string, value?: string) => {
        onChangeQueries(name, value ?? "");
        onSearch();
      }}
      value={queries.search_key ?? ""}
      sx={{
        width: { xs: is1440Larger ? 250 : 180 },
        minWidth: { xs: is1440Larger ? 250 : 180 },
      }}
    />
  );
};
