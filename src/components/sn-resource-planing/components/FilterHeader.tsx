import { Stack } from "@mui/material";
import { Button } from "components/shared";
import Filter from "components/shared/Filter";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
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
import { IBookingAllFitler } from "store/resourcePlanning/action";

interface FilterHeaderProps {
  type: TAB_TYPE;
  setisServicePopup: any;
  setIsWorkload: any;
  tab: String;
  handleChangePosition: (value: string) => void;
  handleChangeWorkingHour: (value: "asc" | "desc") => void;
  bookingAllFilter: IBookingAllFitler;
  isWorkload?: Boolean;
}

const FilterHeader = ({
  type,
  setisServicePopup,
  setIsWorkload,
  tab,
  handleChangePosition,
  handleChangeWorkingHour,
  bookingAllFilter,
  isWorkload,
}: FilterHeaderProps) => {
  const resourceT = useTranslations<string>(NS_RESOURCE_PLANNING);
  const commonT = useTranslations<string>(NS_COMMON);

  const { positionOptions } = useGetOptions();
  const { isSmSmaller } = useBreakpoint();

  const positions = useMemo(() => {
    const result = [...positionOptions];
    result.unshift({
      label: commonT("all"),
      value: "",
    });
    return result;
  }, [positionOptions]);

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
        maxWidth: "100%",
      }}
    >
      <Typography
        sx={{ mr: 2, fontSize: "13px", color: "#4D4D4D", fontWeight: 700 }}
      >
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
        <Typography sx={{ mr: 1, color: "#00000080", fontWeight: 700 }}>
          {resourceT("schedule.filter.position")}:
        </Typography>
        <Filter.Select
          value={
            (bookingAllFilter?.position ||
              DEFAULT_BOOKING_ALL_FILTER.position) as string
          }
          onChange={(event) =>
            handleChangePosition(event.target.value as string)
          }
          label={commonT("position")}
          sx={{
            maxWidth: "200px",
            ".MuiSelect-select": {
              color: "black",
            },
          }}
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
            <Typography sx={{ mr: 1, color: "#00000080", fontWeight: 700 }}>
              {resourceT("schedule.filter.workingHours")}:
            </Typography>
            <Filter.Select
              value={
                (bookingAllFilter?.working_sort ||
                  DEFAULT_BOOKING_ALL_FILTER.working_sort) as string
              }
              onChange={(event) => {
                const value = event.target.value as "asc" | "desc";

                handleChangeWorkingHour(value);
              }}
              label={resourceT("schedule.filter.workingHours")}
              sx={{
                maxWidth: "260px",
                ".MuiSelect-select": {
                  color: "black",
                },
                ".MuiTypography-root": {
                  overflow: "hidden",
                  color: "black",
                  textOverflow: "ellipsis",
                },
              }}
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
                  color: isWorkload ? "#0575E6" : "#00000080",
                  fontWeight: 700,
                  gap: 1,
                  background: isWorkload ? "#D9F0FD" : "",
                  "&.MuiButtonBase-root": {
                    paddingLeft: 2,
                    paddingRight: 2,
                  },
                }}
                onClick={() => setIsWorkload((prev: Boolean) => !prev)}
              >
                <ClockIcon sx={{ width: 14, height: 14 }} />
                {resourceT("schedule.resourceHeader.Workload")}
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
                {resourceT("schedule.resourceHeader.chooseService")}
              </Button>
            </>
          )}
        </>
      )}
    </Box>
  );
};

export default FilterHeader;
