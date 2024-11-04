"use client";
import { Person } from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Avatar,
  Box,
  FormControlLabel,
  TableFooter,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Popover from "@mui/material/Popover";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import { formatHoursToHHMM } from "components/sn-time-tracking/components/helper";
import {
  EmployeeTimeSheetRowData,
  IFormattedDate,
  WeeklyHours,
} from "components/sn-time-tracking/components/timeTracking.types";
import PinActiveIcon from "icons/PinActiveIcon";
import PinIcon from "icons/PinIcon";
import _ from "lodash";
import moment from "moment";
import React, { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "store/app/selectors";
import { RootState } from "store/configureStore";
import { GetMyTimeSheetQueries } from "store/timeTracking/actions";
import { CompanyTimeSheet, MyTimeSheet } from "store/timeTracking/reducer";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import {
  setAvatar,
  setIsOpen,
  setUserName,
} from "store/userNavigationDetail/reducer";
import { inter } from "../CalendarTracking.styles";
import EmployeesTableSheet from "./EmployeesTableSheet";
import {
  tableCellDataStyles,
  trackingTableCellStyles,
} from "./TrackingTable.styles";
import useBreakpoint from "hooks/useBreakpoint";
import MobileTableSheet from "./MobileTableSheet";

interface IProps {
  dateRange: Date[];
  data: CompanyTimeSheet[];
}

const createRowData = (
  fullname: string,
  avatar: string,
  timesheet: MyTimeSheet[],
  id: string,
  is_pin: string,
): EmployeeTimeSheetRowData => {
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
  };
};

const TableSheet: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector(
    (state: RootState) => state.userNavigationDetail,
  );

  const { isSmSmaller } = useBreakpoint();

  const [userData, setUserData] = useState<CompanyTimeSheet[]>([]);
  const [filterUserData, setFilterUserData] = useState<CompanyTimeSheet[]>([]);
  const [userFilterDataDetail, setUserFilterDataDetail] =
    useState<CompanyTimeSheet | null>(null);
  const [rows, setRows] = useState<EmployeeTimeSheetRowData[]>([]);
  const [totalHoursPerDayState, setTotalHoursPerDayState] = useState<{
    sun: number;
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
  }>({ sun: 0, mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0 });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchUser, setSearchUser] = useState(() => {
    return userData.map((item) => ({
      fullname: item.fullname,
      avatar: item?.avatar,
    }));
  });
  const { onPinTimeSheet, onGetCompanyTimeSheet, isIdle } = useGetMyTimeSheet();
  const { onAddSnackbar } = useSnackbar();
  const [inputSearchData, setInputSearchData] = useState("");
  const open = Boolean(anchorEl);

  const formattedDates: IFormattedDate[] = useMemo(() => {
    return props.dateRange.map((date) => ({
      day: moment(date).format("ddd"),
      date: moment(date).format("DD MMM"),
    }));
  }, [props.dateRange]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchUser = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.toLowerCase(); // Convert input to lowercase for case-insensitive search
    setInputSearchData(inputValue);

    if (userData) {
      const searchUser = userData.filter((user) =>
        user.fullname.toLowerCase().includes(inputValue),
      );
      setFilterUserData(searchUser);
    }
  };

  const handleGetUserDetail = (
    username: string,
    avatar: string,
    id: string,
  ) => {
    dispatch(setUserName(username));
    dispatch(setAvatar(avatar));
    dispatch(setIsOpen(true));

    const filteredUser = props.data.filter((user) => user.id === id);
    if (filteredUser) {
      setUserFilterDataDetail(filteredUser[0]);
    }
  };

  const handlePinEmployee = (
    event: React.MouseEvent<HTMLButtonElement>,
    user: EmployeeTimeSheetRowData,
  ) => {
    event.stopPropagation();

    const queries: GetMyTimeSheetQueries = {
      start_date: moment(props.dateRange[0]).format("YYYY-MM-DD"),
      end_date: moment(props.dateRange[props.dateRange.length - 1]).format(
        "YYYY-MM-DD",
      ),
      search_key: "",
    };

    onPinTimeSheet({
      id: user.id,
      is_pin: !user.is_pin,
      type: "USER",
    })
      .then(() => {
        onGetCompanyTimeSheet(queries);
        onAddSnackbar(
          `${user?.is_pin ? "Unpin" : "Pin"} timesheet success`,
          "success",
        );
      })
      .catch(() => {
        onAddSnackbar(
          `${user?.is_pin ? "Unpin" : "Pin"} timesheet fail`,
          "error",
        );
      });
  };

  const _renderTableBody = () => {
    const convertObjectToArray = !_.isEmpty(rows) ? Object.values(rows) : rows;

    const sortedByDate = convertObjectToArray.sort((a, b) => {
      const dateA = new Date(a.is_pin ?? 0);
      const dateB = b ? new Date(b.is_pin ?? 0) : null;
      if (dateB)
        return (dateB as unknown as number) - (dateA as unknown as number);
      return -1;
    });

    const sortedByPin = sortedByDate.sort((_a, b) => (b && b.is_pin ? 1 : -1));
    return (
      <TableBody>
        {_.map(sortedByPin, (row) => (
          <TableRow key={row.id}>
            <TableCell
              sx={{
                ...tableCellDataStyles,
                fontFamily: "unset",
                display: "flex",
                gap: "8px",
                alignItems: "center",
                borderRight: "1px solid #EBEAF2",
                cursor: "pointer",
                "&:hover": {
                  ".pin_project": {
                    visibility: "visible",
                  },
                },
              }}
              onClick={() =>
                handleGetUserDetail(row.fullname, row.avatar, row.id)
              }
            >
              {row.avatar ? (
                <Avatar src={`${row.avatar}`} sx={{ width: 20, height: 20 }} />
              ) : (
                <Avatar sx={{ width: 20, height: 20 }}>
                  <Person />
                </Avatar>
              )}
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
                onClick={(e) => handlePinEmployee(e, row)}
              >
                {row.is_pin ? <PinActiveIcon /> : <PinIcon />}
              </IconButton>
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...tableCellDataStyles,
              }}
            >
              {formatHoursToHHMM(row.weeklyHours.sun)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...tableCellDataStyles,
              }}
            >
              {formatHoursToHHMM(row.weeklyHours.mon)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...tableCellDataStyles,
              }}
            >
              {formatHoursToHHMM(row.weeklyHours.tue)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...tableCellDataStyles,
              }}
            >
              {formatHoursToHHMM(row.weeklyHours.wed)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...tableCellDataStyles,
              }}
            >
              {formatHoursToHHMM(row.weeklyHours.thu)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...tableCellDataStyles,
              }}
            >
              {formatHoursToHHMM(row.weeklyHours.fri)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...tableCellDataStyles,
              }}
            >
              {formatHoursToHHMM(row.weeklyHours.sat)}
            </TableCell>
            <TableCell
              align="center"
              sx={{
                ...tableCellDataStyles,
                background: "#D9F0FD",
                color: "neutral.800",
                border: "1px solid #EBEAF2",
                fontWeight: "600",
              }}
            >
              {formatHoursToHHMM(row.totalHours)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    );
  };

  const _renderTableFooter = () => {
    return (
      <TableFooter>
        <TableRow
          sx={{
            background: "#D9F0FD",
            border: "1px solid #EBEAF2",
            "& > td": {
              fontFamily: "unset",
              fontSize: "14px",
              color: "neutral.800",
              fontWeight: "600",
              borderRight: "1px solid #EBEAF2",
              position: "sticky",
              bottom: 0,
              zIndex: 2,
              background: "#D9F0FD",
            },
          }}
        >
          <TableCell align="right">Total</TableCell>
          <TableCell align="center">
            {formatHoursToHHMM(totalHoursPerDayState.sun)}
          </TableCell>
          <TableCell align="center">
            {formatHoursToHHMM(totalHoursPerDayState.mon)}
          </TableCell>
          <TableCell align="center">
            {formatHoursToHHMM(totalHoursPerDayState.tue)}
          </TableCell>
          <TableCell align="center">
            {formatHoursToHHMM(totalHoursPerDayState.wed)}
          </TableCell>
          <TableCell align="center">
            {formatHoursToHHMM(totalHoursPerDayState.thu)}
          </TableCell>
          <TableCell align="center">
            {formatHoursToHHMM(totalHoursPerDayState.fri)}
          </TableCell>
          <TableCell align="center">
            {formatHoursToHHMM(totalHoursPerDayState.sat)}
          </TableCell>
          <TableCell align="center">
            {formatHoursToHHMM(
              Object.values(totalHoursPerDayState).reduce(
                (acc, curr) => acc + curr,
                0,
              ),
            )}
          </TableCell>
        </TableRow>
      </TableFooter>
    );
  };

  const _renderSearchUserPopup = () => {
    return (
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        sx={{
          "& > .MuiPaper-root": {
            borderRadius: "3px 3px 12px 12px",
          },
        }}
      >
        <Box
          sx={{
            p: 1,
            width: "320px",
            maxWidth: "320px",
            padding: "10px 12px",
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

  useEffect(() => {
    if (!userFilterDataDetail) return;

    if (userFilterDataDetail.id) {
      const filteredUser = props.data.filter(
        (user) => user.id === userFilterDataDetail.id,
      );
      if (filteredUser) {
        setUserFilterDataDetail(filteredUser[0]);
      }
    }
  }, [props.data, props.dateRange, userFilterDataDetail]);

  useEffect(() => {
    setUserData(props.data);
  }, [props.data]);

  useEffect(() => {
    const calculateRowsAndTotals = () => {
      const rows =
        filterUserData.length === 0
          ? userData.map((user) =>
              createRowData(
                user.fullname,
                user?.avatar,
                user.timesheet,
                user.id,
                user.is_pin as string,
              ),
            )
          : filterUserData.map((user) =>
              createRowData(
                user.fullname,
                user.avatar,
                user.timesheet,
                user.id,
                user.is_pin as string,
              ),
            );

      const totalHoursPerDay = rows.reduce(
        (acc, row) => {
          acc.sun += row.weeklyHours.sun;
          acc.mon += row.weeklyHours.mon;
          acc.tue += row.weeklyHours.tue;
          acc.wed += row.weeklyHours.wed;
          acc.thu += row.weeklyHours.thu;
          acc.fri += row.weeklyHours.fri;
          acc.sat += row.weeklyHours.sat;
          return acc;
        },
        { sun: 0, mon: 0, tue: 0, wed: 0, thu: 0, fri: 0, sat: 0 },
      );

      setRows(rows);
      setTotalHoursPerDayState(totalHoursPerDay);
    };

    calculateRowsAndTotals();
  }, [filterUserData, userData]);

  useEffect(() => {
    setSearchUser(
      userData.map((item) => ({
        fullname: item.fullname,
        avatar: item?.avatar,
      })),
    );
  }, [userData]);

  if (isOpen) {
    // Detail timesheet of user
    return (
      <EmployeesTableSheet
        employeeDataDetail={userFilterDataDetail}
        formattedDates={formattedDates}
      />
    );
  }

  return (
    <>
      {isOpen === false && !isSmSmaller ? (
        <TableContainer
          sx={{
            height: "100%",
            overflow: "auto",
            borderRadius: "12px",
            border: "1px solid #EBEAF2",
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
                    maxWidth: "356px",
                    width: "356px",
                  }}
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
                      <IconButton
                        sx={
                          {
                            // padding: "16px",
                          }
                        }
                        aria-controls={open ? "basic-menu" : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? "true" : undefined}
                        onClick={handleClick}
                      >
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
                {formattedDates.map((date, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      ...trackingTableCellStyles,
                      background: "#14B9E5",
                      border: "1px solid #EBEAF2",
                      color: "white",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "inherit",
                        fontWeight: "600",
                        fontSize: "inherit",
                        textTransform: "uppercase",
                      }}
                    >
                      {date.day}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "inherit",
                        fontWeight: "600",
                        fontSize: "inherit",
                      }}
                    >
                      {date.date}
                    </Typography>
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{
                    ...trackingTableCellStyles,
                    background: "#D9F0FD",
                    color: "neutral.800",
                    border: "1px solid #EBEAF2",
                    fontWeight: "700",
                    fontFamily: "unset",
                  }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            {_renderTableBody()}
            {_renderTableFooter()}
          </Table>
        </TableContainer>
      ) : (
        <MobileTableSheet
          setUserFilterDataDetail={setUserFilterDataDetail}
          data={props.data}
          dateRange={props.dateRange}
        />
      )}
    </>
  );
};

export default TableSheet;
