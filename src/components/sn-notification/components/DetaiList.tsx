"use client"


import { Avatar, Box, Stack } from "@mui/material"
import { Text } from "components/shared"
import { memo } from "react"

const DetaiList = () => {
    return (
        <>
            <Stack
                sx={{ width: "100%" }}
                p={2} direction="row"
                alignItems="center" gap={1}
                bgcolor="#fff"
                border="1px solid #F7F7FD"
                borderRadius={2}
            >
                <Avatar src={'default-avatar-path'} alt={"check"} />
                <Stack>
                    <Box display="flex" gap={0.5} alignItems="center">
                        <Text fontSize={14} fontWeight={700}>Hang Pham</Text>
                        <Text fontSize={13} >Assign to you</Text>
                        <Text sx={{ textDecorationLine: 'underline' }} fontSize={13} >project</Text>
                    </Box>
                    <Box display="flex" alignItems="center">
                        <Text fontSize={13} color={"#ccc"} >Hang Pham</Text>
                        <Text fontSize={13} color={"#ccc"} >*</Text>
                        <Text fontSize={13} color={"#ccc"} >Assign to you</Text>
                    </Box>
                </Stack>
            </Stack>
        </>
    )
}
export default memo(DetaiList)