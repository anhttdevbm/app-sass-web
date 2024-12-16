/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack, Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { client, Endpoint } from "api";
import { BodyCell } from "components/Table";
import { AUTH_API_URL } from "constant/index";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useAuth } from "store/app/selectors";
import { DashboardTableCellHeader } from "./DashboardTableCellHeader";


interface Employee {
    length: number;
    map(arg0: (row: any) => import("react").JSX.Element): import("react").ReactNode;
    id: string;
    name: string;
    avatar: string;
    roles: string[];
}

function EmployeeTable() {
    const {user} = useAuth();
    const [data, setData] = useState<Employee | null>(null);

    useEffect(() => {
        client.get(Endpoint.USERS, {
            page: 0,
            size: 10,
            company: user?.company,
            typeEmployee: 'Employee'
        },
            {
                baseURL: AUTH_API_URL,
            }
        )
            .then(response => {
                setData(response.data.data);
            })
    }, [])
    const HEADER_LIST = [
        { value: "Name", width: "33%" },
        { value: "Email", width: "33%" },
        { value: "Role", width: "33%" },
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
                                <Stack direction='row' spacing={1.5}>
                                    <Image
                                        src={row.avatar}
                                        alt={row.fullname}
                                        width={32}
                                        height={32}
                                        style={{ borderRadius: "50%" }}
                                    />
                                    <Typography>{row.fullname}</Typography>
                                </Stack>
                            </BodyCell>
                            <BodyCell>
                                <Typography textAlign='left' fontWeight={600} fontSize={14}>
                                    {row.email}
                                </Typography>
                            </BodyCell>
                            
                            <BodyCell sx={{ textAlign: "right" }}>
                                {row.roles.map((role, index) => (
                                    <Typography key={index} textAlign='right' fontWeight={600} fontSize={14}>
                                        {role === "AM" ? "Admin" : role === "MN" ? "Manager" : role === "LE" ? "Leader" : "Staff"}
                                    </Typography>
                                ))}
                            </BodyCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default EmployeeTable;