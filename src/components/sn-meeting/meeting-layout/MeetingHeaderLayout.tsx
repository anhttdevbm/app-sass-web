import React from "react";
import { Box, Stack, Button, IconButton, Avatar } from "@mui/material";
import { IosShare, AspectRatio, Circle, AccountCircle } from "@mui/icons-material";
import { Text } from "components/shared";
import { sxBtn, sxBtnCircleActive, sxPrimaryBtn } from "../style";


interface MeetingHeaderLayoutProps {
    sx: object;
}

const MeetingHeaderLayout: React.FC<MeetingHeaderLayoutProps> = (props : MeetingHeaderLayoutProps) => {
    return (
        <Stack direction="row" justifyContent="space-between" sx={{...props.sx}}>
            <Box>
                <Text typeof="strong" itemType="h1">
                    [Internal] Weekly Report Marketing + Sales
                </Text>
                <Stack flexDirection="row">
                    <Text typeof="span">31 May 2024</Text>
                    <Text typeof="span">
                        {" "}
                        <Circle /> 26:32
                    </Text>
                </Stack>
            </Box>

            <Stack direction="row" alignItems={'center'}>
                <Stack direction="row">
                    <Avatar src="public/images/avatar1.png" />
                    <Avatar src="public/images/avatar1.png" />
                    <Avatar src="public/images/avatar1.png" />
                    <Avatar src="public/images/avatar1.png" />
                </Stack>
                <Box>
                    <Button sx={sxPrimaryBtn}>
                        <IosShare sx={{
                            scale: '0.7'
                        }}/> Share Link
                    </Button>
                </Box>
                <Box>
                    <IconButton sx={sxBtnCircleActive}>
                        <AspectRatio />
                    </IconButton>
                </Box>
            </Stack>
        </Stack>
    );
};

export default MeetingHeaderLayout;