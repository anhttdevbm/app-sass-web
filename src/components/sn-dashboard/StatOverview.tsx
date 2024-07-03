"use client"

import { Stack, Typography } from "@mui/material"
import Clock from "icons/Clock"
import StatIncreaseHand from "icons/HandandStat"
import ProjectsFolder from "icons/ProjectsFolder"
import TasksDoc from "icons/TasksDoc"
import StatOverviewCard from "./components/StatOverviewCard"



const fakeStatOverviewData = [
  {
    title: "Expected worked time this month",
    data: "164h",
    bgColor: "#F7F3FF",
    cornerIcon: <Clock />,
  },
  {
    title: "Sales",
    data: "$574.34",
    bgColor: "#E3FFFD",
    description: <Typography fontSize={10}>+23% since last month</Typography>,
    cornerIcon: <StatIncreaseHand />,
  },
  {
    title: "New Task",
    data: "154",
    bgColor: "#E3F1FF",
    cornerIcon: <TasksDoc />,
  },
  {
    title: "Total Projects",
    data: "29358",
    bgColor: "#FFF6E5",
    cornerIcon: <ProjectsFolder />,
  },
]

function StatOverview() {
  return (
    <Stack direction='row' spacing={3}>
      {fakeStatOverviewData.map((props, index) => (
        <StatOverviewCard {...props} key={index} />
      ))}
    </Stack>
  )
}

export default StatOverview
