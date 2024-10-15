import { Avatar, Box, Stack, Typography } from "@mui/material";
import useGetDashboardData from "queries/ticket-agent/useDashboard/useDashboard"
import { memo } from "react"

const TopAgentByResolved = () => {


    const { topAgentByResolvedData } = useGetDashboardData();
    // console.log("🚀 ~ TopAgentByResolved ~ topAgentByResolvedData:", topAgentByResolvedData?.data?.data?.data?.topAgentByResolved)

    const agentData = topAgentByResolvedData?.data?.data?.data?.topAgentByResolved.map((agent : any)=> ({
        name: agent?.infoAgent?.detail?.fullname,
        ticketsResolved: agent?.lstTicket?.filter((ticket : any) => ticket.stage == 'Resolved').length,
        avatar: agent?.infoAgent?.urlAvatar || 'default-avatar-path',   
        rank: 1,
        trend: 'up'
    }));

    return (
        <>
           <Box sx={{ marginTop: 2, padding: 2, borderRadius: 2 , border:"1px solid #EFEFEF"}}>
                <Typography mb={5} variant="h6" fontWeight={700} fontSize={18} >
                    Top 5 Agent Performance by Tickets Resolved
                </Typography>
                {agentData?.map((agent : any, index : number) => (
                    <Stack mb={2} px={2} key={index} direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" gap={2}>
                            <Avatar src={agent?.avatar} alt={agent?.name} />
                            <Box>
                                <Typography fontWeight={600}>{agent?.name}</Typography>
                                <Typography variant="body2" color="#000000">
                                    {agent?.ticketsResolved} Resolved ticket
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography fontWeight={600}>{index + 1}</Typography>
                            <Typography variant="body2" color={agent?.trend === 'up' ? 'green' : 'red'}>
                                {agent?.icon}
                            </Typography>
                        </Stack>
                    </Stack>
                ))}
            </Box>

        </>
    )
}

export default memo(TopAgentByResolved)