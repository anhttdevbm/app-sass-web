"use client";
import BannerHomePage from "./Banner";
import ExploreHowWe from "./ExploreHowWe";
import PowerFullAgent from "./PowerFullAgent";
import {
    Grid,
    Stack,
    TextField,
  } from "@mui/material";

export { BannerHomePage, ExploreHowWe, PowerFullAgent };

const LandingHomePage = () => {
    return (
        <Stack overflow="auto" height="100vh">
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <BannerHomePage />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <ExploreHowWe />
                </Grid>
                <Grid item xs={12} md={6}>
                    <PowerFullAgent />
                </Grid>
            </Grid>
        </Stack>
    )
}

export default LandingHomePage