import { Box, Stack } from "@mui/material"
import { Text } from "components/shared"
import { memo } from "react"
import ProgressBar from "./progress-bar/ProgressBar"

const OpenTicket = () => {


    let fakeTotalTicket = 100
    const fakeDataPriority = [
        {
            priority: "Hight",
            count: 100
        },
        {
            priority: "Medium",
            count: 52
        },
        {
            priority: "Low",
            count: 10
        },
    ]

    const fakeDataType = [
        {
            type: "Request",
            count: 34
        },
        {
            type: "Problem",
            count: 2
        },
        {
            type: "Question",
            count: 7
        },
    ]
    const fakeDataAssign = [
        {
            urlAvatar : "https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__" ,
            fullname: "Tung",
            count: 50
        },
        {
            urlAvatar : "https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__" ,
            fullname: "Toan",
            count: 12
        },
        {
            urlAvatar : "https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__" ,
            fullname: "Long",
            count: 9
        },
    ]


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
                            <ProgressBar totalTicket={fakeTotalTicket} data={fakeDataPriority} type="priority" />
                        </Box>
                    </Box>
                    <Box width={{ xs: "100%", sm: "25%", md: "25%" }}>
                        <Text fontSize={13} fontWeight={700} color="#666666">
                            Type
                        </Text>
                        <Box>
                            <ProgressBar totalTicket={fakeTotalTicket} data={fakeDataType} type="type" />
                        </Box>
                    </Box>
                    <Box width={{ xs: "100%", sm: "25%", md: "25%" }}>
                        <Text fontSize={13} fontWeight={700} color="#666666">
                            assigness
                        </Text>
                        <Box>
                            <ProgressBar totalTicket={fakeTotalTicket} data={fakeDataAssign} type="assign" />
                        </Box>

                    </Box>

                </Stack>
            </Stack>

        </>
    )
}

export default memo(OpenTicket)