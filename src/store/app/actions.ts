import { createAsyncThunk } from "@reduxjs/toolkit";
import { client } from "api/client";
import { Endpoint } from "api/endpoint";
import { HttpStatusCode } from "constant/enums";
import {
  AN_ERROR_TRY_AGAIN,
  AN_ERROR_TRY_RELOAD_PAGE,
  AUTH_API_URL,
} from "constant/index";
import { State } from "store/configureStore";
import { UserInfo } from "./reducer";

export type SigninData = {
  email: string;
  password: string;
};

export type SignupData = {
  email: string;
  username: string;
  password: string;
  phone?: string;
  fullname: string;
  avatar?: string[];
};

export type ResetPasswordData = {
  token: string;
  password: string;
};

export type UpdateUserInfoData = {
  phone?: string;
  address?: string;
  fullname?: string;
  avatar?: string | string[];
};

export type ChangePasswordData = {
  old_password: string;
  new_password: string;
};

export const signin = createAsyncThunk(
  "app/signin",
  async (data: SigninData) => {
    try {
      const response = await client.post(Endpoint.SIGNIN, data, {
        baseURL: AUTH_API_URL,
      });
      

      if (response?.status === HttpStatusCode.OK) {
        return response.data as UserInfo & {
          accessToken: string;
          refreshToken: string;
        };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const signup = createAsyncThunk(
  "app/signup",
  async (data: SignupData) => {
    try {
      const response = await client.post(Endpoint.SIGNUP, data, {
        baseURL: AUTH_API_URL,
      });

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data as { registerToken: string };
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const signupVerify = createAsyncThunk(
  "app/signupVerify",
  async (code: string, { getState }) => {
    try {
      const state = getState() as State;
      const tokenRegister = state.app.tokenRegister;
      if (!tokenRegister) {
        throw AN_ERROR_TRY_RELOAD_PAGE;
      }
      const response = await client.post(
        Endpoint.VERIFY,
        { code },
        {
          baseURL: AUTH_API_URL,
          headers: {
            tokenRegister,
          },
        },
      );

      if (response?.status === HttpStatusCode.CREATED) {
        return response.data;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const forgot = createAsyncThunk("app/forgot", async (email: string) => {
  try {
    const response = await client.post(
      Endpoint.FORGOT_PASSWORD,
      { email },
      { baseURL: AUTH_API_URL },
    );

    if (response?.status === HttpStatusCode.OK) {
      return response.data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    throw error;
  }
});

export const resetPassword = createAsyncThunk(
  "app/resetPassword",
  async ({ password, token }: ResetPasswordData) => {
    try {
      const response = await client.post(
        Endpoint.RESET_PASSWORD,
        { password },
        {
          baseURL: AUTH_API_URL,
          headers: {
            "reset-password-token": token,
          },
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

export const updateUserInfo = createAsyncThunk(
  "app/updateUserInfo",
  async (data: UpdateUserInfoData) => {
    try {
      const response = await client.put(Endpoint.PROFILE, data, {
        baseURL: AUTH_API_URL,
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

export const changePassword = createAsyncThunk(
  "app/changePassword",
  async (data: ChangePasswordData) => {
    try {
      const response = await client.post(Endpoint.CHANGE_PASSWORD, data, {
        baseURL: AUTH_API_URL,
      });

      if (response?.status === HttpStatusCode.OK) {
        return true;
      }
      throw AN_ERROR_TRY_AGAIN;
    } catch (error) {
      throw error;
    }
  },
);

export const getProfile = createAsyncThunk("app/getProfile", async () => {
  try {
    const response = await client.get(Endpoint.PROFILE, undefined, {
      baseURL: AUTH_API_URL,
    });

    if (response?.status === HttpStatusCode.OK) {
      return response.data;
    }
    throw AN_ERROR_TRY_AGAIN;
  } catch (error) {
    throw error;
  }
});
