import { SelectChangeEvent, Stack } from "@mui/material";
import { Search } from "components/Filters";
import Filter from "components/shared/Filter";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import {
  IBookingAllFitler,
  WorkingStatus,
} from "store/resourcePlanning/action";
import { useBookingAll, useMyBooking } from "store/resourcePlanning/selector";
import useGetOptions from "../hooks/useGetOptions";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cleanObject, stringifyURLSearchParams } from "utils/index";
import useQueryParams from "hooks/useQueryParams";
import dayjs from "dayjs";
import {
  SORT_RESROUCE_OPTIONS,
  DEFAULT_BOOKING_ALL_FILTER,
  TAB_TYPE,
  endOfWeek,
  startOfWeek,
} from "../helper";
import { Button } from "components/shared";

const FilterHeader = ({ type }: { type: TAB_TYPE }) => {
  const resourceT = useTranslations<string>(NS_RESOURCE_PLANNING);
  const commonT = useTranslations<string>(NS_COMMON);
  const [queries, setQueries] = useState<IBookingAllFitler>(
    DEFAULT_BOOKING_ALL_FILTER,
  );
  const { bookingAllFilter, getBookingResource } = useBookingAll();
  const { getMyBooking, myBookingFilter } = useMyBooking();
  const pathname = usePathname();
  const { push, replace } = useRouter();
  const { initQuery, query } = useQueryParams();
  const { positionOptions } = useGetOptions();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSearch = useCallback(() => {
    const newQueries = { ...queries };
    const queryString = stringifyURLSearchParams(newQueries);
    switch (type) {
      case TAB_TYPE.ALL:
        getBookingResource(newQueries);
        break;
      case TAB_TYPE.MY:
        getMyBooking(newQueries);
        break;
    }
  }, [queries, type]);

  const positions = useMemo(() => {
    const result = [...positionOptions];
    result.unshift({
      label: commonT("all"),
      value: "",
    });
    return result;
  }, [positionOptions]);

  const onChangeQueries = (name, value) => {
    setQueries((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (query) {
      setQueries((prev) => ({
        ...prev,
        ...query,
      }));
    }
  }, [query]);

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Stack
        sx={{
          border: {
            xs: "none",
            md: "1px solid",
          },
          borderColor: {
            xs: "transparent",
            md: "grey.100",
          },
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          padding: {
            xs: "0",
            md: "4px 8px",
          },
          borderRadius: "4px",
        }}
        width={{
          xs: "100%",
          md: "auto",
        }}
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing="16px"
      >
        <Search
          name="search_key"
          value={queries?.search_key || ""}
          onChange={(name, value) => onChangeQueries(name, value)}
          onEnter={(name, value) => {
            onChangeQueries(name, value);
            onSearch();
          }}
          placeholder={resourceT("schedule.filter.search")}
          sx={{
            maxWidth: "432px",
            height: "32px",
            " .MuiInputBase-root": {
              maxWidth: "295px",
              height: "30px",
            },
          }}
        />
        <Stack direction="row" spacing="16px">
          <Filter.Select
            value={queries.position || ""}
            onChange={(event) =>
              onChangeQueries("position", event.target.value)
            }
            label={commonT("position")}
            sx={{ maxWidth: "200px" }}
            options={positions}
          />
          <Filter.Select
            value={queries.working_sort || ""}
            onChange={(event) =>
              onChangeQueries("working_sort", event.target.value)
            }
            label={resourceT("schedule.filter.workingHours")}
            sx={{ maxWidth: "260px" }}
            options={[
              {
                label: resourceT("schedule.filter.asceding"),
                value: SORT_RESROUCE_OPTIONS.ASC,
              },
              {
                label: resourceT("schedule.filter.descending"),
                value: SORT_RESROUCE_OPTIONS.DESC,
              },
            ]}
          />
        </Stack>
        <Button
          variant="secondary"
          size="small"
          sx={{
            "&.MuiButtonBase-root": {
              maxWidth: "295px",
              minHeight: "32px!important",
              padding: "0 16px!important",
            },
          }}
          onClick={() => onSearch()}
        >
          {commonT("search")}
        </Button>
      </Stack>
    </Stack>
  );
};

export default FilterHeader;
