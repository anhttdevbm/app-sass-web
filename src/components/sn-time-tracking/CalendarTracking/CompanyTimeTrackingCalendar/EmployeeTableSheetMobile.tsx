import { KeyboardArrowDown } from "@mui/icons-material";
import { Box, MenuItem, Select, Stack, Typography } from "@mui/material";
import { IFormattedDate } from "components/sn-time-tracking/components/timeTracking.types";
import { CompanyTimeSheet } from "store/timeTracking/reducer";
import { inter } from "../CalendarTracking.styles";
import { useEffect, useMemo, useState } from "react";
import { formatHoursToHHMM } from "components/sn-time-tracking/components/helper";
import moment from "moment";

interface IProps {
  formattedDates: IFormattedDate[];
  employeeDataDetail: CompanyTimeSheet | null;
}

interface FilterOptions {
  id: string;
  name: string;
}

export default function EmployeeTableSheetMobile({
  formattedDates,
  employeeDataDetail,
}: IProps) {
  const [selectedDate, setSelectedDate] = useState<string>(
    `${formattedDates[0]?.day},${formattedDates[0]?.date}`,
  );

  const [selectedProject, setSelectedProject] = useState<string>("all");
  const [selectedTask, setSelectedTask] = useState<string>("0");
  const [projectFilterOptions, setProjectFilterOptions] = useState<
    FilterOptions[]
  >([
    {
      id: "all",
      name: "Break time",
    },
  ]);
  const [taskFilterOptions, setTaskFilterOptions] = useState<FilterOptions[]>(
    [],
  );

  const totalTime = useMemo(() => {
    return employeeDataDetail?.timesheet.reduce((pre, cur, index) => {
      const date = `${moment(cur.start_time).format("ddd")},${moment(
        cur.start_time,
      ).format("DD MMM")}`;
      if (
        ((cur.project?.id && cur.project?.id === selectedProject) ||
          (!cur.project?.id && selectedProject === "all")) &&
        date === selectedDate &&
        index === +selectedTask
      ) {
        return pre + (cur.duration || 0);
      }
      return pre;
    }, 0);
  }, [
    employeeDataDetail?.timesheet,
    selectedDate,
    selectedProject,
    selectedTask,
  ]);

  useEffect(() => {
    if (employeeDataDetail) {
      const projectOptions: FilterOptions[] = [];
      employeeDataDetail.timesheet.map((time) => {
        if (time.project) {
          projectOptions.push({
            id: time.project.id,
            name: time.project.name,
          });
        }
      });
      setProjectFilterOptions(projectOptions);
      setTaskFilterOptions(
        employeeDataDetail.timesheet.map((_, index) => {
          return {
            id: index.toString(),
            name: `Task ${index + 1}`,
          };
        }),
      );
    }
  }, [employeeDataDetail]);

  const renderSelectedDate = () => {
    return (
      <Select
        labelId="date-select-label"
        id="date-select"
        value={selectedDate}
        onChange={(event) => {
          setSelectedDate(event.target.value as string);
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
  return (
    <Stack
      sx={{
        borderRadius: "12px",
        border: "1px solid #EFEFEF",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: "#14B9E5",
          paddingX: "12px",
          height: "48px",
        }}
      >
        {renderSelectedDate()}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: "12px",
          height: "48px",
        }}
      >
        <Typography
          sx={{
            fontFamily: inter.style.fontFamily,
            color: "neutral.700",
          }}
        >
          PROJECT
        </Typography>
        <Select
          labelId="date-select-label"
          id="date-select"
          IconComponent={() => <KeyboardArrowDown />}
          value={selectedProject}
          onChange={(event) => {
            setSelectedProject(event.target.value as string);
          }}
          sx={{
            "& fieldset": {
              display: "none",
            },
            height: "100%",
            width: "100%",
            color: "neultra.800",
            fontFamily: inter.style.fontFamily,
            fontWeight: 600,
            "& > div": {
              textAlign: "right",
              paddingRight: "16px !important",
            },
          }}
        >
          {projectFilterOptions.map((project) => (
            <MenuItem key={project.id} value={project.id}>
              {project.name}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingX: "12px",
          borderTop: "1px solid #EFEFEF",
          height: "48px",
        }}
      >
        <Typography
          sx={{
            fontFamily: inter.style.fontFamily,
            color: "neutral.700",
          }}
        >
          TASK
        </Typography>
        <Select
          labelId="date-select-label"
          id="date-select"
          IconComponent={() => <KeyboardArrowDown />}
          value={selectedTask}
          onChange={(event) => {
            setSelectedTask(event.target.value as string);
          }}
          sx={{
            "& fieldset": {
              display: "none",
            },
            height: "100%",
            width: "100%",
            color: "neultra.800",
            fontFamily: inter.style.fontFamily,
            fontWeight: 600,
            "& > div": {
              textAlign: "right",
              paddingRight: "16px !important",
            },
          }}
        >
          {taskFilterOptions.map((task) => (
            <MenuItem key={task.id} value={task.id}>
              {task.name}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingX: "12px",
          borderTop: "1px solid #EFEFEF",
          height: "48px",
        }}
      >
        <Typography
          sx={{
            fontFamily: inter.style.fontFamily,
            color: "neutral.700",
          }}
        >
          Total{" "}
          <Typography
            component="span"
            sx={{
              fontWeight: 700,
            }}
          >
            {formatHoursToHHMM(totalTime || 0)}
          </Typography>
        </Typography>
      </Box>
    </Stack>
  );
}
