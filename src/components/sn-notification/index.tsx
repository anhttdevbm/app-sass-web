"use client"


import { Stack } from "@mui/material"
import { useGetHistoryNotification } from "queries/notificaiton/useGetHistoryNotification"
import { memo } from "react"
import DetaiList from "./components/DetaiList"
import { ItemNotificationType, PropsItemNotification } from "./type/type"



const ItemNotification = (props: PropsItemNotification) => {
    const { data } = useGetHistoryNotification()
    const { handleClose, activeTag } = props

    const filterData = (activeTag: number) => {
        if (activeTag == 2) {
            const _data = data?.data?.DT?.filter((item: ItemNotificationType) => item?.readSatus == false)
            return _data
        }

        return data?.data?.DT || []
    }


    return (
        <Stack sx={{ width: "100%" }} gap={2} direction="column">
            {filterData(activeTag).map((item: ItemNotificationType, index: number) => (
                <Stack key={index}>
                    <DetaiList item={item} handleClose={handleClose} />
                </Stack>

            ))}
        </Stack>
    )
}
export default memo(ItemNotification)