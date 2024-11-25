"use client"


import { memo } from "react"
import DetaiList from "./components/DetaiList"
import { useGetHistoryNotification } from "queries/notificaiton/useGetHistoryNotification"
import { Box, Stack } from "@mui/material"
import { ItemNotification, PropsItemNotification } from "./type/type"



const ItemNotification = (props: PropsItemNotification) => {
    const { data } = useGetHistoryNotification()
    const { handleClose, activeTag } = props

    const filterData = (activeTag: number) => {
        if (activeTag == 2) {
            const _data = data?.data?.DT?.filter((item: ItemNotification) => item?.readSatus == false)
            return _data
        }

        return data
    }


    return (
        <Stack sx={{ width: "100%" }} gap={2} direction="column">
            {filterData(activeTag)?.map((item: ItemNotification, index: number) => (
                <Stack key={index}>
                    <DetaiList item={item} handleClose={handleClose} />
                </Stack>

            ))}
        </Stack>
    )
}
export default memo(ItemNotification)