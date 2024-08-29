"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import { memo, useEffect, useMemo, useState , useRef } from "react";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import AssignGroup from "./AssignGroup";
import { useRouter } from "next/navigation";
import { TICKET_PATH } from "constant/paths";

const upperCaseText = (string: string) => {
  return string.toUpperCase();
};
const TableTicket = (props: any) => {
  const { data } = props;
  const [list , setList] = useState(null);
  const t = useTranslations(NS_TICKET);
  const { push } = useRouter();

  // const handleOpenEditMobile = useRef(() => {});


  const bgStage = (check: String) => {
    if (check == "New") return "#FF2C56";
    if (check == "In-progress") return "#03AE00";
    if (check == "Resolved") return "#E605DD";
    if (check == "Closed") return "#697469";
  };
  const colorPriority = (check: String) => {
    if (check == "Medium") return "#03AE00";
    if (check == "Low") return "#0575E6";
    if (check == "High") return "#FF2C56";
  };
  const bgPriority = (check: String) => {
    if (check == "Medium") return "#DDFFDC";
    if (check == "Low") return "#D9F0FD";
    if (check == "High") return "#FFEEF1";
  };


const handleGetData = () => {
  setList(data)
  console.log("render")

}



  useEffect(()=>{
    handleGetData()

  },[data])

  console.log("check list", list)
  const handelClickAssginMobie = (id) => {
    const _data = [...data]
    const idx = _data?.findIndex((item)=> item.id == id);
    _data[idx] = {...data[idx], active : true}
    setList(_data)
  }



  return (

    <>
      <TableContainer sx={{ boxShadow: "none", display: { xs: 'none', md: 'block' } }} component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#D9F0FD" }}>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontSize="13px" fontWeight="500">{t("ticketFields.id")}</Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontSize="13px" fontWeight="500">
                  {t("ticketFields.stage")}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontSize="13px" fontWeight="500">{t("ticketFields.name")}</Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontSize="13px" fontWeight="500">
                  {t("ticketFields.ticketType")}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontSize="13px" fontWeight="500">
                  {t("ticketFields.priority")}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontSize="13px" fontWeight="500">
                  {t("ticketFields.assignedTo")}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontSize="13px" fontWeight="500">
                  {t("ticketFields.creator")}
                </Typography>
              </TableCell>
              <TableCell sx={{ border: "none", padding: "10px" }}>
                <Typography fontSize="13px" fontWeight="500">
                  {t("ticketFields.creationTime")}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row) => {
              return (
                <TableRow key={row.id}>
                  <TableCell
                    sx={{ border: "none", color: "#0575E6", cursor: "pointer" }}
                    onClick={() => push(`${TICKET_PATH}/${row?.id}`)}
                  >
                    {row?.code}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: "none",
                      color: bgStage(row?.stage),
                      fontWeight: "700",
                    }}
                  >
                    {row?.stage}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>{row?.title}</TableCell>
                  <TableCell sx={{ border: "none" }}>{row?.type}</TableCell>
                  <TableCell sx={{ border: "none" }}>
                    <Box
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                      sx={{
                        borderRadius: "100px",
                        backgroundColor: bgPriority(row?.priority),
                        height: 30,
                      }}
                    >
                      <Text
                        sx={{
                          fontSize: 12,
                          color: colorPriority(row?.priority),
                          fontWeight: 700,
                        }}
                      >
                        {row?.priority}
                      </Text>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    <AssignGroup style={{ width: "164px" }} item={row} />
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.creatorUser?.fullname}
                  </TableCell>
                  <TableCell sx={{ border: "none" }}>
                    {row?.createTime?.slice(0, 10)}{" "}
                    {row?.createTime?.slice(11, 16)}{" "}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>



      <Box sx={{ display: { xs: 'block', md: 'none' }, p: 2 }}>
        {list?.length > 0 && list?.map((row , index) => ( 
          <Box
            key={row.id}
            sx={{
              borderBottom: '1px solid #ddd',
              mb: 2,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between', // Space between label and value
                alignItems: 'center',
              }}
            >
              <Typography variant="body1" sx={{ fontWeight: '500' }}>
                {t("ticketFields.id")}
              </Typography>
              <Typography color="#0575E6" fontWeight={700} variant="body1">
                {row?.code}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                {t("ticketFields.stage")}
              </Typography>
              <Text sx={{ color: bgStage(row?.stage), fontWeight: '700' }}>
                {row?.stage}
              </Text>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                {t("ticketFields.name")}
              </Typography>
              <Typography variant="body1">
                {row?.title}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                {t("ticketFields.ticketType")}
              </Typography>
              <Typography variant="body1">
                {row?.type}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                {t("ticketFields.priority")}
              </Typography>
              <Box
                display="inline-flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  borderRadius: '100px',
                  backgroundColor: bgPriority(row?.priority),
                  height: 30,
                  px: 1,
                  mr: 1,
                }}
              >
                <Text sx={{ fontSize: 12, color: colorPriority(row?.priority), fontWeight: 700 }}>
                  {row?.priority}
                </Text>
              </Box>
            </Box>
            <Box
              onClick={() => handelClickAssginMobie(row.id)}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              {!row.active ? (
                <>
                  <Typography variant="body1">
                    {t("ticketFields.assignedTo")}
                  </Typography>
                  <AssignGroup mobile={true} item={row} />
                </>
              ) : (
                <AssignGroup handleGetData={handleGetData} style={{ width: "100%" }} item={row} />
              )}


            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                {t("ticketFields.creator")}
              </Typography>
              <Typography variant="body1">
                {row?.creatorUser?.fullname}
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Typography variant="body1">
                {t("ticketFields.creationTime")}
              </Typography>
              <Typography variant="body1">
                {row?.createTime?.slice(0, 10)} {row?.createTime?.slice(11, 16)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>

    </>
  );
};

export default memo(TableTicket);
