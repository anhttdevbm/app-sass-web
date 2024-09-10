import { Stack } from "@mui/material"
import { Text } from "components/shared"
import { memo } from "react"
import { BarChart, CartesianGrid, ResponsiveContainer } from "recharts"

const PieTicket = () => {
return (
    <Stack mt={2} p={{xs:0 , sm: 2 ,md :3}} border="1px solid #EFEFEF" borderRadius="12px">
    <Stack direction="row" pb={2} pl={2}>
        <Text fontSize={20} fontWeight="700" color="#1A1A1A">Tickets  by status</Text>

    </Stack>
    <Stack margin="auto" width="100%" height="230px">

    </Stack>

</Stack>
)
}

export default memo(PieTicket)