"use client";
import { Grid } from "@mui/material";
import Banners from "./Banners";
import BuildingTrust from "./BuildingTrust" 
import React, { memo } from "react";

const LandingTrustCenterPage = () => {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Banners />
                </Grid>
                <Grid item xs={12} md={6}>
                    <BuildingTrust />
                </Grid>
            </Grid>
        </>
    )
}

export default memo(LandingTrustCenterPage)