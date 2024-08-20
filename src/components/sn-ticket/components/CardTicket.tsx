"use client";


import {
    Box,
    Card,
    CardContent,
    CardHeader,
    CardMedia,
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuList,
    Paper,
    Stack,
    Typography,
} from "@mui/material";
import { Button, Text } from "components/shared";
import { NS_TICKET } from "constant/index";
import { TICKET_INFO_PATH } from "constant/paths";
import OpenTicketDetailIcon from "icons/OpenTicketDetailIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";




import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setDataTicketDetail } from "store/ticket-detail/actions";





const CardTicket = (props: any) => {
    const t = useTranslations(NS_TICKET);
    const router = useRouter()
    const { push } = router;
    const dispatch = useDispatch();


    const { data } = props

    const handleOpenTicketDetail = (id: string) => {
        const path = TICKET_INFO_PATH.replace('{id}', id)
        push(path)
        dispatch(setDataTicketDetail(data))
    };
    return (
        <>
            <Card sx={{ width: "100%", boxShadow: 'none', border: "1px solid #EFEFEF", mb: 1 }}>
                <CardHeader
                    sx={{ borderBottom: "1px solid #EFEFEF" }}
                    title={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography sx={{ fontWeight: 700 }} variant="h6">
                                {t("cardTicket.title")} {data?.id}
                            </Typography>
                            <Box
                                display="flex"
                                justifyContent='center'
                                alignItems='center'
                                px={2}
                                sx={{ borderRadius: "100px", backgroundColor: "#EEFFE0", height: 30 }}>
                                <Text sx={{ fontSize: 13, color: "#03AE00", fontWeight: 700 }}>
                                    {data?.status}
                                </Text>
                            </Box>
                        </Box>
                    }
                />
                <CardContent>
                    <Stack flexDirection='row'>
                        <Stack
                            width="60%"
                            gap="10px"
                        >
                            <Typography sx={{ fontWeight: 700 }} gutterBottom variant="h5" component="div">
                                {data?.title}
                            </Typography>
                            <Typography sx={{ color: "#4D4D4D" }} variant="body2" color="text.secondary">
                                {data?.description}
                            </Typography>
                        </Stack>
                        <Stack
                            display='flex'
                            justifyContent='center'
                            alignItems='center'
                            width='20%'
                        >
                            <Box
                                display="flex"
                                justifyContent='center'
                                alignItems='center'
                                px={2}
                                sx={{ borderRadius: "100px", backgroundColor: "#EEFFE0", height: 30 }}>
                                <Text sx={{ fontSize: 13, color: "#03AE00", fontWeight: 700 }}>
                                    {data?.prority}
                                </Text>
                            </Box>
                        </Stack>
                        <Stack
                            display='flex'
                            alignItems="flex-start"
                            justifyContent='center'
                            width='20%'
                        >
                            <Text sx={{ fontSize: 13 }}>
                                {data?.day} {data?.time}
                            </Text>
                            <Text sx={{ fontSize: 13 }}>
                                {t("cardTicket.created")}: {data?.created}
                            </Text>
                            <Text sx={{ fontSize: 13 }}>
                                {t("cardTicket.lastRespond")}: {data?.lastRespond}
                            </Text>
                        </Stack>
                    </Stack>
                    <Stack
                        flexDirection='row'
                        alignItems='center'
                        justifyContent='space-between'
                        width='100%'
                    >
                        <Box
                            width='150px'
                            display='flex'
                            gap="10px"
                            alignItems='center'
                            py={2}
                        >
                            <Box
                                component="img"
                                height="50px"
                                width='50px'
                                src="https://via.placeholder.com/150"
                                alt="Image description"
                                sx={{ borderRadius: "100%" }}
                            />
                            <Text sx={{ fontSize: 13 }}>
                                Thu Nguyen
                            </Text>
                        </Box>
                        <Box onClick={() => handleOpenTicketDetail(data?.id)} display='flex' alignContent='center' justifyContent='center' gap="10px" px={5}>
                            <Text sx={{ color: "#0575E6", fontSize: 13, textDecoration: "underline", cursor: "pointer" }}> {t("cardTicket.openTicket")}</Text>
                            <OpenTicketDetailIcon />
                        </Box>


                    </Stack>



                </CardContent>
            </Card>
        </>
    )
}

export default memo(CardTicket)