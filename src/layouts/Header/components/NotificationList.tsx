"use client"

import { memo, useCallback, useMemo } from "react"
import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import NotificationIcon from "icons/NotificationIcon";
import ItemNotification from "../../../components/sn-notification/index"
import { Stack, Box, Input } from "@mui/material";
import { Text } from "components/shared";
import CloseIcon from "icons/CloseIcon";
import SearchIcon from "icons/SearchIcon";
import SettingsNotification from "components/sn-notification/components/SettingsNotification";

const NotificationList = () => {
    const defaultTab = useMemo(
        () => [
            {
                id: 1,
                tab: "All"
            },
            {
                id: 2,
                tab: "Unread"
            },
            {
                id: 3,
                tab: "I was mentioned"
            },
            {
                id: 4,
                tab: "Assigned to me"
            },
        ], []
    )


    const [open, setOpen] = useState(false);
    const [openModelSetting, setOpenModelSetting] = useState(false)
    const [activeTag, setActiveTag] = useState<number>(1);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleClickTab = useCallback((id: number) => {
        setActiveTag(id)
    }, [])


    const showModelSetting = () => {
        setOpenModelSetting(true)
    }

    const closeModelSetting = () => {
        setOpenModelSetting(false)
    }

    return (
        <>
            <Button
                sx={{
                    border: "none",
                    "&:hover": {
                        border: "none",
                        boxShadow: "none",
                    },
                }}
                variant="outlined"
                color="primary"
                onClick={handleClickOpen}
            >
                <NotificationIcon sx={{ color: "#323338" }} />
            </Button>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: { width: 500, height: 500 }
                }}
            >
                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between">
                        <Text fontWeight={700} color={"#323338"}>{"Notifications"}</Text>
                        <Stack direction="row" alignItems="center" gap={2}>
                            <Stack
                                direction="row"
                                onClick={() => showModelSetting()}
                                alignItems="center"
                                gap={1}
                                borderRight="1px solid #D0D4E4"
                                pr={1}
                                sx={{ cursor: "pointer" }}
                            >
                                <svg width="4" height="14" viewBox="0 0 4 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1.99984 2.33073L1.99984 2.3374M1.99984 6.9974L1.99984 7.00406M1.99984 11.6641L1.99984 11.6707M1.99984 2.9974C1.63165 2.9974 1.33317 2.69892 1.33317 2.33073C1.33317 1.96254 1.63165 1.66406 1.99984 1.66406C2.36803 1.66406 2.6665 1.96254 2.6665 2.33073C2.6665 2.69892 2.36803 2.9974 1.99984 2.9974ZM1.99984 7.66406C1.63165 7.66406 1.33317 7.36559 1.33317 6.9974C1.33317 6.62921 1.63165 6.33073 1.99984 6.33073C2.36803 6.33073 2.6665 6.62921 2.6665 6.9974C2.6665 7.36559 2.36803 7.66406 1.99984 7.66406ZM1.99984 12.3307C1.63165 12.3307 1.33317 12.0323 1.33317 11.6641C1.33317 11.2959 1.63165 10.9974 1.99984 10.9974C2.36803 10.9974 2.6665 11.2959 2.6665 11.6641C2.6665 12.0323 2.36803 12.3307 1.99984 12.3307Z" stroke="#1461E1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                                <Text fontSize={14} color="#1461E1">
                                    Notification manager
                                </Text>
                            </Stack>
                            <Box sx={{ cursor: "pointer" }} onClick={handleClose}>
                                <CloseIcon sx={{ color: "#000" }} />
                            </Box>
                        </Stack>

                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <Stack direction="row" width={"100%"}>
                        {defaultTab.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    borderBottom: activeTag !== item.id ? "1px solid #ECECF3" : "1px solid #0073EA",
                                    cursor: "pointer"
                                }}
                                onClick={() => handleClickTab(item.id)}
                            >
                                <Text
                                    color={activeTag !== item.id ? "#323338" : "#0073EA"}
                                    fontSize={14} py={1} px={2} fontWeight={500}>
                                    {item.tab}
                                </Text>
                            </Box>
                        ))}

                    </Stack>

                    <Stack direction="row" mt={1} p={1} alignItems='center' bgcolor="#F7F7FD" borderRadius="4px">
                        <SearchIcon />
                        <Input disableUnderline placeholder="Search" sx={{ paddingLeft: "12px", width: "90%" }} />
                    </Stack>

                    <Stack direction="row" mt={1} p={1} alignItems='center'>
                        <ItemNotification handleClose={handleClose} />
                    </Stack>

                </DialogContent>
            </Dialog>



            <Dialog
                open={openModelSetting}
                onClose={closeModelSetting}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: { width: 500, height: 500 }
                }}
            >

                <DialogTitle>
                    <Stack direction="row" justifyContent="space-between">
                        <Stack direction="row" gap={1} alignItems="center">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M14.5434 3.58269L14.5432 3.58253L13.1015 2.75753L13.0942 2.75333L13.0942 2.75327C12.6835 2.50892 12.1377 2.64801 11.8809 3.07694L11.792 3.23056C11.7918 3.2309 11.7916 3.23124 11.7914 3.23159C11.363 3.9782 10.7281 4.46315 9.99046 4.46315C9.25328 4.46315 8.61633 3.97867 8.18392 3.23263L8.18379 3.23242L8.09212 3.07408L8.09037 3.07105L8.09038 3.07104C7.85202 2.65259 7.31176 2.5066 6.89715 2.75327L6.88988 2.75759L6.88984 2.75753L5.44818 3.58253L5.44791 3.58269C4.93356 3.8766 4.75258 4.54345 5.04966 5.06546C5.48193 5.8077 5.58444 6.59858 5.21612 7.23617C4.84786 7.87366 4.11046 8.1819 3.24984 8.1819C2.6576 8.1819 2.1665 8.66808 2.1665 9.26523V10.7319C2.1665 11.3241 2.65269 11.8152 3.24984 11.8152C4.11053 11.8152 4.8482 12.1236 5.21639 12.7625C5.58437 13.401 5.48177 14.1937 5.04995 14.9395C4.75309 15.4605 4.93231 16.1198 5.44791 16.4144L5.44818 16.4146L6.88984 17.2396L6.89719 17.2438L6.89715 17.2439C7.30786 17.4882 7.85362 17.3491 8.11044 16.9202L8.19939 16.7666C8.19959 16.7662 8.19978 16.7659 8.19998 16.7655C8.6283 16.0189 9.26326 15.534 10.0009 15.534C10.7381 15.534 11.375 16.0185 11.8074 16.7645L11.8075 16.7647L11.8976 16.9202C12.1544 17.3491 12.7002 17.4882 13.1109 17.2439L13.1181 17.2395L13.1182 17.2396L14.5598 16.4146L14.5601 16.4144C15.0767 16.1193 15.254 15.4516 14.9586 14.9404L14.5434 3.58269ZM14.5434 3.58269C15.0593 3.87749 15.2385 4.53744 14.9409 5.05857M14.5434 3.58269L14.9409 5.05857M14.9409 5.05857C14.513 5.80517 14.4137 6.59776 14.7827 7.23546C15.1519 7.87342 15.8888 8.1819 16.7498 8.1819C17.3454 8.1819 17.8346 8.67192 17.8415 9.26788L14.9409 5.05857ZM6.7915 9.99856C6.7915 11.7664 8.23203 13.2069 9.99984 13.2069C11.7676 13.2069 13.2082 11.7664 13.2082 9.99856C13.2082 8.23075 11.7676 6.79023 9.99984 6.79023C8.23203 6.79023 6.7915 8.23075 6.7915 9.99856Z" fill="#164EB6" stroke="#164EB6" />
                            </svg>

                            <Text fontWeight={700} fontSize={18} color={"#1461E1"}>Settings</Text>
                        </Stack>
                        <Box sx={{ cursor: "pointer" }} onClick={closeModelSetting}>
                            <CloseIcon sx={{ color: "#000" }} />
                        </Box>
                    </Stack>
                </DialogTitle>

                <DialogContent>
                    <SettingsNotification />

                </DialogContent>
            </Dialog>
        </>
    )
}

export default memo(NotificationList)