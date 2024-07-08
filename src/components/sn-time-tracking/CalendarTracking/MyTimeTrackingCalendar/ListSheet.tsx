"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, styled } from "@mui/material/styles";
import moment from "moment";
import "../MyTimeTrackingCalendar/style.css"

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 150,headerClassName: 'super-app-theme--header',},
  { field: "Date", headerName: "Date", width: 200 ,headerClassName: 'super-app-theme--header'},
  { field: "Project_name", headerName: "Project name", width: 250,headerClassName: 'super-app-theme--header' },
  { field: "Task_name", headerName: "Task name", width: 250,headerClassName: 'super-app-theme--header' },
  {
    field: "Type",
    headerName: "Type",
    width: 250,
    headerClassName: 'super-app-theme--header'
  },
  {
    field: "Time",
    headerName: "Time",
    width: 200,
    headerClassName: 'super-app-theme--header'
  },
  {
    field: "Creation_time",
    headerName: "Creation time",
    width: 200,
    headerClassName: 'super-app-theme--header'
  },
];


interface IProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data:any
}

const ListSheet:React.FC<IProps> = (props) => {
  const rows = props.data.map(row =>{
    return {
      id:row._id,
      Date:row.day,
      Project_name: row.project?.name || "BreakTime",
      Task_name: row.note,
      Type: row.type,
      Time: row.duration +" " + "hours",
      Creation_time: moment(row.created_time).format("L HH:mm")
    }
  })
  return (
    <div style={{width: "100%" }}>
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
