"use client"

import { Box, Stack } from "@mui/material"
import { Text } from "components/shared"
import { memo } from "react"
import ProgressBar from "./progress-bar/ProgressBar"
import useGetDashboardData from "queries/ticket-agent/useDashboard/useDashboard"

const OpenTicket = () => {
    const { openTicketData } = useGetDashboardData()
    const data = openTicketData?.data?.data?.data?.ticketOpen || []
    let totalTicket = openTicketData?.data?.data?.data?.ticketOpen.length ?? 0


    const filterDataPriority = (type: string) => {
        const _data = [...data]
        const filter = _data?.filter((item => item?.priority == type))
        return filter.length
    }

    const filterDataType = (type: string) => {
        const _data = [...data]
        const filter = _data?.filter((item => item?.type == type))
        return filter.length
    }

    const filterAssignUser = () => {

        const assignUserCount = {};

        data.forEach(ticket => {
            const assignUser = ticket.assignUser;
            if (assignUser?.id) {

                if (!assignUserCount[assignUser.id]) {
                    assignUserCount[assignUser.id] = {
                        ...assignUser,
                        count: 1
                    };
                } else {
                    assignUserCount[assignUser.id].count += 1;
                }
            }
        });

        const sortedUsers = Object.values(assignUserCount).sort((a: any, b: any) => b.count - a.count);

        const top3Users = sortedUsers.slice(0, 3);

        return top3Users;

    }

    const dataPriority = [
        {
            priority: "Hight",
            count: filterDataPriority("Hight")
        },
        {
            priority: "Medium",
            count: filterDataPriority("Medium")
        },
        {
            priority: "Low",
            count: filterDataPriority("Low")
        },
    ]

    const dataType = [
        {
            type: "Request",
            count: filterDataType("Request")
        },
        {
            type: "Problem",
            count: filterDataType("Problem")
        },
        {
            type: "Question",
            count: filterDataType("Question")
        },
    ]

    const dataAssign = filterAssignUser()


    return (
        <>
            <Stack mt={2} p={4} gap={2} borderRadius="12px" border="1px solid #EFEFEF" >
                <Text fontSize={20} fontWeight={700}>
                    Open ticket
                </Text>
                <Stack direction={{ xs: "column", sm: "row", md: "row" }} justifyContent="space-between">
                    <Box width={{ xs: "100%", sm: "25%", md: "25%" }}>
                        <Text fontSize={13} fontWeight={700} color="#666666">
                            Priority
                        </Text>
                        <Box>
                            <ProgressBar totalTicket={totalTicket} data={dataPriority} type="priority" />
                        </Box>
                    </Box>
                    <Box width={{ xs: "100%", sm: "25%", md: "25%" }}>
                        <Text fontSize={13} fontWeight={700} color="#666666">
                            Type
                        </Text>
                        <Box>
                            <ProgressBar totalTicket={totalTicket} data={dataType} type="type" />
                        </Box>
                    </Box>
                    <Box width={{ xs: "100%", sm: "25%", md: "25%" }}>
                        <Text fontSize={13} fontWeight={700} color="#666666">
                            assigness
                        </Text>
                        <Box>
                            <ProgressBar totalTicket={totalTicket} data={dataAssign} type="assign" />
                        </Box>

                    </Box>

                </Stack>
            </Stack>

        </>
    )
}

export default memo(OpenTicket)