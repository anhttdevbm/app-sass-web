"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { createTheme, styled } from "@mui/material/styles";
import moment from "moment";

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

interface IProps{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data:any
}

const ListSheet:React.FC<IProps> = (props) => {
  const rows = props.data.map(row =>{
    return {
      id:row._id,
      Date:row.day,
      Project_name: row.project.name,
      Task_name: row.note,
      Type: row.type,
      Time: row.duration +" " + "hours",
      Creation_time: row.created_time,
    }
  })
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
