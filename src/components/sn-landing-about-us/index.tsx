"use client";
import Banners from "./Banner";
import Question from "./Question";
import Mission from "./Mission";
import MostViewedArticles from "./MosViewedArticles"
import StarTeamMember from "./StarTeamMember";
import { Grid } from "@mui/material";

const LandingAboutUsPage = () => {
    return (
        <>
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
        </>
    )
}

export default LandingAboutUsPage