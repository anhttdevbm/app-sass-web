import { KeyboardArrowDown, Person } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Popover,
  Select,
  Stack,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  EmployeeTimeSheetRowData,
  IFormattedDate,
  WeeklyHours,
} from "components/sn-time-tracking/components/timeTracking.types";
import PinActiveIcon from "icons/PinActiveIcon";
import PinIcon from "icons/PinIcon";
import SearchIcon from "icons/SearchIcon";
import moment from "moment";
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CompanyTimeSheet,
  MyTimeSheet,
  setAvatar,
  setIsOpen,
  setUserName,
} from "store/timeTracking/reducer";
import { inter } from "../CalendarTracking.styles";
import { trackingTableCellStyles } from "./TrackingTable.styles";

interface IProps {
  dateRange: Date[];
  data: CompanyTimeSheet[];
  setUserFilterDataDetail: (data: CompanyTimeSheet) => void;
}

interface EmployeeTimeSheetMobileRowData extends EmployeeTimeSheetRowData {
  selectedDate: string;
}

export default function MobileTableSheet({
  dateRange,
  data,
  setUserFilterDataDetail,
}: IProps) {
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const [rows, setRows] = useState<EmployeeTimeSheetMobileRowData[]>([]);

  const [filterUserData, setFilterUserData] = useState<CompanyTimeSheet[]>([]);

  const [searchUser, setSearchUser] = useState(() => {
    return data.map((item) => ({
      fullname: item.fullname,
      avatar: item?.avatar,
    }));
  });

  const [inputSearchData, setInputSearchData] = useState("");

  const open = Boolean(anchorEl);
  const formattedDates: IFormattedDate[] = useMemo(() => {
    return dateRange.map((date) => ({
      day: moment(date).format("ddd"),
      date: moment(date).format("DD MMM"),
    }));
  }, [dateRange]);

  const createRowData = useCallback(
    (
      fullname: string,
      avatar: string,
      timesheet: MyTimeSheet[],
      id: string,
      is_pin: string,
    ): EmployeeTimeSheetMobileRowData => {
      const totalHours = timesheet.reduce(
        (acc, curr) => acc + (curr.duration || 0),
        0,
      );
      const weeklyHours: WeeklyHours = {
        sun: 0,
        mon: 0,
        tue: 0,
        wed: 0,
        thu: 0,
        fri: 0,
        sat: 0,
      };

      timesheet.forEach((entry) => {
        const dayOfWeek = moment(entry.day).format("ddd").toLowerCase();
        if (weeklyHours.hasOwnProperty(dayOfWeek)) {
          weeklyHours[dayOfWeek] += entry.duration;
        }
      });

      return {
        fullname,
        avatar,
        id,
        weeklyHours,
        totalHours,
        is_pin,
        selectedDate:
          `${formattedDates[0]?.day},${formattedDates[0]?.date}` || "",
      };
    },
    [formattedDates],
  );

  const handleSearchUser = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    setInputSearchData(inputValue);

    if (data) {
      const searchUser = data.filter((user) =>
        user.fullname.toLowerCase().includes(inputValue),
      );
      setFilterUserData(searchUser);
    }
  };

  const _renderSearchUserPopup = () => {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        id="search-user-popover"
        sx={{
          "& > .MuiPaper-root": {
            borderRadius: "3px 3px 12px 12px",
          },
        }}
        slotProps={{
          paper: {
            sx: {
              width: "100%",
            },
          },
        }}
      >
        <Box
          sx={{
            p: "20px",
          }}
        >
          <TextField
            defaultValue={inputSearchData}
            onChange={handleSearchUser}
            placeholder="Search"
            id="search-input"
            sx={{ width: "100%" }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
              sx: {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderWidth: "2px",
                  borderColor: "#EFEFEF",
                  borderRadius: "100px",
                },
                height: 40,
                fontFamily: "unset",
              },
            }}
          />
        </Box>
        <Box sx={{ paddingBottom: "10px", maxHeight: "50vh" }}>
          {searchUser.map((user, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 12px",
                "&:hover": {
                  backgroundColor: "#D9F0FD",
                },
              }}
            >
              <FormControlLabel
                sx={{
                  margin: 0,
                  width: "100%",
                }}
                control={
                  <Checkbox
                    sx={{
                      color: "#DFE1EF",
                    }}
                  />
                }
                label={
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    {user.avatar ? (
                      <Avatar
                        src={`${user.avatar}`}
                        sx={{ width: 20, height: 20 }}
                      />
                    ) : (
                      <Avatar sx={{ width: 20, height: 20 }}>
                        <Person />
                      </Avatar>
                    )}
                    <Typography
                      sx={{
                        fontFamily: inter.style.fontFamily,
                        fontWeight: "600",
                        fontSize: "13px",
                      }}
                    >
                      {user.fullname}
                    </Typography>
                  </Box>
                }
              />
            </Box>
          ))}
        </Box>
      </Popover>
    );
  };

  const renderSelectedDate = (rowId: string, value: string) => {
    return (
      <Select
        labelId="date-select-label"
        id="date-select"
        value={value}
        onChange={(event) => {
          const selectedDate = event.target.value;
          const updatedRows = rows.map((row) => {
            if (row.id === rowId) {
              return { ...row, selectedDate };
            }
            return row;
          });
          setRows(updatedRows);
        }}
        IconComponent={() => <KeyboardArrowDown />}
        sx={{
          "& fieldset": {
            display: "none",
          },
          height: "100%",
          width: "100%",
          textTransform: "uppercase",
          color: "white",
          fontFamily: inter.style.fontFamily,
        }}
      >
        {formattedDates.map((date) => (
          <MenuItem key={date.date} value={`${date.day},${date.date}`}>
            {date.day}, {date.date}
          </MenuItem>
        ))}
      </Select>
    );
  };

  useEffect(() => {
    setRows(
      data.map((row) =>
        createRowData(
          row.fullname,
          row.avatar,
          row.timesheet,
          row.id,
          row.is_pin || "",
        ),
      ),
    );
  }, [data]);

  const handleGetUserDetail = (
    username: string,
    avatar: string,
    id: string,
  ) => {
    dispatch(setUserName(username));
    dispatch(setAvatar(avatar));
    dispatch(setIsOpen(true));

    const filteredUser = data.filter((user) => user.id === id);
    if (filteredUser) {
      setUserFilterDataDetail(filteredUser[0]);
    }
  };

  const renderBody = () => {
    return (
      <Stack
        gap="20px"
        mt="20px"
        overflow="auto"
        marginBottom="100px"
        flexShrink={0}
      >
        {rows.map((row) => (
          <Stack
            key={row.id}
            sx={{
              borderRadius: "12px",
              border: "1px solid #EFEFEF",
              overflow: "hidden",
            }}
          >
            <Stack
              flexDirection="row"
              height="40px"
              justifyContent="space-between"
            >
              <Box
                sx={{
                  fontFamily: "unset",
                  display: "flex",
                  gap: "8px",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": {
                    ".pin_project": {
                      visibility: "visible",
                    },
                  },
                  flex: 1,
                  borderWidth: "0 1px 1px 0",
                  borderStyle: "solid",
                  borderColor: "#EFEFEF",
                }}
                onClick={() =>
                  handleGetUserDetail(row.fullname, row.avatar, row.id)
                }
              >
                <Box pl="20px">
                  {row.avatar ? (
                    <Avatar
                      src={`${row.avatar}`}
                      sx={{ width: 20, height: 20 }}
                    />
                  ) : (
                    <Avatar sx={{ width: 20, height: 20 }}>
                      <Person />
                    </Avatar>
                  )}
                </Box>
                <Typography
                  sx={{
                    color: "blue.normal",
                    fontWeight: 500,
                    fontSize: "14px",
                    fontFamily: "inherit",
                  }}
                >
                  {row.fullname}
                </Typography>

                <IconButton
                  className="pin_project"
                  sx={{
                    width: 24,
                    height: 24,
                    visibility: row.is_pin ? "visible" : "hidden",
                  }}
                  // onClick={(e) => handlePinEmployee(e, row)}
                >
                  {row.is_pin ? <PinActiveIcon /> : <PinIcon />}
                </IconButton>
              </Box>
              <Box
                sx={{
                  background: "#14B9E5",
                  color: "white",
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {renderSelectedDate(row.id, row.selectedDate)}
              </Box>
            </Stack>

            <Stack
              flexDirection="row"
              height="40px"
              justifyContent="space-between"
              borderBottom="1px solid #EFEFEF"
            >
              <Box
                sx={{
                  flex: 1,
                  justifyContent: "center",
                  borderWidth: "0 1px 0 0",
                  borderStyle: "solid",
                  borderColor: "#EFEFEF",
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "inherit",
                    pl: "10px",
                  }}
                >
                  {row.weeklyHours[
                    row.selectedDate?.split(",")[0].toLowerCase()
                  ]
                    ?.toString()
                    ?.padStart(2, "0")}
                  :00
                </Typography>
              </Box>
            </Stack>

            <Stack
              flexDirection="row"
              height="40px"
              justifyContent="space-between"
            >
              <Box
                sx={{
                  flex: 1,
                  justifyContent: "center",
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "inherit",
                    fontWeight: "600",
                    pl: "10px",
                  }}
                >
                  Total {row.totalHours.toString().padStart(2, "0")}:00
                </Typography>
              </Box>
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  };

  return (
    <Stack overflow="auto">
      <TableContainer
        sx={{
          overflow: "auto",
          borderRadius: "12px",
          border: "1px solid #EBEAF2",
          flexShrink: 0,
        }}
      >
        <Table
          stickyHeader
          style={{
            tableLayout: "fixed",
          }}
          aria-label="sticky table"
        >
          <TableHead>
            <TableRow>
              <TableCell
                sx={{
                  ...trackingTableCellStyles,
                  background: "#0575E6",
                  height: "40px",
                }}
                aria-describedby="search-user-popover"
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "inherit",
                      fontWeight: "600",
                    }}
                  >
                    User
                  </Typography>
                  <Box>
                    <IconButton aria-haspopup="true" onClick={handleClick}>
                      <SearchIcon
                        sx={{
                          color: "white",
                        }}
                      />
                    </IconButton>
                    {inputSearchData.length >= 1 && (
                      <Chip
                        label={inputSearchData.length}
                        sx={{
                          background: "white",
                          color: "#0575E6",
                          height: "18px",
                        }}
                      />
                    )}
                  </Box>
                </Box>
                {_renderSearchUserPopup()}
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
      {renderBody()}
    </Stack>
  );
}
