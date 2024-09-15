import { memo } from "react"
import "./style.css"
import { Box, Stack } from "@mui/material"

interface ProgressBarProps {
    type: "priority" | "type" | "assign"
    data: any
    totalTicket: number
}

const ProgressBar = (props: ProgressBarProps) => {

    const { type, data, totalTicket } = props

    const handleConvertPercent = (count: number, total: number) => {
        const percent = (count / total) * 100
        console.log("check percent", percent)
        return `${percent}%`
    }

    const bgColor = (type: string) => {
        switch (type) {
            case "priority":
                return "rgba(255, 128, 77, 0.2)"
            case "type":
                return "linear-gradient(270deg, rgba(47, 234, 155, 0.2) 15.5%, rgba(127, 221, 83, 0.2) 85.5%)"
            case "assign":
                return "linear-gradient(143.13deg, rgba(54, 183, 255, 0.2) 5.36%, rgba(27, 89, 248, 0.2) 94.64%)"
            default:
        }
    }

    const bgStatusColor = (type: string) => {
        switch (type) {
            case "priority":
                return "linear-gradient(143.13deg, #FFBF1A 5.36%, #FF4080 94.64%)"
            case "type":
                return "linear-gradient(270deg, #2FEA9B 15.5%, #7FDD53 85.5%)"
            case "assign":
                return "linear-gradient(143.13deg, #5EBBFF 5.36%, #1B59F8 94.64%)"
            default:
        }
    }

    return (
        <>
            <div className="container-progress-bar">
                {data?.map((item: any, index: number) => (
                    <Stack mt={2} key={index} direction="row">
                        <Box margin="auto" display={type !== "assign" ? "none" : "block"} pr={2}>
                            <Box
                                width={40}
                                height={40}
                                borderRadius={50}
                                component="img"
                                src={
                                    item?.urlAvatar ?
                                        item?.urlAvatar :
                                        "https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__"
                                }
                            >
                            </Box>
                        </Box>
                        <Box 
                        width={type !== "assign" ? "100%" : "100%"}
                        >
                            <label className="text-lable">{item?.priority || item?.type || item?.fullname}</label>
                            <div style={{ display: "flex", alignItems: "center", gap: 3, marginTop: "12px" }}>
                                <div
                                    className="progress-bar-item"
                                    style={{
                                        background: bgColor(type)
                                    }}
                                >
                                    <div
                                        className="progress-bar-item-before"
                                        style={{
                                            background: bgStatusColor(type),
                                            width: handleConvertPercent(item?.count as number, totalTicket)
                                        }}
                                    >
                                    </div>
                                </div>
                                <text className="text-count-ticket">{item?.count as number}</text>
                            </div>

                        </Box>
                    </Stack>

                ))}

            </div>
        </>
    )
}
export default memo(ProgressBar)