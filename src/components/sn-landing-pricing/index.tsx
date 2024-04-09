"use client";
import { Grid } from "@mui/material";
import Banner1 from "./Banners/Banner1";
import Banner2 from "./Banners/Banner2";
import Partners from "./Partners" 
import UnlockValue from "./UnlockValue" 

import React, { memo } from "react";

const LandingPricingPage = () => {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Banner1 />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Banner2 />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Partners />
                </Grid>
                <Grid item xs={12} md={6}>
                    <UnlockValue />
                </Grid>
            </Grid>
        </>
    )
}

export default memo(LandingPricingPage)