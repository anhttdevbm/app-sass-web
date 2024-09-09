import { memo } from "react"
import Statistical from "../components/statistical"
import { Box, Stack } from "@mui/material"
import ColumnChart from "../components/ column-chart"
import OpenTicket from "../components/open-ticket"



const Items = () => {
    return (

        <>
            <Stack mt={2} direction="row" flexWrap="wrap">
                <Box width="50%">
                    <Statistical />
                </Box>
                <Box width="50%">
                    <ColumnChart />
                </Box>
                <Box width="100%">
                    <OpenTicket />
                </Box>
            </Stack>

        </>

    )
}

export default memo(Items)