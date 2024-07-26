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
// import { Box, Typography } from "@mui/material";
import {
  Box,
  Typography,
  // Button,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
} from "@mui/material";

interface FilterHeaderProps {
  type: TAB_TYPE;
  setisServicePopup: any;
  setIsWorkload: any;
}

const FilterHeader = ({
  type,
  setisServicePopup,
  setIsWorkload,
}: FilterHeaderProps) => {
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

  // return (
  //   <Stack direction="row" sx={{ alignItems: "center" }}>
  //     {/* <Search
  //         name="search_key"
  //         value={queries?.search_key || ""}
  //         onChange={(name, value) => onChangeQueries(name, value)}
  //         onEnter={(name, value) => {
  //           onChangeQueries(name, value);
  //           onSearch();
  //         }}
  //         placeholder={resourceT("schedule.filter.search")}
  //         sx={{
  //           maxWidth: "432px",
  //           height: "32px",
  //           " .MuiInputBase-root": {
  //             maxWidth: "295px",
  //             height: "30px",
  //           },
  //         }}
  //       /> */}
  //     <Typography sx={{ marginRight: "5px" }}>View by:</Typography>
  //     <Stack direction="row" sx={{ alignItems: "center" }}>
  //       <Typography>position:</Typography>
  //       <Filter.Select
  //         value={queries.position || ""}
  //         onChange={(event) => onChangeQueries("position", event.target.value)}
  //         label={commonT("position")}
  //         sx={{ maxWidth: "200px" }}
  //         options={positions}
  //       />
  //     </Stack>
  //     <Stack direction="row" sx={{ alignItems: "center" }}>
  //       <Typography>position</Typography>
  //       <Filter.Select
  //         value={queries.working_sort || ""}
  //         onChange={(event) =>
  //           onChangeQueries("working_sort", event.target.value)
  //         }
  //         label={resourceT("schedule.filter.workingHours")}
  //         sx={{ maxWidth: "260px" }}
  //         options={[
  //           {
  //             label: resourceT("schedule.filter.asceding"),
  //             value: SORT_RESROUCE_OPTIONS.ASC,
  //           },
  //           {
  //             label: resourceT("schedule.filter.descending"),
  //             value: SORT_RESROUCE_OPTIONS.DESC,
  //           },
  //         ]}
  //       />
  //     </Stack>
  //     {/* <Button
  //         variant="secondary"
  //         size="small"
  //         sx={{
  //           "&.MuiButtonBase-root": {
  //             maxWidth: "295px",
  //             minHeight: "32px!important",
  //             padding: "0 16px!important",
  //           },
  //         }}
  //         onClick={() => onSearch()}
  //       >
  //         {commonT("search")}
  //       </Button> */}
  //   </Stack>
  // );
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "#f7f7f9", // Màu nền của container
        padding: "10px 20px",
        borderRadius: "100px",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
      }}
    >
      <Typography sx={{ mr: 2, fontSize: "16px" }}>
        {resourceT("schedule.filter.viewBy")}:
      </Typography>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          mr: 2,
          background: "#FFFFFF",
          minWidth: "155px",
          height: "48px",
          borderRadius: "100px",
          "& .MuiTypography-body1": {
            margin: 0,
            fontSize: "13px",
          },
          justifyContent: "center",
        }}
      >
        <Typography sx={{ mr: 1 }}>
          {resourceT("schedule.filter.position")}:
        </Typography>
        <Filter.Select
          value={queries.position || ""}
          onChange={(event) => onChangeQueries("position", event.target.value)}
          label={commonT("position")}
          sx={{ maxWidth: "200px" }}
          options={positions}
        />
      </Stack>

      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          mr: 2,
          background: "#FFFFFF",
          minWidth: "223px",
          height: "48px",
          borderRadius: "100px",
          fontSize: "16px",
          justifyContent: "center",
          "& .MuiTypography-body1": {
            margin: 0,
            fontSize: "13px",
          },
        }}
      >
        <Typography sx={{ mr: 1 }}>
          {resourceT("schedule.filter.workingHours")}:
        </Typography>
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
        sx={{
          display: "flex",
          alignItems: "center",
          mr: 2,
          color: "black",
          borderRadius: "50px",
        }}
        onClick={() => setIsWorkload((prev: Boolean) => !prev)}
      >
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginRight: "5px",
          }}
        >
          ⓘ
        </span>
        Workload
      </Button>

      <Button
        sx={{
          marginLeft: "auto",
          backgroundColor: "transparent",
          color: "primary.main",
          textTransform: "none",
          fontWeight: "bold",
          "&:hover": {
            backgroundColor: "rgba(0, 123, 255, 0.1)",
            borderRadius: "100px",
          },
        }}
        onClick={() => {
          setisServicePopup((prev: Boolean) => !prev);
        }}
      >
        <span
          style={{
            display: "inline-block",
            verticalAlign: "middle",
            marginRight: "5px",
          }}
        >
          📺
        </span>
        Choose Service
      </Button>
    </Box>
  );
};

export default FilterHeader;
