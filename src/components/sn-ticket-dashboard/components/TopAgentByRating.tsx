import { memo } from "react"
import { Avatar, Box, Stack, Typography } from "@mui/material";
import useGetDashboardData from "queries/ticket-agent/useDashboard/useDashboard"
import RateIcon from "icons/RateIcon";

const TopAgentByRating = () => {

    const { topAgentByRatingData } = useGetDashboardData()


    const agentData = topAgentByRatingData?.data?.data?.data?.topAgentByRating?.map((agent: any) => ({
        name: agent?.infoAgent?.detail?.fullname,
        rate: agent?.rate,
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
                {agentData?.map((agent: any, index: number) => (
                    <Stack mb={2} px={2} key={index} direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" gap={2}>
                            <Avatar src={agent?.avatar} alt={agent?.name} />
                            <Box>
                                <Typography fontWeight={600}>{agent?.name}</Typography>
                                <Typography display='flex' gap={1} alignItems='center' variant="body2" color="#000000">
                                    {agent?.rate}
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="gold" width="20px" height="20px">
                                        <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                    </svg>
                                </Typography>
                            </Box>
                        </Stack>
                        <Stack direction="row" alignItems="center" gap={1}>
                            <Typography fontWeight={600}>{2 - index}</Typography>
                            <Typography variant="body2" color={agent?.trend === 'up' ? 'green' : 'red'}>
                                {agent?.icon}
                            </Typography>
                        </Stack>
                    </Stack>
                )).reverse()}
            </Box>

        </>
    )
}

export default memo(TopAgentByRating)