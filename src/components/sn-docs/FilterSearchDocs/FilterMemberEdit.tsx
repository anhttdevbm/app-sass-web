/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  MenuItem,
  MenuList,
  Popover,
  Radio,
  Stack,
  Button,
  Typography,
  popoverClasses,
  SxProps,
} from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import { FilterSearchDocsProps } from "./FilterSearchDocs";
import { Select, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_DOCS } from "constant/index";
import { useFormik } from "formik";
import { useEmployeeOptions } from "store/company/selectors";
import ChevronIcon from "icons/ChevronIcon";
import CalendarIcon from "icons/CalendarIcon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useSearchParams } from "next/navigation";
import useQueryParams from "hooks/useQueryParams";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { useDispatch } from "react-redux";
import { updateFilterTimeDoc } from "store/docs/reducer";
import { getCurrentQuarter, getLastQuarter } from "utils/index";
import isoWeek from "dayjs/plugin/isoWeek";
dayjs.extend(isoWeek);

const FilterMemberEdit = ({ onChange, queries }: FilterSearchDocsProps) => {
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

  const handleSearchDoc = () => {
    handleClose();
    switch (selectedOption) {
      case "alltime":
      case "Today":
        {
          const from = dayjs(new Date()).format("YYYY-MM-DD");
          const to = dayjs(new Date()).format("YYYY-MM-DD");
          onChange("from", [from]);
          onChange("to", [to]);
          dispatch(updateFilterTimeDoc("Today"));
        }
        break;
      case docsT("filter.filter.oneDayAgo"):
        {
          const from = dayjs().subtract(1, "day").format("YYYY-MM-DD");
          const to = dayjs(new Date()).format("YYYY-MM-DD");
          onChange("from", [from]);
          onChange("to", [to]);
          dispatch(updateFilterTimeDoc("1 day ago"));
        }
        break;
      case docsT("filter.filter.thisWeek"):
        {
          const from = dayjs().startOf("isoWeek").format("YYYY-MM-DD");
          const to = dayjs().endOf("isoWeek").format("YYYY-MM-DD");
          onChange("from", [from]);
          onChange("to", [to]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.thisWeek")));
        }
        break;
      case docsT("filter.filter.lastWeek"):
        {
          const startOfLastWeek = dayjs()
            .subtract(1, "week")
            .startOf("isoWeek")
            .format("YYYY-MM-DD");

          const endOfLastWeek = dayjs()
            .subtract(1, "week")
            .endOf("isoWeek")
            .format("YYYY-MM-DD");
          onChange("from", [startOfLastWeek]);
          onChange("to", [endOfLastWeek]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.lastWeek")));
        }
        break;
      case docsT("filter.filter.oneWeekAgo"):
        {
          const startOfLastWeek = dayjs()
            .subtract(1, "week")
            .startOf("isoWeek")
            .format("YYYY-MM-DD");

          const endOfLastWeek = dayjs()
            .subtract(1, "week")
            .endOf("isoWeek")
            .format("YYYY-MM-DD");
          onChange("from", [startOfLastWeek]);
          onChange("to", [endOfLastWeek]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.oneWeekAgo")));
        }
        break;
      case docsT("filter.filter.thisMonth"):
        {
          const startOfThisMonth = dayjs()
            .startOf("month")
            .format("YYYY-MM-DD");

          const endOfThisMonth = dayjs().endOf("month").format("YYYY-MM-DD");

          onChange("from", [startOfThisMonth]);
          onChange("to", [endOfThisMonth]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.thisMonth")));
        }
        break;
      case docsT("filter.filter.lastMonth"):
        {
          const startOfLastMonth = dayjs()
            .subtract(1, "month")
            .startOf("month")
            .format("YYYY-MM-DD");

          const endOfLastMonth = dayjs()
            .subtract(1, "month")
            .endOf("month")
            .format("YYYY-MM-DD");

          onChange("from", [startOfLastMonth]);
          onChange("to", [endOfLastMonth]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.lastMonth")));
        }
        break;
      case docsT("filter.filter.oneMonthAgo"):
        {
          const startOfLastMonth = dayjs()
            .subtract(1, "month")
            .startOf("month")
            .format("YYYY-MM-DD");

          const endOfLastMonth = dayjs()
            .subtract(1, "month")
            .endOf("month")
            .format("YYYY-MM-DD");

          onChange("from", [startOfLastMonth]);
          onChange("to", [endOfLastMonth]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.oneMonthAgo")));
        }
        break;
      case docsT("filter.filter.thisQuarter"):
        {
          const { startOfQuarter, endOfQuarter } = getCurrentQuarter();
          onChange("from", [startOfQuarter]);
          onChange("to", [endOfQuarter]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.thisQuarter")));
        }
        break;
      case docsT("filter.filter.lastQuarter"):
        {
          const { startOfQuarter, endOfQuarter } = getLastQuarter();
          onChange("from", [startOfQuarter]);
          onChange("to", [endOfQuarter]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.lastQuarter")));
        }
        break;
      case docsT("filter.filter.threeMonthAgo"):
        {
          const startDate = dayjs()
            .subtract(3, "month")
            .startOf("month")
            .format("YYYY-MM-DD");
          const endDate = dayjs()
            .subtract(1, "month")
            .endOf("month")
            .format("YYYY-MM-DD");
          onChange("from", [startDate]);
          onChange("to", [endDate]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.threeMonthAgo")));
        }
        break;
        case docsT("filter.filter.thisYear"):
        {
          const startDate = dayjs().startOf('year').format('YYYY-MM-DD');
          const endDate = dayjs().endOf('year').format('YYYY-MM-DD');
          onChange("from", [startDate]);
          onChange("to", [endDate]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.thisYear")));
        }
        break;
        case docsT("filter.filter.lastYear"):
        {
          const lastYear = dayjs().subtract(1, 'year');
          const startOfYear = lastYear.startOf('year').format('YYYY-MM-DD');
          const endOfYear = lastYear.endOf('year').format('YYYY-MM-DD');
          onChange("from", [startOfYear]);
          onChange("to", [endOfYear]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.lastYear")));
        }
        break;
        case docsT("filter.filter.oneYearAgo"):
        {
          const from = dayjs().subtract(1, 'year').startOf('day').format('YYYY-MM-DD');
          const to = dayjs().endOf('day').format('YYYY-MM-DD');
          onChange("from", [from]);
          onChange("to", [to]);
          dispatch(updateFilterTimeDoc(docsT("filter.filter.oneYearAgo")));
        }
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
        sx={sxConfig.item}
      >
        <Text variant="body2" fontWeight={600} color="grey.400">
          {docsT("filter.filter.lastEdited")}:
        </Text>
        <Text variant="body2" fontWeight={600} color="grey.700">
          {docsT("filter.all")}
        </Text>
        <ChevronIcon fontSize="small"></ChevronIcon>
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
            defaultValue={dayjs(new Date())}
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
            defaultValue={dayjs().subtract(30, "day")}
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
const sxConfig: Record<string, SxProps> = {
  input: {
    height: 56,
  },
  item: {
    width: "100%",
    py: 1,
    px: 2,
    gap: 1,
    border: "solid 1px lightgrey",
    borderRadius: "2rem",
    bgcolor: "white",
  },
};
