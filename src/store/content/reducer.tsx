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
    getAIBanner,
    getAIBrands,
    getAIProductivity,
    getAIPromote,
    getPricingBanner,
    getPricingBannerTwo,
    getPricingPartners,
    getPricingUnlockValues,
    updatePricingUnlockValues
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
    image?: Attachment | undefined | any,
    image2?: Attachment | undefined | any,
    linkCTA?: string,
    linkCTA2?: string
    imageUpload?: File | undefined
    imageUpload2?: File | undefined
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

export interface PromoteData {
    image: Attachment | string | any,
    imageUpload?: File | undefined,
    items: ContentData[]
}

export interface TagData {
    tag: string;
}

export interface UnlockValueData {
    name: string,
    tag: string,
    description: string,
    monthly: string | number,
    yearly: string | number,
    features: string[],
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
    buildingTrust: ContentData[],
    aiBanner: ContentData | null,
    brands: ArticleData[],
    productivities: ExploreData[],
    promote: PromoteData | null,
    pricingBanner: ContentData | null,
    pricingBanner2: ContentData | null,
    partners: ArticleData[],
    unlockValues: UnlockValueData[]
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
    buildingTrust: [],
    aiBanner: null,
    brands: [],
    productivities: [],
    promote: null,
    pricingBanner: null,
    pricingBanner2: null,
    partners: [],
    unlockValues: []
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
            // AI
            .addCase(getAIBanner.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAIBanner.fulfilled, (state, action: PayloadAction<ContentData>) => {
                const banner = action.payload;
        
                state.aiBanner = banner
                state.contentStatus = DataStatus.SUCCEEDED;
            })
            .addCase(getAIBanner.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            .addCase(getAIBrands.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAIBrands.fulfilled, (state, action: PayloadAction<ArticleData[]>) => {
                const brands = action.payload;
        
                state.brands = brands
                state.contentStatus = DataStatus.SUCCEEDED;
            })
            .addCase(getAIBrands.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            .addCase(getAIProductivity.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAIProductivity.fulfilled, (state, action: PayloadAction<ExploreData[]>) => {
                const productivities = action.payload;
        
                state.productivities = productivities
                state.contentStatus = DataStatus.SUCCEEDED;
            })
            .addCase(getAIProductivity.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            .addCase(getAIPromote.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getAIPromote.fulfilled, (state, action: PayloadAction<PromoteData>) => {
                const promote = action.payload;
        
                state.promote = promote
                state.contentStatus = DataStatus.SUCCEEDED;
            })
            .addCase(getAIPromote.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            // Pricing
            .addCase(getPricingBanner.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getPricingBanner.fulfilled, (state, action: PayloadAction<PromoteData>) => {
                const banner = action.payload;
        
                state.pricingBanner = banner
                state.contentStatus = DataStatus.SUCCEEDED;
            })
            .addCase(getPricingBanner.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            .addCase(getPricingBannerTwo.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getPricingBannerTwo.fulfilled, (state, action: PayloadAction<PromoteData>) => {
                const banner = action.payload;
        
                state.pricingBanner2 = banner
                state.contentStatus = DataStatus.SUCCEEDED;
            })
            .addCase(getPricingBannerTwo.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            .addCase(getPricingPartners.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getPricingPartners.fulfilled, (state, action: PayloadAction<ArticleData[]>) => {
                const partners = action.payload;
        
                state.partners = partners
                state.contentStatus = DataStatus.SUCCEEDED;
            })
            .addCase(getPricingPartners.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })

            .addCase(getPricingUnlockValues.pending, (state, action) => {
                state.contentStatus = DataStatus.LOADING;
            })
            .addCase(getPricingUnlockValues.fulfilled, (state, action: PayloadAction<UnlockValueData[]>) => {
                const unlockValues = action.payload;
        
                state.unlockValues = unlockValues
                state.contentStatus = DataStatus.SUCCEEDED;
            })
            .addCase(getPricingUnlockValues.rejected, (state, action) => {
                state.contentStatus = DataStatus.FAILED
                state.contentError = action.error?.message ?? AN_ERROR_TRY_AGAIN;
            })
            .addCase(updatePricingUnlockValues.fulfilled, (state, action) => {                
                const unlockValues = action.meta.arg;
        
                state.unlockValues = unlockValues
                state.contentStatus = DataStatus.SUCCEEDED;
            })
})

export const { reset } = contentSlice.actions;

export default contentSlice.reducer;