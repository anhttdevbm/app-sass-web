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
import CanceledTicketIcon from "icons/CanceledTicketIcon";
import ClosedTicketIcon from "icons/ClosedTicketIcon";
import InProgressTicketIcon from "icons/InProgressTicketIcon";
import NewTicketIcon from "icons/NewTicketIcon";
import OnHoldTicketIcon from "icons/OnHoldTicketIcon";
import OpenTicketIcon from "icons/OpenTicketIcon";
import ResolveTicketIcon from "icons/ResolveTicketIcon";
import SendAllTicketIcon from "icons/SendAllTicketIcon";
import { usePathname, useRouter } from "next-intl/client";
import { memo, useEffect, useMemo, useState } from "react";



const TickketList = () => {

    const defaultFilterTicket = [
        {
            id: 1,
            icon: SendAllTicketIcon,
            title: "All Ticket",
            count: 3,
            active: false,
        },
        {
            id: 2,
            icon: NewTicketIcon,
            title: "New",
            count: 1,

            active: false,
        },
        {
            id: 3,
            icon: OpenTicketIcon,
            title: "Open",
            count: 1,
            active: false,
        },
        {
            id: 4,
            icon: InProgressTicketIcon,
            title: "In-progress",
            count: 1,
            active: false,
        },
        {
            id: 5,
            icon: OnHoldTicketIcon,
            title: "On hold",
            count: 3,
            active: false,
        },
        {
            id: 6,
            icon: ResolveTicketIcon,
            title: "Resolved",
            count: 3,
            active: false,
        },
        {
            id: 7,
            icon: ClosedTicketIcon,
            title: "Closed",
            count: 0,
            active: false,
        },
        {
            id: 8,
            icon: CanceledTicketIcon,
            title: "Canceled",
            count: 0,
            active: false,
        },
    ]

    const [listFilterTicket, setListFilterTicket] = useState(defaultFilterTicket)

    const handleFilterTicket = (item) => {
        const _listFilterTicket = [...defaultFilterTicket]
        const idx = _listFilterTicket.findIndex((product) => product.id == item.id)
        console.log("check idx", idx)
        _listFilterTicket[idx]["active"] = true
        setListFilterTicket(_listFilterTicket)

    }
    return (
        <>
            <Stack
                direction="column"
                justifyContent="space-between"
                spacing={{ xs: 1, md: 2 }}
                px={{ xs: 0, md: 3 }}
                py={1}
                zIndex={2}
            >
                <Box
                    bgcolor="background.default"
                    borderRadius="2rem"
                    overflow={{ xs: "auto" }}
                    sx={{
                        backgroundColor: "#fff",
                        border: "1px solid #EFEFEF"
                    }}

                >
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="flex-start"
                        spacing={3}
                        overflow="auto"
                    >
                        <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                            bgcolor="background.default"
                            borderRadius="2rem"
                            overflow={{ xs: "auto" }}
                            sx={{
                                // height: "56px",
                                backgroundColor: "#fff",
                                width: "100%",
                            }}
                        >
                            {listFilterTicket.map((item, index) => (
                                <Box
                                    key={index}
                                    onClick={() => handleFilterTicket(item)}
                                    borderRadius="2rem"
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        gap: "10px",
                                        // padding: 2,
                                        backgroundColor: item.active ? "#D9F0FD" : "#fff",
                                        padding: "10px 10px"

                                    }}
                                >
                                    {item.active ?
                                        <item.icon colorCustom="#045EB8" />
                                        :
                                        <item.icon colorCustom="#B3B3B3" />

                                    }
                                    <Text sx={{ display: { xs: "none", md: "block", fontSize: 13 } }}
                                        color={item.active ? "#045EB8" : "#B3B3B3"} fontWeight={item.active ? "700" : "400"}>{item.title}
                                    </Text>
                                    {item.count !== 0 &&
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                borderRadius: "100%",
                                                backgroundColor: item.active ? "#045EB8" : "#B3B3B3",
                                                padding: 2,
                                                width: 15,
                                                height: 15,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }}>
                                            <Text sx={{ display: { xs: "none", md: "block", fontSize: 13 } }}
                                                color="#fff"> {item.count}
                                            </Text>
                                        </Paper>
                                    }

                                </Box>
                            ))}
                        </Box>
                    </Stack>
                </Box>

                <Card sx={{ width: "100%" }}>
                    <CardHeader
                        sx={{ borderBottom: "1px solid #EFEFEF" }}
                        title={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Typography sx={{ fontWeight: 700 }} variant="h6">
                                    Ticket# 2024-CS123
                                </Typography>
                                <Box
                                    display="flex"
                                    justifyContent='center'
                                    alignItems='center'
                                    px={2}
                                    sx={{ borderRadius: "100px", backgroundColor: "#EEFFE0", height: 30 }}>
                                    <Text sx={{ fontSize: 13, color: "#03AE00", fontWeight: 700 }}>
                                        In-progress
                                    </Text>
                                </Box>
                            </Box>
                        }
                    />
                    <CardContent>
                        <Stack flexDirection='row'>
                            <Stack
                                width="80%"
                            >
                                <Typography sx={{ fontWeight: 700 }} gutterBottom variant="h5" component="div">
                                    Login error
                                </Typography>
                                <Typography sx={{ color: "#4D4D4D" }} variant="body2" color="text.secondary">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                                        In-progress
                                    </Text>
                                </Box>
                            </Stack>
                        </Stack>
                        <Box
                            width='150px'
                            display='flex'
                            gap="10px"
                            alignItems='center'
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
                                Login error
                            </Text>
                        </Box>


                    </CardContent>
                </Card>
            </Stack>

        </>
    )
}

export default memo(TickketList)