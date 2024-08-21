"use client";


import {
    Box,
    Stack,
    Typography,
} from "@mui/material";
import { Button, Text } from "components/shared";
import { NS_TICKET } from "constant/index";
import { useTranslations } from "next-intl";




import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";





const DescriptionDetail = (props: any) => {
    const t = useTranslations(NS_TICKET);
    const { data } = props || null
    const [showDetail, setShowDetail] = useState(false)
    const handleShowDetail = () => {
        setShowDetail(prev => !prev)
    }
    return (
        <>
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ backgroundColor: "#F2FAFF", width: "100%", padding: "0px 24px" }}>
                <Box
                    display='flex'
                    gap="10px"
                    alignItems='center'
                    py={2}

                >
                    <Box
                        component="img"
                        height="30px"
                        width='30px'
                        src="https://via.placeholder.com/150"
                        alt="Image description"
                        sx={{ borderRadius: "100%" }}
                    />
                    <Text sx={{ fontSize: 13 }}>
                        Thu Nguyen {t("ticketDetail.createRequest")}
                    </Text>
                </Box>
                <Text
                    onClick={() => handleShowDetail()}
                    sx={{ fontSize: 13, color: "#0575E6", fontWeight: "700", cursor: "pointer" }}
                >
                    {!showDetail ? (t("ticketDetail.btnShowDetail")) :(t("ticketDetail.btnHideDetail"))}
                </Text>
            </Stack>


            {showDetail &&
                <Stack direction="row" justifyContent="space-between" sx={{ padding: "24px", gap: 5 }}>
                    <Box sx={{ flex: 6 }}>
                        <Text fontSize={13} fontWeight={700}>{t("ticketDetail.description")}</Text>
                        <Text fontSize={13} py={2} color="#4D4D4D">{data?.description}</Text>
                    </Box>
                    <Box sx={{ flex: 4, backgroundColor: "#F2FAFF", display: "flex", justifyContent: "space-between ", flexDirection: "row", padding: "24px" }}>
                        <Box
                            sx={{
                                flex: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                            }}
                        >
                            <Text fontSize={13}>{t("ticketDetail.requestTicketType")}</Text>
                            <Text fontSize={13}>{t("ticketDetail.priority")}</Text>
                            <Text fontSize={13}>{t("ticketDetail.assignee")}</Text>
                            <Text fontSize={13}>{t("ticketDetail.rootCause")}</Text>



                        </Box>
                        <Box
                            sx={{
                                flex: 5,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px',
                                textAlign: "end"
                            }}
                        >
                            <Text fontSize={13}>None</Text>
                            <Text color="red" fontSize={13}>{data?.prority}</Text>
                            <Box
                                display='flex'
                                gap="10px"
                                alignItems='center'
                                py={2}
                                justifyContent="flex-end"

                            >
                                <Box
                                    component="img"
                                    height="30px"
                                    width='30px'
                                    src="https://via.placeholder.com/150"
                                    alt="Image description"
                                    sx={{ borderRadius: "100%" }}
                                />
                                <Text sx={{ fontSize: 13 }}>
                                    Thu Nguyen
                                </Text>
                            </Box>
                            <Text fontSize={13}>None</Text>



                        </Box>

                    </Box>
                </Stack>

            }


        </>
    )
}

export default memo(DescriptionDetail)