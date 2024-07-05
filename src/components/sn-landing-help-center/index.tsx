"use client";
import { Grid } from "@mui/material";
import Banners from "./Banners";
import UsageTips from "./UsageTips" 

const LandingHelpCenterPage = () => {
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Banners />
                </Grid>
                <Grid item xs={12} md={6}>
                    <UsageTips />
                </Grid>
            </Grid>
        </>
    )
}

export default LandingHelpCenterPage