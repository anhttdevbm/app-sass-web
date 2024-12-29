import { Table, TableBody, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { client, Endpoint } from "api";
import { BodyCell } from "components/Table";
import { DASHBOARD_API_URL } from "constant/index";
import { useEffect, useState } from "react";
import { DashboardTableCellHeader } from "./DashboardTableCellHeader";
import { convertTimestamp } from "./Tables";
const iconUrl = "/images/beatAudio.png"


interface Task {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    status: string;
}

type TaskData = Task[];

export function MyTaskTable() {
    const [data, setData] = useState<TaskData>([]);

    useEffect(() => {
        client.get(Endpoint.DASHBOARD_MY_TASK_ALL_ACTIVE, {}, { baseURL: DASHBOARD_API_URL })
            .then(response => {
                setData(response.data.tasks);
                console.log(data);

            })
    }, [])

    const HEADER_LIST = [
        { value: "Task", width: "33%" },
        { value: "Start date", width: "33%" },
        { value: "Due date", width: "33%" },
    ]

    return (
        <TableContainer sx={{ maxHeight: data && data.length > 10 ? 400 : 'auto', overflowY: 'auto' }}>
            <Table>
                <TableHead>
                    <TableRow>
                        <DashboardTableCellHeader headerList={HEADER_LIST} />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data && data.map((row) => {
                        return <TableRow key={row.id}>
                            <BodyCell>
                                <Typography textAlign='left' fontWeight={600} fontSize={14}>
                                    {row.name}
                                </Typography>
                            </BodyCell>
                            {/* <StatusCell
                                color={row.status === "ACTIVE" ? "success" : "warning"}
                                text={row.status === "ACTIVE" ? "Active" : "Inactive"}
                            /> */}
                            <BodyCell sx={{ textAlign: "right" }}>
                                {convertTimestamp(row.start_date || '--')}
                            </BodyCell>
                            <BodyCell sx={{ textAlign: "right" }}>
                                {convertTimestamp(row.end_date || '--')}
                            </BodyCell>
                        </TableRow>
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

