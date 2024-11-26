"use client"


import { Avatar, Box, Stack } from "@mui/material"
import { Text } from "components/shared"
import BillingIcon from "icons/BillingIcon"
import BudgetIcon from "icons/BudgetIcon"
import MenuCompanyIcon from "icons/MenuCompanyIcon"
import MenuProjectIcon from "icons/MenuProjectIcon"
import { useRouter } from "next/navigation"
import { updateReadStatusApi } from "queries/notificaiton/api"
import { memo } from "react"
import { PropsDetaiList } from "../type/type"
import { TYPE_NOTIFY } from "../type/type-icon-detail"





const DetaiList = (props: PropsDetaiList) => {
    const { push } = useRouter();

    const handleLinkToDetail = async (path: string , id : string) => {
        push(path)
        props.handleClose()
       await updateReadStatusApi(id)
    }

    const filterIcon = (title: string) => {
        // props?.item?.title
        switch (title) {
            case TYPE_NOTIFY.COMPANY:
                return <MenuCompanyIcon />
            case TYPE_NOTIFY.PROJECT:
                return <MenuProjectIcon />
            case TYPE_NOTIFY.BILLING:
                return <BillingIcon />
            case TYPE_NOTIFY.BUDGET:
                return <BudgetIcon />
            case TYPE_NOTIFY.CHAT:
                return <></>
            case TYPE_NOTIFY.SALES:
                return <></>
            case TYPE_NOTIFY.DOCUMENT:
                return <></>
            case TYPE_NOTIFY.PAYMENT:
                return <></>
        }
    }
    return (
        <>
            <Stack
                sx={{ width: "100%" }}
                p={1} direction="row"
                alignItems="center" gap={1}
                bgcolor="#fff"
                border="1px solid #F7F7FD"
                borderRadius={2}
            >
                <Box
                    sx={{
                        width: 5,
                        height: 5,
                        backgroundColor: "#1461E1",
                        borderRadius: 50,
                        visibility: props?.item?.readSatus ? "hidden" : "visible"
                    }}
                />
                <Avatar src={props?.item?.avatar ? props?.item?.avatar : 'default-avatar-path'} alt={"avatar"} />
                <Stack>
                    <Box display="flex" gap={0.5} alignItems="center">
                        <Text fontSize={14} fontWeight={700}>{props?.item?.athor}</Text>
                        <Text fontSize={13} >{props?.item?.message}</Text>
                        <Box ml={"5px"}>
                            {filterIcon(props?.item?.title)}
                        </Box>
                        <Text
                            sx={{ textDecorationLine: 'underline', cursor: "pointer" }}
                            onClick={() => handleLinkToDetail(props?.item?.link , props?.item?._id)}
                            fontSize={13} >
                            {props?.item?.title}
                        </Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                        {/* <Text fontSize={13} color={"#ccc"} >Hang Pham</Text>
                        <Text fontSize={13} color={"#ccc"} >*</Text> */}
                        <Text fontSize={13} color={"#ccc"} >{props?.item?.createdAt}</Text>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}
export default memo(DetaiList)