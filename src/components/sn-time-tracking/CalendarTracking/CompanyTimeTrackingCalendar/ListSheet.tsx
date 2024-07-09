"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, styled } from "@mui/material/styles";
import moment from "moment";
import "../CompanyTimeTrackingCalendar/style.css"


const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 100,headerClassName: 'super-app-theme--header',},
  { field: "Date", headerName: "Date", width: 200 ,headerClassName: 'super-app-theme--header'},
  { field: "Project_name", headerName: "Project name", width: 300,headerClassName: 'super-app-theme--header' },
  { field: "Task_name", headerName: "Task name", width: 300,headerClassName: 'super-app-theme--header' },
  {
    field: "Time",
    headerName: "Time",
    width: 300,
    headerClassName: 'super-app-theme--header'
  },
  {
    field: "Creation_time",
    headerName: "Creation time",
    width: 300,
    headerClassName: 'super-app-theme--header'
  },
];

const fakeData = [
    {
      _id: "1",
      day: "2024-07-07",
      project: { name: "Project Alpha" },
      note: "Worked on initial setup",
      type: "Development",
      duration: 5,
      created_time: "2024-07-07T08:00:00Z"
    },
    {
      _id: "2",
      day: "2024-07-06",
      project: { name: "Project Beta" },
      note: "Debugging issues",
      type: "Testing",
      duration: 3,
      created_time: "2024-07-06T09:30:00Z"
    },
    {
      _id: "3",
      day: "2024-07-05",
      project: null, // No project assigned, so it should be "BreakTime"
      note: "Team meeting",
      type: "Meeting",
      duration: 2,
      created_time: "2024-07-05T11:00:00Z"
    },
    {
      _id: "4",
      day: "2024-07-04",
      project: { name: "Project Gamma" },
      note: "Implemented feature X",
      type: "Development",
      duration: 4,
      created_time: "2024-07-04T10:00:00Z"
    },
    {
      _id: "5",
      day: "2024-07-03",
      project: { name: "Project Delta" },
      note: "Reviewed code",
      type: "Code Review",
      duration: 1.5,
      created_time: "2024-07-03T14:00:00Z"
    }
  ];

interface IProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data:any
}

const ListSheet:React.FC<IProps> = (props) => {
    // console.log(props.data)
  const rows = fakeData.map(row =>{
    return {
      id:row._id,
      Date:row.day,
      Project_name: row.project?.name || "BreakTime",
      Task_name: row.note,
      Time: row.duration +" " + "hours",
      Creation_time: moment(row.created_time).format("L HH:mm")
    }
  })
  return (
    <div style={{ width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{
          '.MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '&.MuiDataGrid-root': {
            border: 'none'
          },
          '.MuiDataGrid-columnHeaders': {
            backgroundColor:"red"
          }
        }}
      />
    </div>
  );
};

export default ListSheet;
