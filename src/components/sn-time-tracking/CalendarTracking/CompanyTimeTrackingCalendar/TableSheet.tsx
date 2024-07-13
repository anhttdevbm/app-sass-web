"use client";
import React, { ChangeEvent, memo, useEffect, useState } from "react";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar, Box, FormControl, Input, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import { styled } from "@mui/material/styles";
import { setIsOpen,setAvatar,setUserName } from "store/userNavigationDetail/reducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "store/configureStore";

interface IProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dateRange: any;
}

function createData(
  name: string,
  avatar:string,
  sun: string,
  mon: string,
  tue: string,
  wed: string,
  thu: string,
  fri: string,
  sat: string,
  total: string,
) {
  return { name, avatar,sun, mon, tue, wed, thu, fri, sat, total };
}
function createUserDetailTableData(
  project: string,
  task: string,
  sun: string,
  mon: string,
  tue: string,
  wed: string,
  thu: string,
  fri: string,
  sat: string,
  total: string,
) {
  return { project, task, sun, mon, tue, wed, thu, fri, sat, total };
}
const rows = [
  createData(
    "Thu Nguyen",
    "ava1",
    "00:00",
    "00:00",
    "08:00",
    "00:00",
    "00:00",
    "00:00",
    "08:00",
    "16:00",
  ),
  createData(
    "Thu Nguyen",
    "ava1",
    "00:00",
    "00:00",
    "08:00",
    "00:00",
    "00:00",
    "00:00",
    "08:00",
    "16:00",
  ),
];
const userDetailRowsFakeData = [
  createUserDetailTableData(
    "Project 1",
    "Task 1",
    "00:00",
    "00:00",
    "08:00",
    "00:00",
    "00:00",
    "00:00",
    "08:00",
    "16:00",
  ),
  createUserDetailTableData(
    "Project 1",
    "Task 1",
    "00:00",
    "00:00",
    "08:00",
    "00:00",
    "00:00",
    "00:00",
    "08:00",
    "16:00",
  ),
];

const TableSheet: React.FC<IProps> = (props) => {
  const dispatch = useDispatch();
  const {isOpen} = useSelector((state:RootState)=>state.userNavigationDetail)
  const [dateData, setDateData] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [searchUser, setSearchUser] = useState([
    { name: "Thu Nguyen" },
    { name: "Tuan Anh" },
    // Add more users here
  ]);
  const [allTableDataVisible, setAllTableDataVisible] = useState<boolean>(true);
  const [detailDataTable, setDetailDataTable] = useState<boolean>(false);
  const [inputSearchData, setInputSearchData] = useState("");
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearchUser = (event: ChangeEvent<HTMLInputElement>) => {
    setInputSearchData(event.target.value);
    // Implement search logic here
    // setSearchUser
  };

  const handleGetUserDetail = (username:string,avatar:string) => {
    dispatch(setUserName(username))
    dispatch(setAvatar(avatar))
    dispatch(setIsOpen(true))
    // setAllTableDataVisible(!allTableDataVisible);
    // setDetailDataTable(!detailDataTable);
  };

  useEffect(() => {
    setDateData(props.dateRange);
  }, [props.dateRange]);

  const formattedDates = dateData.map((date) => ({
    day: moment(date).format("ddd"),
    date: moment(date).format("DD MMM"),
  }));

  return (
    <>
      {isOpen===false && (
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{
                fontWeight: "600",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    // display: "flex",
                    // justifyContent: "space-between",
                    // alignItems: "center",
                    background: "#0575E6",
                    color: "white",
                    height: "68px",
                    position: "relative",
                  }}
                >
                  <Typography>User</Typography>
                  <IconButton
                    sx={{
                      display: "inline-block",
                      verticalAlign: "middle", // Vertically centers SearchIcon
                      position: "absolute",
                      right: "16px", // Positions SearchIcon to the right
                      top: "50%",
                      transform: "translateY(-50%)", // Centers vertically
                    }}
                    aria-controls={open ? "basic-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                  >
                    <SearchIcon
                      sx={{
                        color: "white",
                      }}
                    />
                    {inputSearchData.length >= 1 && (
                      <Chip
                        label={inputSearchData.length}
                        sx={{
                          background: "white",
                          color: "#0575E6",
                          height: "18px",
                        }}
                      />
                    )}
                  </IconButton>
                  <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <Box sx={{ p: 1 }}>
                      <TextField
                        defaultValue={inputSearchData}
                        onChange={handleSearchUser}
                        placeholder="Search"
                        id="search-input"
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <SearchIcon />
                            </InputAdornment>
                          ),
                          sx: {
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderWidth: "2px",
                              borderColor: "#EFEFEF",
                              borderRadius: "100px",
                            },
                          },
                        }}
                      />
                    </Box>
                    {searchUser.map((user, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <Checkbox />
                        <Avatar sx={{ width: 20, height: 20 }}>H</Avatar>
                        <Typography>{user.name}</Typography>
                      </div>
                    ))}
                  </Popover>
                </TableCell>
                {formattedDates.map((date, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      height: "68px",
                      background: "#14B9E5",
                      border: "1px solid #EBEAF2",
                      color: "white",
                    }}
                  >
                    <Typography>{date.day}</Typography>
                    <Typography>{date.date}</Typography>
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{
                    background: "#D9F0FD",
                    color: "#333333",
                    border: "1px solid #EBEAF2",
                    fontWeight: "700",
                  }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  //   sx={{ "&:last-child td, &:last-child th": { border: "1px solid #EBEAF2" } }}
                >
                  <TableCell
                    sx={{
                      display: "flex",
                      height: "100%",
                      gap: "8px",
                      alignItems: "center",
                      borderRight: "1px solid #EBEAF2",
                      cursor: "pointer",
                    }}
                    onClick={() => handleGetUserDetail(row.name,row.avatar)}
                  >
                    <Avatar sx={{ width: 20, height: 20 }}>{row.avatar}</Avatar>
                    <Typography>{row.name}</Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.sun}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.mon}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.tue}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.wed}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.thu}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.fri}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.sat}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      background: "#D9F0FD",
                      color: "#333333",
                      border: "1px solid #EBEAF2",
                    }}
                  >
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  background: "#D9F0FD",
                  color: "#333333",
                  border: "1px solid #EBEAF2",
                  fontWeight: "700",
                }}
              >
                <TableCell align="right">Total</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {isOpen && (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead
              sx={{
                fontWeight: "600",
              }}
            >
              <TableRow>
                <TableCell
                  sx={{
                    // display: "flex",
                    // justifyContent: "space-between",
                    // alignItems: "center",
                    background: "#0575E6",
                    color: "white",
                    height: "68px",
                    position: "relative",
                  }}
                  rowSpan={2}
                >
                  <Typography>Project</Typography>
                </TableCell>
                <TableCell
                  sx={{
                    background: "#0575E6",
                    color: "white",
                    height: "68px",
                    position: "relative",
                    border: "1px solid #EBEAF2",
                  }}
                  rowSpan={2}
                >
                  <Typography>Task</Typography>
                </TableCell>
                {formattedDates.map((date, index) => (
                  <TableCell
                    key={index}
                    align="center"
                    sx={{
                      height: "68px",
                      background: "#14B9E5",
                      border: "1px solid #EBEAF2",
                      color: "white",
                    }}
                  >
                    <Typography>{date.day}</Typography>
                    <Typography>{date.date}</Typography>
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  sx={{
                    background: "#D9F0FD",
                    color: "#333333",
                    border: "1px solid #EBEAF2",
                    fontWeight: "700",
                  }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userDetailRowsFakeData.map((row) => (
                <TableRow
                  key={row.project}
                  //   sx={{ "&:last-child td, &:last-child th": { border: "1px solid #EBEAF2" } }}
                >
                  <TableCell sx={{ borderRight: "1px solid #EBEAF2" }}>
                    <Typography>{row.project}</Typography>
                  </TableCell>
                  <TableCell sx={{ borderRight: "1px solid #EBEAF2" }}>
                    <Typography>{row.task}</Typography>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.sun}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.mon}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.tue}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.wed}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.thu}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.fri}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{ borderRight: "1px solid #EBEAF2" }}
                  >
                    {row.sat}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      background: "#D9F0FD",
                      color: "#333333",
                      border: "1px solid #EBEAF2",
                    }}
                  >
                    {row.total}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow
                sx={{
                  background: "#D9F0FD",
                  color: "#333333",
                  border: "1px solid #EBEAF2",
                  fontWeight: "700",
                }}
              >
                <TableCell align="right" colSpan={2}>
                  Total
                </TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">08:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">00:00</TableCell>
                <TableCell align="center">08:00</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default TableSheet;
