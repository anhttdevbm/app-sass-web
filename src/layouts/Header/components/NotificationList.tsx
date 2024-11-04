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
                        <Box sx={{ cursor: "pointer" }} onClick={handleClose}>
                            <CloseIcon sx={{ color: "#000" }} />
                        </Box>
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
                        <ItemNotification handleClose={handleClose}/>
                    </Stack>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default memo(NotificationList)