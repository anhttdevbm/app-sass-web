/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { client, Endpoint } from "api";
import { BodyCell } from "components/Table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { DashboardTableCellHeader } from "./DashboardTableCellHeader";
import { convertTimestamp } from "./Tables";

interface Project {
    length: number;
    map(arg0: (row: any) => import("react").JSX.Element): import("react").ReactNode;
    id: string;
    name: string;
    owner: {
        avatar: string;
        fullname: string;
    };
    last_updated: number;
}

function ActiveProjectsTable() {
    const [data, setData] = useState<Project | null>(null);

    useEffect(() => {
        client.get(Endpoint.DASHBOARD_PROJECT_ALL_ACTIVE, {})
            .then(response => {
                setData(response.data);
            })
    }, [])
    const HEADER_LIST = [
        { value: "Name", width: "33%" },
        { value: "Project Manager", width: "33%" },
        { value: "Last activity", width: "33%" },
    ]

    return (
        <TableContainer sx={{ maxHeight: data && data.length > 10 ? 400 : 'auto', overflowY: 'auto' }}>
            <Table stickyHeader>
                <TableHead>
                    <TableRow>
                        <DashboardTableCellHeader headerList={HEADER_LIST} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.map((row) => (
                        <TableRow key={row.id}>
                            <BodyCell>
                                <Typography textAlign='left' fontWeight={600} fontSize={14}>
                                    {row.name}
                                </Typography>
                            </BodyCell>
                            <BodyCell>
                                <Stack direction='row' spacing={1.5}>
                                    <Image
                                        src={row.owner?.avatar}
                                        alt={row.owner?.fullname}
                                        width={32}
                                        height={32}
                                        style={{ borderRadius: "50%" }}
                                    />
                                    <Typography>{row.owner?.fullname}</Typography>
                                </Stack>
                            </BodyCell>
                            <BodyCell sx={{ textAlign: "right" }}>
                                {convertTimestamp(row.last_updated)}
                            </BodyCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default ActiveProjectsTable;
