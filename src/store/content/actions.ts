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
  BannerCenterData 
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
  async () => {    
    try {
      const response = await client.delete(Endpoint.CONTENT_ABOUT_US_ONE_START_TEAM,
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