import { Box, Stack } from "@mui/material"
import { Text } from "components/shared"
import { memo } from "react"
import ProgressBar from "./progress-bar/ProgressBar"

const OpenTicket = () => {

const fakeDataPriority = {
   Hight : 74 ,
   Medium : 52 ,
   Low : 10 ,
}



    return (
        <>
            <Stack mt={2} p={4} gap={2} borderRadius="12px" border="1px solid #EFEFEF" >
                <Text fontSize={20} fontWeight={700}>
                    Open ticket
                </Text>
                <Stack direction="row" justifyContent="space-between">
                    <Box width="25%">
                        <Text fontSize={13} fontWeight={700} color="#666666">
                            Priority
                        </Text>
                        <Box>
                            <ProgressBar data={fakeDataPriority} type="priority" />
                        </Box>
                    </Box>
                    <Box width="25%">
                        <Text fontSize={13} fontWeight={700} color="#666666">
                            Type
                        </Text>
                    </Box>
                    <Box width="25%">
                        <Text fontSize={13} fontWeight={700} color="#666666">
                            assigness
                        </Text>

                    </Box>

                </Stack>
            </Stack>

        </>
    )
}

export default memo(OpenTicket)