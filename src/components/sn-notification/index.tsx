"use client"


import { memo } from "react"
import DetaiList from "./components/DetaiList"
import { useGetHistoryNotification } from "queries/notificaiton/useGetHistoryNotification"
import { Box, Stack } from "@mui/material"
import { ItemNotification, PropsItemNotification } from "./type/type"



const ItemNotification = (props: PropsItemNotification) => {
    const { data } = useGetHistoryNotification()
    console.log("🚀 ~ ItemNotification ~ data:", data)

    const { handleClose } = props

    console.log("check data >>>", data)
    return (
        <Stack sx={{ width: "100%" }} gap={2} direction="column">
            {data?.data?.DT?.map((item: ItemNotification, index: number) => (
                <Stack key={index}>
                    <DetaiList item={item} handleClose={handleClose} />
                </Stack>

            ))}
        </Stack>
    )
}
export default memo(ItemNotification)