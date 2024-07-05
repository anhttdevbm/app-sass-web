import { Box, Typography } from "@mui/material";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import React, { FC } from "react";

interface NoDataProps {
    height?: 'auto' | 'full'
}

const NoData: FC<NoDataProps> = ({ height = 'auto' }) => {
    const t = useTranslations(NS_COMMON);
    return (
        <Box width="100%" height={height === 'full' ? 'calc(var(--vh, 1vh) * 100)' : height} display="flex" alignItems="center" justifyContent="center">
            <Typography
                sx={{
                    fontSize: "14px",
                    lineHeight: "20px",
                    fontWeight: 600,
                }}
            >
                {t("noData")}
            </Typography>
        </Box>
    )
};
export default NoData;
