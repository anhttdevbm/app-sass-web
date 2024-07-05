"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, memo } from "react";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import dayjs from "dayjs";

import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Box,
  Avatar,
  IconButton,
  Stack,
  CircularProgress,
} from "@mui/material";
import PinActiveIcon from "icons/PinActiveIcon";
import PinIcon from "icons/PinIcon";
import { useSnackbar } from "store/app/selectors";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { NS_TIME_TRACKING } from "constant/index";

interface IProps {
  data: any[];
  filters: any;
  dateRange: any;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  borderLeft: `1px solid ${theme.palette.divider}`,
  borderRight: `1px solid ${theme.palette.divider}`,
  borderTop: `1px solid ${theme.palette.divider}`,
  padding: theme.spacing(1),
  textAlign: "center",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "& > *": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
    textAlign: "center",
  },
}));

const weekdays = ["SUN", "MON", "TUE", "WEB", "THU", "FRI", "SAT"];

const TimeSheet: React.FC<IProps> = ({ data, filters, dateRange }) => {
  const isGetLoading = false;
  const { isDarkMode } = useTheme();
  const timeT = useTranslations(NS_TIME_TRACKING);
  const [totalEachRows, setTotalEachRows] = useState<{ [key: string]: number }>(
    {},
  );

  const { onAddSnackbar } = useSnackbar();
  const { onPinTimeSheet, onGetCompanyTimeSheet, params } = useGetMyTimeSheet();

  const [totalWeek, setTotalWeek] = useState<number>(0);
  const [weeklyTotals, setWeeklyTotals] = useState<Map<string, number>>(
    new Map<string, number>(),
  );

  const formatDuration = (durationInMinutes: number): string => {
    const hours = Math.floor(durationInMinutes);
    const minutes = Math.floor((durationInMinutes % 1) * 60);
    const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return formattedDuration;
  };

  useEffect(() => {
    if (data) {
      const newTotal = { ...totalEachRows };
      let totalWeek = 0;
      const totalByDate = new Map<string, number>();
      _.forEach(data, (user) => {
        let totalUserLog = 0;
        _.forEach(user?.timesheet, (timesheet) => {
          const day = dayjs(timesheet.day).format("ddd")?.toUpperCase();
          const duration = timesheet.duration;
          if (totalByDate.has(day)) {
            totalByDate.set(day, totalByDate.get(day) + duration);
          } else {
            totalByDate.set(day, duration);
          }
          totalUserLog += timesheet?.duration || 0;
        });
        newTotal[`${user.id}`] = totalUserLog;
        totalWeek += totalUserLog;
      });
      setWeeklyTotals(totalByDate);
      setTotalWeek(totalWeek);
      setTotalEachRows(newTotal);
    }
  }, [data]);

  const _renderTableBody = () => {
    const convertObjectToArray = !_.isEmpty(data) ? Object.values(data) : data;

    const sortedByDate = convertObjectToArray?.sort((a, b) => {
      const dateA = new Date(a.is_pin);
      const dateB = b ? new Date(b.is_pin ?? 0) : null;
      if (dateB)
        return (dateB as unknown as number) - (dateA as unknown as number);
      return -1;
    });

    const sortedByPin = sortedByDate?.sort((_a: any, b: any) =>
      b && b.is_pin ? 1 : -1,
    );

    return (
      <TableBody sx={{ position: "relative" }}>
        {!_.isEmpty(sortedByPin) && !_.isEmpty(data) ? (
          _.map(sortedByPin, (user: any, userIndex) => {
            return (
              <StyledTableRow key={user.id || userIndex}>
                <StyledTableCell sx={{ minWidth: 50 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      justifyContent: "flex-start",
                      mb: "12px",
                      py: 1,
                      "&:hover": {
                        ".pin_project": {
                          visibility: "visible",
                        },
                      },
                    }}
                  >
                    <Avatar
                      sx={{ width: 20, height: 20, objectFit: "cover" }}
                      src={user?.avatar?.link}
                    />
                    <Typography
                      sx={{
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontWeight: 600,
                        maxWidth: "200px",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        WebkitLineClamp: 1,
                      }}
                    >
                      {user.fullname}
                    </Typography>
                    <IconButton
                      className="pin_project"
                      sx={{
                        ml: "auto",
                        width: 24,
                        height: 24,
                        visibility: user?.is_pin ? "visible" : "hidden",
                      }}
                      onClick={() => {
                        onPinTimeSheet({
                          id: user?.id,
                          is_pin: user?.is_pin ? !user?.is_pin : true,
                          type: "USER",
                        })
                          .then(() => {
                            onGetCompanyTimeSheet({ ...params });
                            onAddSnackbar(
                              `${
                                user?.is_pin ? "Unpin" : "Pin"
                              } timesheet success`,
                              "success",
                            );
                          })
                          .catch(() => {
                            onAddSnackbar(
                              `${
                                user?.is_pin ? "Unpin" : "Pin"
                              } timesheet fail`,
                              "error",
                            );
                          });
                      }}
                    >
                      {user?.is_pin ? <PinActiveIcon /> : <PinIcon />}
                    </IconButton>
                  </Box>
                </StyledTableCell>
                <StyledTableCell
                  sx={{
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "18px",
                    color: "#999999",
                    textAlign: "right",
                    mb: "12px",
                    py: 1,
                  }}
                >
                  {totalEachRows[user.id] || 0} giờ
                </StyledTableCell>
                {_.map(weekdays, (weekday, _index: number) => {
                  const entries = user?.timesheet?.filter(
                    (entry: any) =>
                      dayjs(entry.day).day() === weekdays.indexOf(weekday),
                  );

                  const totalDuration = entries?.reduce(
                    (total: any, entry: any) => total + entry.duration,
                    0,
                  );

                  return (
                    <StyledTableCell
                      key={`${user.id}-${weekday}`}
                      sx={{
                        fontSize: "14px",
                        lineHeight: "18px",
                        fontWeight: 600,
                        color: "#999999",
                        textAlign: "left",
                        mb: "12px",
                        py: 1,
                        background:
                          _index === 0 || _index === _.size(weekdays) - 1
                            ? isDarkMode
                              ? "inherit"
                              : "#FAFAFA"
                            : "inherit",
                      }}
                    >
                      {formatDuration(totalDuration)}
                    </StyledTableCell>
                  );
                })}
              </StyledTableRow>
            );
          })
        ) : (
          <StyledTableRow>
            <StyledTableCell colSpan={8}>
              <Typography
                sx={{
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 400,
                  textAlign: "center",
                }}
              >
                 {timeT("header.noData")}
              </Typography>
            </StyledTableCell>
          </StyledTableRow>
        )}
        {isGetLoading && (
          <Box
            sx={{
              position: "absolute",
              width: 1,
              height: 1,
              top: 0,
              left: 0,
              backgroundColor: " rgba(0, 0, 0, 0.1)",

              webkitTapHighlightColor: "transparent",
            }}
          >
            <Stack
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 1,
                width: 1,
              }}
            >
              <CircularProgress />
            </Stack>
          </Box>
        )}
      </TableBody>
    );
  };

  const renderMain = () => {
    return (
      <TableContainer
        sx={{
          height: `calc(100vh - 380px)`,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell>
                <Typography
                  sx={{
                    fontSize: "13px",
                    fontWeight: 400,
                    lineHeight: "18px",
                    textAlign: "center",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  {timeT("myTime.timesheet_tab.weekly_summary")}
                </Typography>
              </StyledTableCell>
              <StyledTableCell>
                <Box
                  sx={{
                    mb: "12px",
                    py: 1,
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "10px",
                      fontWeight: 400,
                      lineHeight: "18px",
                      textTransform: "uppercase",
                      textAlign: "center",
                    }}
                  >
                    {timeT("myTime.timesheet_tab.total")}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: 600,
                      lineHeight: "20px",
                      textTransform: "uppercase",
                      color: "#1BC5BD",
                      textAlign: "center",
                    }}
                  >
                    {formatDuration(totalWeek || 0)}
                  </Typography>
                </Box>
              </StyledTableCell>
              {dateRange?.map((date, index) => {
                const weekday = weekdays[date.getDay()];
                const dayNumber = date.getDate();
                return (
                  <StyledTableCell key={date}>
                    <Box
                      sx={{
                        mb: "12px",
                        py: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "10px",
                          fontWeight: 400,
                          lineHeight: "18px",
                          textTransform: "uppercase",
                          textAlign: "left",
                        }}
                      >
                        {`${weekday} ${dayNumber}`}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "16px",
                          fontWeight: 600,
                          lineHeight: "20px",
                          textTransform: "uppercase",
                          color: isDarkMode ? "#fff" : "#212121",
                          textAlign: "left",
                        }}
                      >
                        {formatDuration(weeklyTotals?.get(weekday) || 0)}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          {_renderTableBody()}
        </Table>
      </TableContainer>
    );
  };

  return renderMain();
};

export default memo(TimeSheet);
