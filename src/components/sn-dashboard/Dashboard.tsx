"use client"

import { Box, Stack, Typography } from "@mui/material";
import DragMatrixIcon from "icons/DagMatrixIcon";
import StatOverview from "./StatOverview";
import ActiveProjectsTable from "./components/ActiveProjectsTable";
import EmployeeTable from "./components/EmployeeTable";
import FeedLog from "./components/FeedLog";
import { MyTaskTable } from "./components/MyTaskTable";
import { StatAccordion } from "./components/StatAccordion";


function Dashboard() {
  return (
    <Box paddingLeft={1.5} paddingRight={1.5} height='100%'>
      <Stack padding={4} spacing={2} borderRadius={1.5} bgcolor={"white"} height='100%'>
        <StatOverview />
        <Stack spacing={1.5} direction='row'>
          <StatAccordion summaryChild={"Feed"} >
            <FeedLog />
          </StatAccordion>

          <StatAccordion
            summaryChild={
              <Stack direction='row' spacing={1} width='100%'>
                <DragMatrixIcon />
                <Typography fontWeight={600}>Employee</Typography>
              </Stack>
            }
          >
            <EmployeeTable />
          </StatAccordion>
        </Stack>
        <Stack direction='row' spacing={1.5} width='100%'>
          <Stack spacing={1.5} width='50%'>
            {/* <StatAccordion
            summaryChild={
              <Stack direction='row' spacing={1} width='100%'>
                <DragMatrixIcon />
                <Typography fontWeight={600}>Activity</Typography>
              </Stack>
            }
          >
            <Stack direction='row' alignItems='center' justifyContent='center' padding={2}>
              <LineChart />
            </Stack>
          </StatAccordion> */}
            <StatAccordion
              summaryChild={
                <Stack direction='row' spacing={1} width='100%'>
                  <DragMatrixIcon />
                  <Typography fontWeight={600}>My Task</Typography>
                </Stack>
              }
            >
              <MyTaskTable />
            </StatAccordion>
            {/* <StatAccordion
            summaryChild={
              <Stack direction='row' spacing={1} width='100%'>
                <DragMatrixIcon />
                <Typography fontWeight={600}>Out of office today</Typography>
              </Stack>
            }
          ></StatAccordion> */}
          </Stack>
          <Stack spacing={1.5} width='50%'>
            <StatAccordion
              summaryChild={
                <Stack direction='row' spacing={1} width='100%'>
                  <DragMatrixIcon />
                  <Typography fontWeight={600}>Active Projects</Typography>
                </Stack>
              }
            >
              <ActiveProjectsTable />
            </StatAccordion>
            {/* <StatAccordion
            summaryChild={
              <Stack direction='row' spacing={1} width='100%'>
                <DragMatrixIcon />
                <Typography fontWeight={600}>Time Off</Typography>
              </Stack>
            }
          >
            <TimeOffTable />
          </StatAccordion> */}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}

export default Dashboard