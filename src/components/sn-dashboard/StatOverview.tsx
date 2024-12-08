"use client"

import { Stack, Typography } from "@mui/material"
import { client, Endpoint } from "api"
import { DASHBOARD_API_URL } from "constant/index"
import Clock from "icons/Clock"
import StatIncreaseHand from "icons/HandandStat"
import ProjectsFolder from "icons/ProjectsFolder"
import TasksDoc from "icons/TasksDoc"
import { useEffect, useState } from "react"
import StatOverviewCard from "./components/StatOverviewCard"

interface DataType {
  time: {
    total_time: number;
  };
  sale: {
    percentage: number;
    total_sale: number;
  };
  task: {
    total_running_tasks: number;
    total_task: number;
  };
  project: {
    total_new_task: number;
    total_project: number;
  };
}


function StatOverview() {


  const [data, setData] = useState<DataType | null>(null);



  useEffect(() => {
    client.get(Endpoint.DASHBOARD_ALL, {}, {
      baseURL: DASHBOARD_API_URL,
    })
      .then(response => {
        setData(response.data);
      })
  }, [])

  const fakeStatOverviewData = [
    {
      title: "Expected worked time this month",
      data: `${data?.time?.total_time ?? 0}h`,
      bgColor: "#F7F3FF",
      cornerIcon: <Clock />,
    },
    {
      title: "Sales",
      data: `$ ${data?.sale?.total_sale ?? 0}`,
      bgColor: "#E3FFFD",
      description: <Typography fontSize={10}>+23% since last month</Typography>,
      cornerIcon: <StatIncreaseHand />,
    },
    {
      title: "New Task",
      data: `${data?.project.total_new_task ?? 0}`,
      bgColor: "#E3F1FF",
      cornerIcon: <TasksDoc />,
    },
    {
      title: "Total Projects",
      data: `${data?.project.total_project ?? 0}`,
      bgColor: "#FFF6E5",
      cornerIcon: <ProjectsFolder />,
    },
  ]

  return (
    <Stack direction='row' spacing={3}>
      {fakeStatOverviewData.map((props, index) => (
        <StatOverviewCard {...props} key={index} />
      ))}
    </Stack>
  )
}

export default StatOverview
