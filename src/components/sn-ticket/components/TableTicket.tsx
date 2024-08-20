"use client";


import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';
import { memo, useEffect, useMemo, useState } from "react";
import { Text } from 'components/shared';
import { useTranslations } from 'next-intl';
import { NS_TICKET } from 'constant/index';



const upperCaseText = (string: string) => {
    return string.toUpperCase()
}
const TableTicket = (props: any) => {
    const t = useTranslations(NS_TICKET);

    const { data } = props
    return (
        <TableContainer sx={{ boxShadow: 'none' }} component={Paper}>
            <Table >
                <TableHead>
                    <TableRow sx={{ backgroundColor: "#D9F0FD" }}>
                        <TableCell sx={{ border: "none" }}>
                            <Typography fontWeight="500">{t("ticketFields.id")}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "none" }}>
                            <Typography fontWeight="500">{t("ticketFields.stage")}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "none" }}>
                            <Typography fontWeight="500">{t("ticketFields.name")}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "none" }}>
                            <Typography fontWeight="500">{t("ticketFields.ticketType")}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "none" }}>
                            <Typography fontWeight="500">{t("ticketFields.priority")}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "none" }}>
                            <Typography fontWeight="500">{t("ticketFields.assignedTo")}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "none" }}>
                            <Typography fontWeight="500">{t("ticketFields.creator")}</Typography>
                        </TableCell>
                        <TableCell sx={{ border: "none" }}>
                            <Typography fontWeight="500">{t("ticketFields.creationTime")}</Typography>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody >
                    {data.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell sx={{ border: "none", color: "#0575E6" }}>{row?.id}</TableCell>
                            <TableCell sx={{ border: "none", color: "#03AE00" }}>{row?.status}</TableCell>
                            <TableCell sx={{ border: "none" }}>{row?.title}</TableCell>
                            <TableCell sx={{ border: "none" }}>{row?.ticketType}</TableCell>
                            <TableCell sx={{ border: "none" }}>
                                <Box
                                    display="flex"
                                    justifyContent='center'
                                    alignItems='center'
                                    px={2}
                                    sx={{ borderRadius: "100px", backgroundColor: "#EEFFE0", height: 30 }}>
                                    <Text sx={{ fontSize: 13, color: "#03AE00", fontWeight: 700 }}>
                                        {row?.prority}
                                    </Text>
                                </Box>

                            </TableCell>
                            <TableCell sx={{ border: "none" }}>
                                <Box
                                    display='flex'
                                    gap="10px"
                                    alignItems='center'
                                    py={2}
                                >
                                    <Box
                                        component="img"
                                        height="30px"
                                        width='30px'
                                        src="https://via.placeholder.com/150"
                                        alt="Image description"
                                        sx={{ borderRadius: "100%" }}
                                    />
                                    <Text sx={{ fontSize: 13 }}>
                                        Thu Nguyen
                                    </Text>
                                </Box>
                            </TableCell>
                            <TableCell sx={{ border: "none" }}>{row?.created}</TableCell>
                            <TableCell sx={{ border: "none" }}>{row?.day} {row?.time}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default memo(TableTicket);