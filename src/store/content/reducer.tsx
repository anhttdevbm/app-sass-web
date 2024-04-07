import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Attachment } from "constant/types"
import { DataStatus, PayStatus } from "constant/enums";
import { 
    getHomeBanner, 
    getHomeExplore, 
    getHomePower,
    getAboutUsQuestion, 
    updateAboutUsQuestion,
    getAboutUsMission,
    updateAboutUsMission,
    getAboutUsMostViewArticles,
    getAboutUsMembers,
    createAboutUsMember,
    updateAboutUsMember,
    deleteAboutUsMember,
    getAboutUsBanners,
    updateAboutUsBanners,
    getHelpCenterBanner,
    updateHelpCenterBanner,
    getHelpCenterUsageTips,
    getTrustCenterBanner,
    updateTrustCenterBanner,
    getTrustCenterBuildingTrust,
 } from "./actions";
import { AN_ERROR_TRY_AGAIN, DEFAULT_PAGING } from "constant/index";

export interface ExploreData {
    title: string,
    tab_name: string,
    description: string,
    image: Attachment,
    linkCTA: string,
    imageUpload?: File | undefined
}

export type ArticleData = {
    name: string,
    logo: Attachment
    logoUpload?: File | undefined
}

export interface ContentData {
    title?: string | undefined,
    description?: string | undefined,
    image?: Attachment | undefined,
    linkCTA?: string
    imageUpload?: File | undefined
}
export interface StartMemberData {
    id?: number | undefined,
    name: string,
    work_experience: string,
    college: string
    description: string,
    avatar: Attachment,
    avatarUpload?: File | undefined,
    email: string,
    position: string,
    social_link: string,
    detail: string,
}

export interface StartMemberFormData {
    name: string,
    work_experience: string,
    college: string
    description: string,
    avatar: string,
    email: string,
    position: string,
    social_link: string,
    detail: string,
}

export interface BannerCenterData {
    banner_title?: string,
    banner_description?: string,
    description: string,
    banner_image: any | Attachment | string,
    bannerUpload?: File | undefined,
}
export interface ContentState {
    banner?: Attachment | null,
    contentStatus: DataStatus,
    contentError?: string,
    explores: ExploreData[]
    powers: ExploreData[]
    missions: ContentData[],
    questions: ContentData[],
    articles: ArticleData[],
    members: StartMemberData[],
    aboutBanners: Attachment[],
    centerBanner: BannerCenterData | null,
    usageTips: ContentData[],
    buildingTrust: ContentData[]
}

const initialState: ContentState = {
    banner: null,
    contentStatus: DataStatus.IDLE,
    contentError: "",
    explores: [],
    powers: [],
    missions: [],
    questions: [],
    articles: [],
    members: [],
    aboutBanners: [],
    centerBanner: null ,
    usageTips: [],
    buildingTrust: []
}

const contentSlice = createSlice({
    name: "content",
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => 
        builder
            // Home Page
            .addCase(getHomeBanner.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getHomeBanner.fulfilled, (state, action: PayloadAction<Attachment>) => {
                const banner = action.payload;
        
                state.banner = banner
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getHomeBanner.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            .addCase(getHomeExplore.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getHomeExplore.fulfilled, (state, action: PayloadAction<ExploreData[]>) => {
                const explores = action.payload;
        
                state.explores = explores
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getHomeExplore.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            .addCase(getHomePower.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getHomePower.fulfilled, (state, action: PayloadAction<ExploreData[]>) => {
                const powers = action.payload;
        
                state.powers = powers
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getHomePower.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            // About us page
            // Question
            .addCase(getAboutUsQuestion.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAboutUsQuestion.fulfilled, (state, action: PayloadAction<ExploreData[]>) => {
                const questions = action.payload;
        
                state.questions = questions
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getAboutUsQuestion.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            .addCase(updateAboutUsQuestion.fulfilled, (state, action) => {                
                state.contentStatus = DataStatus.SUCCEEDED;
                if (!action?.meta.arg.length) return
                state.missions = action?.meta.arg
            })
            
            .addCase(getAboutUsMission.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAboutUsMission.fulfilled, (state, action: PayloadAction<ExploreData[]>) => {
                const missions = action.payload;
        
                state.missions = missions
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getAboutUsMission.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            .addCase(updateAboutUsMission.fulfilled, (state, action) => {                
                state.contentStatus = DataStatus.SUCCEEDED;
                if (!action?.meta.arg.length) return
                state.missions = action?.meta.arg
            })

            .addCase(getAboutUsMostViewArticles.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAboutUsMostViewArticles.fulfilled, (state, action: PayloadAction<ArticleData[]>) => {
                const articles = action.payload;
        
                state.articles = articles
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getAboutUsMostViewArticles.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            .addCase(getAboutUsMembers.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAboutUsMembers.fulfilled, (state, action: PayloadAction<StartMemberData[]>) => {
                const members = action.payload;
        
                state.members = members
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getAboutUsMembers.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            .addCase(getAboutUsBanners.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAboutUsBanners.fulfilled, (state, action: PayloadAction<Attachment[]>) => {
                const banners = action.payload;
        
                state.aboutBanners = banners
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getAboutUsBanners.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            // Help center
            .addCase(getHelpCenterBanner.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getHelpCenterBanner.fulfilled, (state, action: PayloadAction<BannerCenterData>) => {
                const banner = action.payload;
        
                state.centerBanner = banner
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getHelpCenterUsageTips.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            .addCase(getHelpCenterUsageTips.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getHelpCenterUsageTips.fulfilled, (state, action: PayloadAction<ContentData[]>) => {
                const usageTips = action.payload;
        
                state.usageTips = usageTips
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getHelpCenterBanner.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            // Trust center
            .addCase(getTrustCenterBanner.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getTrustCenterBanner.fulfilled, (state, action: PayloadAction<BannerCenterData>) => {
                const banner = action.payload;
        
                state.centerBanner = banner
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getTrustCenterBanner.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            .addCase(getTrustCenterBuildingTrust.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getTrustCenterBuildingTrust.fulfilled, (state, action: PayloadAction<ContentData[]>) => {
                const buildingTrust = action.payload;
        
                state.buildingTrust = buildingTrust
                state.contentStatus = DataStatus.SUCCEEDED;
                },
            )
            .addCase(getTrustCenterBuildingTrust.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

})

export const { reset } = contentSlice.actions;

export default contentSlice.reducer;