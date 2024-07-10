"use client";
import Banners from "./Banner";
import Question from "./Question";
import Mission from "./Mission";
import MostViewedArticles from "./MosViewedArticles"
import StarTeamMember from "./StarTeamMember";
import { Grid, Stack } from "@mui/material";

const LandingAboutUsPage = () => {
    return (
        <Stack overflow="auto" height="100vh">
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Banners />
                </Grid>
                <Grid item xs={12} md={6}>
                    <MostViewedArticles />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Question />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Mission />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <StarTeamMember />
                </Grid>
            </Grid>
        </Stack>
    )
}

export default LandingAboutUsPage