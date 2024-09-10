import { memo } from "react"
import Statistical from "../components/statistical"
import { Box, Stack } from "@mui/material"
import ColumnChart from "../components/ column-chart"
import OpenTicket from "../components/open-ticket"
import PieTickets from "../components/PieTickets"
import LineChartTicket from "../components/LineChartTicket"



const Items = () => {
    return (

        <>
            <Stack mt={2} direction={{ xs: "column", sm: "row", md: "row" }} flexWrap="wrap">
                <Box width={{ xs: "100%", sm: "50%", md: "50%" }}>
                    <Statistical />
                </Box>
                <Box mt={{ xs: 2, sm: 0, md: 0 }} width={{ xs: "100%", sm: "50%", md: "50%" }}>
                    <ColumnChart />
                </Box>
                <Box mt={{ xs: 2, sm: 0, md: 0 }} width="100%">
                    <OpenTicket />
                </Box>
                {/* <Box mt={{ xs: 2, sm: 0, md: 0 }} mr={1} width={{ xs: "100%", sm: "49%", md: "49%" }}>
                    <PieTickets/>
                </Box>
                <Box mt={{ xs: 2, sm: 0, md: 0 }} ml={1} width={{ xs: "100%", sm: "49%", md: "49%" }}>
                    <LineChartTicket/>
                </Box> */}
            </Stack>

        </>

    )
}

export default memo(Items)