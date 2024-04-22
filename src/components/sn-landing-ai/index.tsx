"use client";
import { Grid } from "@mui/material";
import Banners from "./Banners";
import Brands from "./Brands" 
import Productivity from "./Productivity" 
import PromoteOperation from "./PromoteOperation" 

import React, { memo } from "react";

const LandingAIPage = () => {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Banners />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Brands />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Productivity />
                </Grid>
                <Grid item xs={12} md={6}>
                    <PromoteOperation />
                </Grid>
            </Grid>
        </>
    )
}

export default memo(LandingAIPage)