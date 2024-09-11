/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  ButtonBase,
  MenuItem,
  Popover,
  popoverClasses,
  Radio,
  SxProps,
  Typography
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import dayjs from "dayjs";
import ChevronIcon from "icons/ChevronIcon";
import { useTranslations } from "next-intl";
import { memo, useState } from "react";
import { FilterSearchDocsProps } from "./FilterSearchDocs";
const FilterTime = ({ onChange, queries }: FilterSearchDocsProps) => {
  const docsT = useTranslations(NS_DOCS);
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [selectedOption, setSelectedOption] = useState<any>("All");
  const [selectedDate, setSelectedDate] = useState(dayjs(new Date()));

  const handleRadioChange = (value) => {
    setSelectedOption(value);
  };
  const handleDateChange = (newDate) => {
    setSelectedOption("")
    setSelectedDate(newDate);
  };




  const handelSearch = () => {
    const newData = selectedOption || selectedDate.format('YYYY/MM/DD')
    onChange("createTime", newData);
    handleClose();

  }


  return (
    <>
      <MenuItem
        onClick={(e) => setAnchorEl(e.currentTarget)}
        component={ButtonBase}
        sx={sxConfig.item}
      >
        <Text variant="body2" color="grey.400">
          People
        </Text>
        <Text variant="body2" fontWeight={600} color="grey.700">
          {selectedOption ? selectedOption : selectedDate.format('YYYY/MM/DD')}
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
            minWidth: { xs: 350, md: 600 },
            maxWidth: { xs: 350, md: 450, }
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
          onClick={() => handleRadioChange("All")}
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
            checked={selectedOption === "All"}
          />
          <Typography>All time</Typography>
        </Box>

        <Box
          sx={{
            padding: "10px",
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            flexWrap: "wrap",
            flexDirection: { xs: "column", md: "row" }

          }}
        >
          {daytimes?.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                width: { xs: "100%", md: "30%" },
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
            // defaultValue={dayjs(new Date())}
            value={selectedDate}
            onChange={handleDateChange}
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
            onClick={handleClose}
          >
            {docsT("button.cancel")}
          </Button>
          <Button onClick={() => handelSearch()} variant="contained" sx={{ width: "50%" }} color="primary">
            {docsT("button.search")}
          </Button>
        </Box>
      </Popover>
    </>
  );
};

export default memo(FilterTime);
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
