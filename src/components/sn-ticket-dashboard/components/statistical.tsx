import { Box, Stack } from "@mui/material"
import { Text } from "components/shared"
import CreateTicket from "../SVG/createTicket.svg"
import UnsolvedTicket from "../SVG/unsolvedTicket.svg"
import SolvedTicket from "../SVG/SolvedTicket.svg"
import AvgFirstReplyTime from "../SVG/AvgFirstReplytime.svg"
import AgentOnline from "../SVG/AgentOnline.svg"
import SatisfactionRate from "../SVG/SatisfactionRate.svg"

import React from "react";

const Statistical = () => {
    const stateTicket = React.useMemo(
        () => ({
            Create_Ticket: {
                id: 1,
                icon: <CreateTicket />,
                title: "Create ticket",
                bg: "#FFD07C33"
            },
            Unsolved_Ticket: {
                id: 1,
                icon: <UnsolvedTicket />,
                title: "Unsolved ticket",
                bg: "#E3FFFD"
            },
            Solved_Ticket: {
                id: 1,
                icon: <SolvedTicket />,
                title: "Solved ticket",
                bg: "#E9FFC5"
            },
            Avg_First_Reply_time: {
                id: 1,
                icon: <AvgFirstReplyTime />,
                title: "Avg First Reply time",
                bg: "#FCECFE"
            },
            Agent_Online: {
                id: 1,
                icon: <AgentOnline />,
                title: "Agent online",
                bg: "#E3FFDC"
            },
            Satisfaction_Rate: {
                id: 1,
                icon: <SatisfactionRate />,
                title: "Satisfaction  Rate",
                bg: "#FFF3C0"
            },
        }),
        [],
    );
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
                            <Text fontSize={25} fontWeight={600} color={"#1A1A1A"}>28</Text>
                        </Box>
                        {item.icon}
                    </Box>
                ))}

            </Stack>
        </>
    )
}

export default Statistical