"use client"

import { Box, Stack, Typography } from "@mui/material";
import DragMatrixIcon from "icons/DagMatrixIcon";
import StatOverview from "./StatOverview";
import { StatAccordion } from "./components/StatAccordion";
import { ActiveProjectsTable, MyTaskTable, TimeOffTable } from "./components/Tables";


function Dashboard() {
  return (
    <Box paddingLeft={1.5} paddingRight={1.5} height='100%'>
    <Stack padding={4} spacing={2} borderRadius={1.5} bgcolor={"white"} height='100%'>
      <StatOverview />
      <Stack spacing={1.5} direction='row'>
        <StatAccordion summaryChild={"Feed"} />
        <StatAccordion
          summaryChild={
            <Stack justifyContent='space-between' direction='row' paddingRight={1.5} width='100%'>
              <Typography>Employee</Typography>
              {/* <Button
                sx={{
                  height: "24px",
                  width: "24px",
                  minWidth: 0,
                  borderRadius: "50%",
                  background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  alert("yeah")
                }}
              >
                <AddIcon
                  sx={{
                    color: "white",
                  }}
                /> 
              </Button>*/}
            </Stack>
          }
        />
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
          <StatAccordion
            summaryChild={
              <Stack direction='row' spacing={1} width='100%'>
                <DragMatrixIcon />
                <Typography fontWeight={600}>Time Off</Typography>
              </Stack>
            }
          >
            <TimeOffTable />
          </StatAccordion>
        </Stack>
      </Stack>
    </Stack>
  </Box>
  )
}

export default Dashboard