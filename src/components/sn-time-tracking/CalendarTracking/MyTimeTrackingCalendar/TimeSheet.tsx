"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, memo, useMemo } from "react";
import { styled } from "@mui/material/styles";
import _ from "lodash";
import { useSelector } from "react-redux";

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
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import { useSnackbar } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { NS_TIME_TRACKING } from "constant/index";
import useTheme from "hooks/useTheme";

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
  //const dispatch = useTypedDispatch();
  const isGetLoading: any = false;
  const [timeSheets, setTimesheets] = useState<any>([]);
  const timeT = useTranslations(NS_TIME_TRACKING);

  const { isDarkMode } = useTheme();
  const { onAddSnackbar } = useSnackbar();
  const { onPinTimeSheet, onGetMyTimeSheet, params } = useGetMyTimeSheet();
  useEffect(() => {
    if (!_.isEmpty(data)) {
      const transformedData: any = {};
      _.forEach(data, (timesheet) => {
        const { project, day, duration } = timesheet;
        const projectId = project?.id;
        if (!transformedData[projectId]) {
          transformedData[projectId] = {
            weekdays: {},
            totalDuration: 0,
            projectName: project?.name,
            projectId: project?.id,
            avatar: project?.avatar,
            is_pin: timesheet?.is_pin || false,
          };
        }
        const weekdayIndex = new Date(day).getDay();
        const weekday = weekdays[weekdayIndex];
        transformedData[projectId].weekdays[weekday] =
          (transformedData[projectId].weekdays[weekday] || 0) + duration;
        transformedData[projectId].totalDuration += duration || 0;
      });
      // When there is no duration, default value is 0
      _.forEach(weekdays, (weekday) => {
        _.forEach(transformedData, (projectData: any) => {
          if (!projectData.weekdays[weekday]) {
            projectData.weekdays[weekday] = 0;
          }
        });
      });

      setTimesheets(transformedData);
    }
  }, [data]);

  const calculateTotalWeekdays = (weekday: any) => {
    const totalWeekdays: { [key: string]: number } = {};
    _.forEach(timeSheets, (project) => {
      _.forEach(project.weekdays, (value, key) => {
        totalWeekdays[key] = (totalWeekdays[key] || 0) + value;
      });
    });

    return totalWeekdays[weekday] || 0;
  };

  const totalWeek = () => {
    let result = 0;
    _.forEach(timeSheets, (project: any) => {
      result += project.totalDuration;
    }) || 0;
    return result;
  };

  const formatDuration = (durationInMinutes: number): string => {
    const hours = Math.floor(durationInMinutes);
    const minutes = Math.floor((durationInMinutes % 1) * 60);
    const formattedDuration = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    return formattedDuration;
  };

  const filteredProjects = useMemo(() => {
    const convertObjectToArray = !_.isEmpty(timeSheets)
      ? Object.values(timeSheets)
      : timeSheets;
    const sortedByDate = convertObjectToArray?.sort((a: any, b: any) => {
      const dateA = new Date(a.is_pin);
      const dateB = b ? new Date(b.is_pin ?? 0) : null;
      if (dateB)
        return (dateB as unknown as number) - (dateA as unknown as number);
      return -1;
    });

    const sortedByPin = sortedByDate?.sort((_a: any, b: any) =>
      b && b.is_pin ? 1 : -1,
    );

    return sortedByPin?.filter((project: any) =>
      project?.projectName
        ?.toLowerCase()
        ?.includes(filters?.search_key?.trim()?.toLowerCase()),
    );
  }, [timeSheets]);

  // const _renderTableBody = () => {
  //   return (

  //   );
  // };

  const renderMain = () => {
    return (
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <StyledTableCell sx={{ minWidth: 50 }}>
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
                    {totalWeek()}
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
                        {formatDuration(calculateTotalWeekdays(weekday))}
                      </Typography>
                    </Box>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody sx={{ position: "relative" }}>
            {!_.isEmpty(filteredProjects) && !_.isEmpty(data) ? (
              _.map(filteredProjects, (timeSheet: any, index: number) => {
                return (
                  <StyledTableRow key={timeSheet.id || index}>
                    <StyledTableCell sx={{ maxWidth: 235 }}>
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
                          src={timeSheet?.avatar}
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
                          {timeSheet?.projectName}
                        </Typography>
                        <IconButton
                          className="pin_project"
                          sx={{
                            ml: "auto",
                            width: 24,
                            height: 24,
                            visibility: timeSheet?.is_pin
                              ? "visible"
                              : "hidden",
                          }}
                          onClick={() => {
                            onPinTimeSheet({
                              id: timeSheet?.projectId,
                              is_pin: timeSheet?.is_pin ? false : true,
                              type: "PROJECT",
                            })
                              .then(() => {
                                onGetMyTimeSheet({ ...params });
                                onAddSnackbar(
                                  `${
                                    timeSheet?.is_pin ? "Unpin" : "Pin"
                                  } timesheet success`,
                                  "success",
                                );
                              })
                              .catch(() => {
                                onAddSnackbar(
                                  `${
                                    timeSheet?.is_pin ? "Unpin" : "Pin"
                                  } timesheet failed`,
                                  "error",
                                );
                              });
                          }}
                        >
                          {timeSheet?.is_pin ? <PinActiveIcon /> : <PinIcon />}
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
                      {timeSheet?.totalDuration || 0} giờ
                    </StyledTableCell>
                    {_.map(weekdays, (weekday, _index: number) => {
                      const totalDay = timeSheet?.weekdays?.[`${weekday}`];
                      return (
                        <StyledTableCell
                          key={_index}
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
                          {totalDay}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })
            ) : (
              <StyledTableRow>
                <StyledTableCell colSpan={9}>
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
        </Table>
      </TableContainer>
    );
  };

  return renderMain();
};

export default memo(TimeSheet);
