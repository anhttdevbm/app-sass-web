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
import { ExploreData } from "./reducer";
import {ExploreFormData} from "./selectors"

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