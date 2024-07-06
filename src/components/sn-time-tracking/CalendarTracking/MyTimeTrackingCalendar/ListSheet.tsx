"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, styled } from "@mui/material/styles";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100,},
  { field: "Date", headerName: "Date", width: 200 },
  { field: "Project_name", headerName: "Project name", width: 200 },
  { field: "Task_name", headerName: "Task name", width: 200 },
  {
    field: "Type",
    headerName: "Type",
    width: 200,
  },
  {
    field: "Time",
    headerName: "Time",
    width: 200,
  },
  {
    field: "Creation_time",
    headerName: "Creation time",
    width: 200,
  },
];
const rows = [
  {
    id: 1,
    Date: "2024-07-06",
    Project_name: "Website Redesign",
    Task_name: "Create Homepage Layout",
    Type: "Design",
    Time: "2 hours",
    Creation_time: "2024-07-06T08:00:00Z",
  },
  {
    id: 2,
    Date: "2024-07-06",
    Project_name: "Website Redesign",
    Task_name: "Develop Homepage",
    Type: "Development",
    Time: "5 hours",
    Creation_time: "2024-07-06T10:00:00Z",
  },
  {
    id: 3,
    Date: "2024-07-07",
    Project_name: "Mobile App",
    Task_name: "Set up Project Structure",
    Type: "Setup",
    Time: "3 hours",
    Creation_time: "2024-07-07T09:00:00Z",
  },
  {
    id: 4,
    Date: "2024-07-07",
    Project_name: "Mobile App",
    Task_name: "Create Login Screen",
    Type: "Development",
    Time: "4 hours",
    Creation_time: "2024-07-07T11:00:00Z",
  },
  {
    id: 5,
    Date: "2024-07-08",
    Project_name: "API Integration",
    Task_name: "Integrate Payment Gateway",
    Type: "Development",
    Time: "6 hours",
    Creation_time: "2024-07-08T08:00:00Z",
  },
  {
    id: 6,
    Date: "2024-07-08",
    Project_name: "API Integration",
    Task_name: "Test Payment Gateway",
    Type: "Testing",
    Time: "3 hours",
    Creation_time: "2024-07-08T14:00:00Z",
  },
  {
    id: 7,
    Date: "2024-07-09",
    Project_name: "E-commerce Platform",
    Task_name: "Design Product Page",
    Type: "Design",
    Time: "4 hours",
    Creation_time: "2024-07-09T09:00:00Z",
  },
  {
    id: 8,
    Date: "2024-07-09",
    Project_name: "E-commerce Platform",
    Task_name: "Develop Product Page",
    Type: "Development",
    Time: "5 hours",
    Creation_time: "2024-07-09T13:00:00Z",
  },
  {
    id: 9,
    Date: "2024-07-10",
    Project_name: "E-commerce Platform",
    Task_name: "Optimize Product Images",
    Type: "Optimization",
    Time: "2 hours",
    Creation_time: "2024-07-10T08:00:00Z",
  },
  {
    id: 10,
    Date: "2024-07-10",
    Project_name: "Marketing Website",
    Task_name: "Write Blog Post",
    Type: "Content Creation",
    Time: "3 hours",
    Creation_time: "2024-07-10T10:00:00Z",
  },
];


const ListSheet = () => {
  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        sx={{
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#D9F0FD",
            color: "#4D4D4D", 
          },
        }}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
};

export default ListSheet;
