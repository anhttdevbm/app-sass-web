import { createAsyncThunk } from "@reduxjs/toolkit";
import { HttpStatusCode } from "constant/enums";
import {
    AN_ERROR_TRY_AGAIN,
    CONTENT_API_URL,
} from "constant/index";
import { BaseQueries } from "constant/types";
import StringFormat from "string-format";
import { Endpoint } from "api/endpoint";
import { client } from "api/client";
import { ExploreFormData } from "./selectors"
import { 
  ContentData, 
  ArticleData, 
  StartMemberData, 
  StartMemberFormData, 
  BannerCenterData ,
  PromoteData,
  UnlockValueData
} from "./reducer";

// Home
export const getHomeBanner = createAsyncThunk(
    "content/getHomeBanner",
    async () => {    
      try {
        const response = await client.get(Endpoint.CONTENT_HOME_BANNER, undefined, {
          baseURL: CONTENT_API_URL,
        });
  
        if (response?.status === HttpStatusCode.OK) {
          return response.data;
        }
        throw AN_ERROR_TRY_AGAIN;
      } catch (error) {
        throw error;
      }
    },
);

export const updateHomeBanner = createAsyncThunk(
  "content/updateHomeBanner",
  async ({ data }: { data: string }) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.CONTENT_HOME_BANNER),
        { data },
        {
          baseURL: CONTENT_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getHomeExplore = createAsyncThunk(
  "content/getHomeExplore",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_HOME_EXPLORE, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateHomeExplore = createAsyncThunk(
  "content/updateHomeExplore",
  async (explores: ExploreFormData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_HOME_EXPLORE, {
        data: explores
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getHomePower = createAsyncThunk(
  "content/getHomePower",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_HOME_POWER, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateHomePower = createAsyncThunk(
  "content/updateHomePower",
  async (explores: ExploreFormData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_HOME_POWER, {
        data: explores
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

// About us
export const getAboutUsQuestion = createAsyncThunk(
  "content/getAboutUsQuestion",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_ABOUT_US_QUESTIONS, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAboutUsQuestion = createAsyncThunk(
  "content/updateAboutUsQuestion",
  async (questions: ContentData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_ABOUT_US_QUESTIONS, {
        data: questions
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getAboutUsMission = createAsyncThunk(
  "content/getAboutUsMission",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_ABOUT_US_MISSIONS, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAboutUsMission = createAsyncThunk(
  "content/updateAboutUsMission",
  async (missions: ContentData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_ABOUT_US_MISSIONS, {
        data: missions
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getAboutUsMostViewArticles = createAsyncThunk(
  "content/getAboutUsMostViewArticles",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_ABOUT_US_MOST_VIEW_ARTICLES, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAboutUsMostViewArticles = createAsyncThunk(
  "content/updateAboutUsMostViewArticles",
  async (articles: ArticleData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_ABOUT_US_MOST_VIEW_ARTICLES, {
        data: articles
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getAboutUsMembers = createAsyncThunk(
  "content/getAboutUsMembers",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_ABOUT_US_ALL_START_TEAM, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const createAboutUsMember = createAsyncThunk(
  "content/createAboutUsMember",
  async (member: StartMemberFormData) => {    
    try {
      const response = await client.post(Endpoint.CONTENT_ABOUT_US_ALL_START_TEAM, {
        data: member
      },
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAboutUsMember = createAsyncThunk(
  "content/updateAboutUsMember",
  async ({id, params} : {id: number | undefined, params: StartMemberFormData}) => {    
    try {
      const response = await client.put(StringFormat(Endpoint.CONTENT_ABOUT_US_ONE_START_TEAM, { id }), {
        data: params
      },
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const deleteAboutUsMember = createAsyncThunk(
  "content/deleteAboutUsMember",
  async ({id} : {id: number | undefined}) => {    
    try {
      const response = await client.delete(StringFormat(Endpoint.CONTENT_ABOUT_US_ONE_START_TEAM, { id }),
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getAboutUsBanners = createAsyncThunk(
  "content/getAboutUsBanners",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_ABOUT_US_BANNER, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAboutUsBanners = createAsyncThunk(
  "content/updateAboutUsBanners",
  async (data: string[]) => {
    try {
      const response = await client.put(
        StringFormat(Endpoint.CONTENT_ABOUT_US_BANNER),
        { data },
        {
          baseURL: CONTENT_API_URL,
        },
      );

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
// Help center

export const getHelpCenterBanner = createAsyncThunk(
  "content/getHelpCenterBanner",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_HELP_CENTER_BANNER, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateHelpCenterBanner = createAsyncThunk(
  "content/updateHelpCenterBanner",
  async (banners: BannerCenterData) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_HELP_CENTER_BANNER, {
        data: banners
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getHelpCenterUsageTips = createAsyncThunk(
  "content/getHelpCenterUsageTips",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_HELP_CENTER_USAGE_TIPS, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateHelpCenterUsageTips = createAsyncThunk(
  "content/updateHelpCenterUsageTips",
  async (banners: ContentData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_HELP_CENTER_USAGE_TIPS, {
        data: banners
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

// Trust Center
export const getTrustCenterBanner = createAsyncThunk(
  "content/getTrustCenterBanner",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_TRUST_CENTER_BANNER, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateTrustCenterBanner = createAsyncThunk(
  "content/updateTrustCenterBanner",
  async (banners: BannerCenterData) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_TRUST_CENTER_BANNER, {
        data: banners
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getTrustCenterBuildingTrust = createAsyncThunk(
  "content/getTrustCenterBuildingTrust",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_TRUST_CENTER_BUILDING_TRUST, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateTrustCenterBuildingTrust = createAsyncThunk(
  "content/updateTrustCenterBuildingTrust",
  async (banners: ContentData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_TRUST_CENTER_BUILDING_TRUST, {
        data: banners
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

// AI
export const getAIBanner = createAsyncThunk(
  "content/getAIBanner",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_AI_BANNER, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAIBanner = createAsyncThunk(
  "content/updateAIBanner",
  async (banners: ContentData) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_AI_BANNER, {
        data: banners
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getAIBrands = createAsyncThunk(
  "content/getAIBrands",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_AI_BRANDS, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAIBrands = createAsyncThunk(
  "content/updateAIBrands",
  async (brands: ArticleData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_AI_BRANDS, {
        data: brands
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getAIProductivity = createAsyncThunk(
  "content/getAIProductivity",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_AI_PRODUCTIVITY, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAIProductivity = createAsyncThunk(
  "content/updateAIProductivity",
  async (explores: ExploreFormData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_AI_PRODUCTIVITY, {
        data: explores
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getAIPromote = createAsyncThunk(
  "content/getAIPromote",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_AI_PROMOTE, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updateAIPromote = createAsyncThunk(
  "content/updateAIPromote",
  async (promote: PromoteData) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_AI_PROMOTE, {
        data: promote
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

// Pricing
export const getPricingBanner = createAsyncThunk(
  "content/getPricingBanner",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_PRICING_BANNER, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updatePricingBanner = createAsyncThunk(
  "content/updatePricingBanner",
  async (banners: ContentData) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_PRICING_BANNER, {
        data: banners
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getPricingBannerTwo = createAsyncThunk(
  "content/getPricingBannerTwo",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_PRICING_BANNER2, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updatePricingBannerTwo = createAsyncThunk(
  "content/updatePricingBannerTwo",
  async (banners: ContentData) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_PRICING_BANNER2, {
        data: banners
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getPricingPartners = createAsyncThunk(
  "content/getPricingPartners",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_PRICING_PARTNERS, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updatePricingPartners = createAsyncThunk(
  "content/updatePricingPartners",
  async (partners: ArticleData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_PRICING_PARTNERS, {
        data: partners
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getPricingUnlockValues = createAsyncThunk(
  "content/getPricingUnlockValues",
  async () => {    
    try {
      const response = await client.get(Endpoint.CONTENT_PRICING_UNLOCK, undefined,
      {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const updatePricingUnlockValues = createAsyncThunk(
  "content/updatePricingUnlockValues",
  async (items: UnlockValueData[]) => {    
    try {
      const response = await client.put(Endpoint.CONTENT_PRICING_UNLOCK, {
        data: items
      }, {
        baseURL: CONTENT_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);
    