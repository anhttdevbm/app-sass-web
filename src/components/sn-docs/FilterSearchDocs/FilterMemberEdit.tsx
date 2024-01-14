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
} from "@mui/material";
import React, { memo, useState } from "react";
import { FilterSearchDocsProps } from "./FilterSearchDocs";
import { Select, Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_DOCS } from "constant/index";
import { useFormik } from "formik";
import { useEmployeeOptions } from "store/company/selectors";
import ChevronIcon from "icons/ChevronIcon";
import CalendarIcon from "icons/CalendarIcon";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from 'dayjs'
const FilterMemberEdit = ({ onChange, queries }: FilterSearchDocsProps) => {
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedOption, setSelectedOption] = useState<any>("option1");

  const handleRadioChange = (value) => {
    setSelectedOption(value);
  };

  const commonT = useTranslations(NS_COMMON);

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

  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={sxConfig.item}
      >
        <Text variant="body2" color="grey.400">
          {docsT("filter.filter.lastEdited")}
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
          onClick={() => handleRadioChange("option1")}
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
            checked={selectedOption === "option1"}
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
              key={index}
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
          }}
        >
          <Radio value="option1" name="radio-buttons" />
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
                padding: "5px",
              },
            }}
            defaultValue={dayjs(new Date())}
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
            sx={{ width: "50%", marginRight: "8px" }}
            color="primary"
          >
            Hủy
          </Button>
          <Button variant="contained" sx={{ width: "50%" }} color="primary">
            Tìm kiếm
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default memo(FilterMemberEdit);
const sxConfig = {
  input: {
    height: 56,
  },
  item: {
    width: "100%",
    py: 1,
    px: 2,
  },
};

const daytimes = [
  { name: "Last Hour" },
  { name: "Today" },
  { name: "1 day ago" },
  { name: "This week" },
  { name: "Last week" },
  { name: "1 week ago" },
  { name: "This month" },
  { name: "Last month" },
  { name: "1 month ago" },
  { name: "This quarter" },
  { name: "Last quarter" },
  { name: "3 month ago" },
  { name: "This year" },
  { name: "Last year" },
  { name: "1 year ago" },
];
