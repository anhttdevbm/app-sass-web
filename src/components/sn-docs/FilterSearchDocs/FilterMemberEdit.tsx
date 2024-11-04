/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  ButtonBase,
  MenuItem,
  Popover,
  popoverClasses,
  Radio,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import useQueryParams from "hooks/useQueryParams";
import ChevronIcon from "icons/ChevronIcon";
import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";
import { useEmployeeOptions } from "store/company/selectors";
import { updateFilterTimeDoc } from "store/docs/reducer";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getCurrentQuarter, getLastQuarter } from "utils/index";
import { FilterSearchDocsProps } from "./FilterSearchDocs";
import { filterTextStyles, sxConfig } from "./styles";
dayjs.extend(isoWeek);

const FilterMemberEdit = ({
  onChange,
}: Omit<FilterSearchDocsProps, "queries">) => {
  const docsT = useTranslations(NS_DOCS);
  const selectedfilterTimeDocStore = useAppSelector(
    (state) => state.doc.selectedFilterTimeDoc,
  );
  const { query } = useQueryParams();
  const dispatch = useAppDispatch();
  const daytimes = [
    { name: docsT("filter.filter.lastHour") },
    { name: docsT("filter.filter.today") },
    { name: docsT("filter.filter.oneDayAgo") },
    { name: docsT("filter.filter.thisWeek") },
    { name: docsT("filter.filter.lastWeek") },
    { name: docsT("filter.filter.oneWeekAgo") },
    { name: docsT("filter.filter.thisMonth") },
    { name: docsT("filter.filter.lastMonth") },
    { name: docsT("filter.filter.oneMonthAgo") },
    { name: docsT("filter.filter.thisQuarter") },
    { name: docsT("filter.filter.lastQuarter") },
    { name: docsT("filter.filter.threeMonthAgo") },
    { name: docsT("filter.filter.thisYear") },
    { name: docsT("filter.filter.lastYear") },
    { name: docsT("filter.filter.oneYearAgo") },
  ];
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedOption, setSelectedOption] = useState<string>(
    selectedfilterTimeDocStore,
  );

  const handleRadioChange = (value: string) => {
    setSelectedOption(value);
  };

  const [startDatePicker, setStartDatePicker] = useState<dayjs.Dayjs | null>(
    dayjs().subtract(30, "day"),
  );
  const [endDatePicker, setEndDatePicker] = useState<dayjs.Dayjs | null>(
    dayjs(new Date()),
  );

  const {
    options: employeeOptions,
    onGetOptions,
    isFetching,
    filters,
    pageSize,
    pageIndex,
    totalPages,
  } = useEmployeeOptions();

  const onChangeSearch = (name: string, newValue?: string | number) => {
    onGetOptions({ pageIndex: 1, pageSize: 20, [name]: newValue });
  };

  const onGetEmployeeOptions = () => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  };

  const onEndReached = () => {
    if (isFetching || (totalPages && pageIndex >= totalPages)) return;
    onGetOptions({ ...filters, pageSize, pageIndex: pageIndex + 1 });
  };

  const options = [
    {
      label: "none",
      value: "",
    },
    ...employeeOptions,
  ];

  const handleStartDatePickerChange = (date: dayjs.Dayjs | null) => {
    setStartDatePicker(date);
  };

  const handleEndDatePickerChange = (date: dayjs.Dayjs | null) => {
    setEndDatePicker(date);
  };

  const handleSearchDoc = () => {
    handleClose();
    switch (selectedOption) {
      case "alltime":
      case "Today":
        {
          const from = dayjs(new Date()).toISOString();
          const to = dayjs(new Date()).toISOString();
          onChange({
            from,
            to,
          });
          dispatch(updateFilterTimeDoc("Today"));
        }
        break;
      case docsT("filter.filter.oneDayAgo"):
        {
          const from = dayjs().subtract(1, "day").toISOString();
          const to = dayjs(new Date()).toISOString();
          onChange({
            from,
            to,
          });
          dispatch(updateFilterTimeDoc("1 day ago"));
        }
        break;
      case docsT("filter.filter.thisWeek"):
        {
          const from = dayjs().startOf("isoWeek").toISOString();
          const to = dayjs().endOf("isoWeek").toISOString();
          onChange({
            from,
            to,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.thisWeek")));
        }
        break;
      case docsT("filter.filter.lastWeek"):
        {
          const startOfLastWeek = dayjs()
            .subtract(1, "week")
            .startOf("isoWeek")
            .toISOString();

          const endOfLastWeek = dayjs()
            .subtract(1, "week")
            .endOf("isoWeek")
            .toISOString();
          console.log("startOfLastWeek", startOfLastWeek);
          console.log("endOfLastWeek", endOfLastWeek);

          onChange({
            from: startOfLastWeek,
            to: endOfLastWeek,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.lastWeek")));
        }
        break;
      case docsT("filter.filter.oneWeekAgo"):
        {
          const startOfLastWeek = dayjs()
            .subtract(1, "week")
            .startOf("isoWeek")
            .toISOString();

          const endOfLastWeek = dayjs()
            .subtract(1, "week")
            .endOf("isoWeek")
            .toISOString();
          onChange({
            from: startOfLastWeek,
            to: endOfLastWeek,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.oneWeekAgo")));
        }
        break;
      case docsT("filter.filter.thisMonth"):
        {
          const startOfThisMonth = dayjs().startOf("month").toISOString();

          const endOfThisMonth = dayjs().endOf("month").toISOString();

          onChange({
            from: startOfThisMonth,
            to: endOfThisMonth,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.thisMonth")));
        }
        break;
      case docsT("filter.filter.lastMonth"):
        {
          const startOfLastMonth = dayjs()
            .subtract(1, "month")
            .startOf("month")
            .toISOString();

          const endOfLastMonth = dayjs()
            .subtract(1, "month")
            .endOf("month")
            .toISOString();
          onChange({
            from: startOfLastMonth,
            to: endOfLastMonth,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.lastMonth")));
        }
        break;
      case docsT("filter.filter.oneMonthAgo"):
        {
          const startOfLastMonth = dayjs()
            .subtract(1, "month")
            .startOf("month")
            .toISOString();

          const endOfLastMonth = dayjs()
            .subtract(1, "month")
            .endOf("month")
            .toISOString();
          onChange({
            from: startOfLastMonth,
            to: endOfLastMonth,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.oneMonthAgo")));
        }
        break;
      case docsT("filter.filter.thisQuarter"):
        {
          const { startOfQuarter, endOfQuarter } = getCurrentQuarter();
          onChange({
            from: startOfQuarter,
            to: endOfQuarter,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.thisQuarter")));
        }
        break;
      case docsT("filter.filter.lastQuarter"):
        {
          const { startOfQuarter, endOfQuarter } = getLastQuarter();
          onChange({
            from: startOfQuarter,
            to: endOfQuarter,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.lastQuarter")));
        }
        break;
      case docsT("filter.filter.threeMonthAgo"):
        {
          const startDate = dayjs()
            .subtract(3, "month")
            .startOf("month")
            .toISOString();
          const endDate = dayjs()
            .subtract(1, "month")
            .endOf("month")
            .toISOString();
          onChange({
            from: startDate,
            to: endDate,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.threeMonthAgo")));
        }
        break;
      case docsT("filter.filter.thisYear"):
        // {
        //   const startDate = dayjs().startOf("year").toISOString();
        //   const endDate = dayjs().endOf("year").toISOString();
        //   onChange("from", [startDate]);
        //   onChange("to", [endDate]);
        //   dispatch(updateFilterTimeDoc(docsT("filter.filter.thisYear")));
        // }
        break;
      case docsT("filter.filter.lastYear"):
        // {
        //   const lastYear = dayjs().subtract(1, "year");
        //   const startOfYear = lastYear.startOf("year").toISOString();
        //   const endOfYear = lastYear.endOf("year").toISOString();
        //   onChange("from", [startOfYear]);
        //   onChange("to", [endOfYear]);
        //   dispatch(updateFilterTimeDoc(docsT("filter.filter.lastYear")));
        // }
        break;
      case docsT("filter.filter.oneYearAgo"):
        {
          const from = dayjs().subtract(1, "year").startOf("day").toISOString();
          const to = dayjs().endOf("day").toISOString();
          onChange({
            from,
            to,
          });
          dispatch(updateFilterTimeDoc(docsT("filter.filter.oneYearAgo")));
        }
        break;
      case "custom":
        const from = startDatePicker?.toISOString();
        const to = endDatePicker?.toISOString();
        // onChange("from", [from]);
        // onChange("to", [to]);
        dispatch(updateFilterTimeDoc("custom"));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (query.user_id) {
    }
  }, [query.user_id]);

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={{
          ...sxConfig.item,
          paddingRight: "8px !important",
        }}
      >
        <Text
          sx={{
            ...filterTextStyles,
            opacity: 0.5,
          }}
        >
          {docsT("filter.filter.lastEdited")}:
        </Text>
        <Text
          sx={{
            ...filterTextStyles,
            pr: "40px",
          }}
        >
          {docsT("filter.all")}
        </Text>
        <Box
          sx={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "18px",
            height: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: "0.2px",
            borderStyle: "solid",
            borderColor: "#5C5C5C",
            borderRadius: "100%",
            pointerEvents: "none",
          }}
        >
          <ChevronIcon />
        </Box>
      </MenuItem>
      <Popover
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 600,
            maxWidth: 450,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              mt: 0.5,
            },
          },
        }}
      >
        <Box
          sx={{
            borderBottom: "1px solid",
            borderBottomColor: "grey.100",
            padding: "16px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h6">Last Edited</Typography>
        </Box>

        <Box
          sx={{
            padding: "10px",
            display: "flex",
            alignItems: "center",
            borderBottom: "1px solid",
            borderBottomColor: "grey.100",
          }}
          onClick={() => handleRadioChange("alltime")}
        >
          <Radio
            sx={{
              "&.Mui-checked": {
                color: "#1BC5BD", // Màu xanh khi được chọn
                "&.Mui-disabled": {
                  color: "#1BC5BD", // Màu xanh khi bị vô hiệu hóa (nếu cần)
                },
              },
            }}
            name="radio-buttons"
            checked={selectedOption === "alltime"}
          />
          <Typography>All time</Typography>
        </Box>

        <Box
          sx={{
            padding: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
          }}
        >
          {daytimes?.map((item, index) => (
            <Box
              key={item.name ?? index}
              sx={{
                display: "flex",
                alignItems: "center",
                width: "30%",
                marginBottom: "10px", // Add margin to create spacing between rows
              }}
              onClick={() => handleRadioChange(item.name)}
            >
              <Radio
                sx={{
                  "&.Mui-checked": {
                    color: "#1BC5BD", // Màu xanh khi được chọn
                    "&.Mui-disabled": {
                      color: "#1BC5BD", // Màu xanh khi bị vô hiệu hóa (nếu cần)
                    },
                  },
                }}
                checked={selectedOption === item.name}
                value={item?.name}
                name="radio-buttons"
              />
              <Typography>{item?.name}</Typography>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            padding: "10px",
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid",
            borderTopColor: "grey.100",
            gap: 2,
          }}
          onClick={() => handleRadioChange("custom")}
        >
          <Radio
            sx={{
              "&.Mui-checked": {
                color: "#1BC5BD", // Màu xanh khi được chọn
                "&.Mui-disabled": {
                  color: "#1BC5BD", // Màu xanh khi bị vô hiệu hóa (nếu cần)
                },
              },
            }}
            name="radio-buttons"
            checked={selectedOption === "custom"}
          />
          <Typography sx={{ display: "flex", alignItems: "center" }}>
            Custom{" "}
          </Typography>
          <DatePicker
            sx={{
              width: "160px",
              marginLeft: "5px",
              [`& .MuiInputBase-root`]: {
                gap: 1,
              },
              "& .MuiOutlinedInput-input": {
                paddingLeft: "10px",
                paddingY: "5px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "9999px",
              },
            }}
            onChange={handleStartDatePickerChange}
            value={startDatePicker}
          />
          <div>-</div>
          <DatePicker
            sx={{
              width: "160px",
              [`& .MuiInputBase-root`]: {
                gap: 1,
              },
              "& .MuiOutlinedInput-input": {
                paddingLeft: "10px",
                paddingY: "5px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                borderRadius: "9999px",
              },
            }}
            onChange={handleEndDatePickerChange}
            value={endDatePicker}
          />
        </Box>

        <Box
          sx={{
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="outlined"
            sx={{
              width: "50%",
              marginRight: "8px",
              color: "primary",
              position: "relative",
              overflow: "hidden",
              border: "1px solid transparent",
              borderRadius: "100px",
              backgroundImage:
                "linear-gradient(white, white), linear-gradient(90deg, rgba(41,242,155,1) 0%, rgba(1,160,250,1) 100%)",
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
              "&:hover": {
                backgroundImage:
                  "linear-gradient(white, white), linear-gradient(90deg, rgba(41,242,155,1) 0%, rgba(1,160,250,1) 100%)",
                border: "1px solid transparent",
              },
            }}
            onClick={handleClose}
          >
            {docsT("button.cancel")}
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "50%",
              borderRadius: "100px",
              background:
                "linear-gradient(90deg, rgba(41,242,155,1) 0%, rgba(1,160,250,1) 100%)",
            }}
            color="primary"
            onClick={handleSearchDoc}
          >
            {docsT("button.search")}
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default memo(FilterMemberEdit);
