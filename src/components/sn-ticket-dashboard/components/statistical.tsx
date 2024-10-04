import { Box, Stack } from "@mui/material"
import { Text } from "components/shared"

import AgentOnlineIcon from "icons/AgentOnlineIcon"
import AvgFirstReplyTimeIcon from "icons/AvgFirstReplyTimeIcon"
import CreateTicketIcon from "icons/CreateTicketIcon"
import SatisfactionRateIcon from "icons/SatisfactionRateIcon"
import SolvedTicketIcon from "icons/SolvedTicketIcon"
import UnsolvedTicketIcon from "icons/UnsolvedTicketIcon"
import useGetDashboardData from "queries/ticket-agent/useDashboard/useDashboard"
import React from "react"

const Statistical = () => {

    const { data: list } = useGetDashboardData();
    console.log("🚀 ~ Statistical ~ list:", list)
    const stateTicket = React.useMemo(
        () => ({
            Create_Ticket: {
                id: "ticketCreate",
                icon: <CreateTicketIcon />,
                title: "Create ticket",
                bg: "#FFD07C33"
            },
            Unsolved_Ticket: {
                id: "ticketUnsolved",
                icon: <UnsolvedTicketIcon />,
                title: "Unsolved ticket",
                bg: "#E3FFFD"
            },
            Solved_Ticket: {
                id: "ticketSolved",
                icon: <SolvedTicketIcon />,
                title: "Solved ticket",
                bg: "#E9FFC5"
            },
            Avg_First_Reply_time: {
                id: "avgFirstReply",
                icon: <AvgFirstReplyTimeIcon />,
                title: "Avg First Reply time",
                bg: "#FCECFE"
            },
            Agent_Online: {
                id: "agentOnline",
                icon: <AgentOnlineIcon />,
                title: "Agent online",
                bg: "#E3FFDC"
            },
            Satisfaction_Rate: {
                id: "avgRateStar",
                icon: <SatisfactionRateIcon />,
                title: "Satisfaction  Rate",
                bg: "#FFF3C0"
            },
        }),
        [],
    );
    const mapData = (type: string) => {
        if (!list || list == null || !list.data || !list.data.data) return;
        const foundItem = Object.entries(list?.data?.data).find(([key, value]) => key === type);
        return foundItem ? foundItem[1] : 0;
    }
    return (
        <>
            <Stack direction="row" gap={{ xs: 1, sm: 2, md: 2 }} flexWrap="wrap">
                {Object.values(stateTicket).map((item, index) => (
                    <Box
                        sx={{
                            height: 165,
                            width: { xs: "48%", sm: "30%", md: "30%" },
                            borderRadius: "12px",
                            backgroundColor: `${item.bg}`,
                            padding: "25px",
                            textAlign: "end"
                        }}>
                        <Box textAlign="start" pb={3}>
                            <Text fontSize={13} fontWeight={600} color={"#1A1A1A"}>{item.title}</Text>
                            <Text fontSize={25} fontWeight={600} color={"#1A1A1A"}>{mapData(item.id) as React.ReactNode}</Text>
                        </Box>
                        {item.icon}
                    </Box>
                ))}

            </Stack>
        </>
    )
}

export default Statistical