import { Stack } from "@mui/material";
import { Button } from "components/shared";
import Filter from "components/shared/Filter";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IBookingAllFitler } from "store/resourcePlanning/action";
import { useBookingAll, useMyBooking } from "store/resourcePlanning/selector";
import { stringifyURLSearchParams } from "utils/index";
import {
  DEFAULT_BOOKING_ALL_FILTER,
  SORT_RESROUCE_OPTIONS,
  TAB_TYPE,
} from "../helper";
import useGetOptions from "../hooks/useGetOptions";
// import { Box, Typography } from "@mui/material";
import { Box, Typography } from "@mui/material";
import { ClockIcon } from "@mui/x-date-pickers";
import useBreakpoint from "hooks/useBreakpoint";
import ServiceIcon from "icons/ServiceIcon";

interface FilterHeaderProps {
  type: TAB_TYPE;
  setisServicePopup: any;
  setIsWorkload: any;
  tab: String;
}

const FilterHeader = ({
  type,
  setisServicePopup,
  setIsWorkload,
  tab,
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
  const { isSmSmaller } = useBreakpoint();

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
        padding: "5px 20px",
        borderRadius: isSmSmaller ? 0 : "100px",
        boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)", // Đổ bóng nhẹ
        whiteSpace: "nowrap",
        overflow: "auto",
        margin: isSmSmaller ? 0 : " 0px 20px",
        width: "100%",
      }}
    >
      <Typography sx={{ mr: 2, fontSize: "16px", color: "black" }}>
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
        <Typography sx={{ mr: 1, color: "black" }}>
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

      {tab === "allPeople" && (
        <>
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
              padding: "0 8px",
            }}
          >
            <Typography sx={{ mr: 1, color: "black" }}>
              {resourceT("schedule.filter.workingHours")}:
            </Typography>
            <Filter.Select
              value={queries.working_sort || ""}
              onChange={(event) =>
                onChangeQueries("working_sort", event.target.value)
              }
              label={resourceT("schedule.filter.workingHours")}
              sx={{ maxWidth: "260px", color: "black" }}
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

          {!isSmSmaller && (
            <>
              <Button
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mr: 2,
                  borderRadius: "50px",
                  color: "#00000080",
                  fontWeight: 700,
                  gap: 1,
                }}
                onClick={() => setIsWorkload((prev: Boolean) => !prev)}
              >
                <ClockIcon sx={{ width: 14, height: 14, color: "#00000080" }} />
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
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
                onClick={() => {
                  setisServicePopup((prev: Boolean) => !prev);
                }}
              >
                <ServiceIcon sx={{ width: 14, height: 14 }} />
                Choose Service
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default FilterHeader;
