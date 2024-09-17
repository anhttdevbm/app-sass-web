import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ACCESS_TOKEN_STORAGE_KEY,
  REFRESH_TOKEN_STORAGE_KEY,
} from "constant/index";
import { User } from "constant/types";
import { StaticImageData } from "next/image";
import { uuid } from "utils";
import { clientStorage } from "utils/storage";
import {
  getProfile,
  signin,
  signup,
  signupVerify,
  updateUserInfo,
} from "./actions";

export interface Snackbar {
  message: string;
  severity?: "success" | "info" | "warning" | "error";
  expiredIn?: number;
}

export type SnackbarItem = Snackbar & {
  id: string;
};

export interface UserInfo extends User {
  created_time: string;
  department: string;
  is_active: boolean;
  approve?: boolean;
  updated_time: string;
  date_end_using: string;
  date_start_using: string;
  is_pay_user: boolean;
  // id?: string;
  auto_renewal?: boolean;
  packageName?: string;
}

export type HeaderConfig = {
  prevPath?: string;
  title?: string;
  searchPlaceholder?: string;
  endpoint?: string;
  key?: string;
  imageUrl?: string | StaticImageData;
};

export enum SignupStep {
  SIGNUP = 1,
  VERIFY,
}

export interface AppState {
  appReady: boolean;
  snackbarList: SnackbarItem[];
  notificationList: any[];
  token?: string;
  user?: UserInfo;

  signupStep: SignupStep;
  tokenRegister?: string;

  headerConfig: HeaderConfig;

  isExpandedSidebar: boolean;
}

const initialState: AppState = {
  appReady: false,
  snackbarList: [],
  notificationList: [],

  signupStep: SignupStep.SIGNUP,

  headerConfig: {},

  isExpandedSidebar: true,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    addSnackbar: (state, action: PayloadAction<Snackbar>) => {
      state.snackbarList.push({
        id: uuid(),
        ...action.payload,
      });
    },
    addNotification: (state, action) => {
      const indexElm = state.notificationList.findIndex(
        (item) => item?.id === action.payload?.id,
      );
      if (indexElm === -1) {
        state.notificationList.push(action.payload);
      }
    },
    removeSnackbar: (state, action: PayloadAction<string>) => {
      const indexDeleted = state.snackbarList.findIndex(
        (item) => item.id === action.payload,
      );
      if (indexDeleted !== -1) {
        state.snackbarList.splice(indexDeleted, 1);
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const indexDeleted = state.notificationList.findIndex(
        (item) => item.id === action.payload,
      );
      if (indexDeleted !== -1) {
        state.notificationList.splice(indexDeleted, 1);
      }
    },
    toggleAppReady: (state, action: PayloadAction<boolean | undefined>) => {
      state.appReady = action?.payload ?? !state.appReady;
    },
    updateAuth: (
      state,
      action: PayloadAction<{
        accessToken?: string | null;
        user?: UserInfo | null;
      }>,
    ) => {
      const { accessToken, user } = action.payload;
      state.token = accessToken || undefined;
      state.user = user || undefined;
    },
    clearAuth: (state) => {
      state.token = undefined;
      state.user = undefined;

      clientStorage.remove(ACCESS_TOKEN_STORAGE_KEY);
      clientStorage.remove(REFRESH_TOKEN_STORAGE_KEY);
    },
    updateHeaderConfig: (state, action: PayloadAction<HeaderConfig>) => {
      state.headerConfig = Object.assign(state.headerConfig, action.payload);
    },
    toggleExpandSidebar: (
      state,
      action: PayloadAction<boolean | undefined>,
    ) => {
      state.isExpandedSidebar = action?.payload ?? !state.isExpandedSidebar;
    },
    reset: () => ({ ...initialState, appReady: true }),
  },
  extraReducers: (builder) =>
    builder
      .addCase(
        signin.fulfilled,
        (
          state,
          action: PayloadAction<
            UserInfo & { accessToken: string; refreshToken: string }
          >,
        ) => {
          const { accessToken, refreshToken, ...userInfo } = action.payload;

          clientStorage.set(ACCESS_TOKEN_STORAGE_KEY, accessToken);
          clientStorage.set(REFRESH_TOKEN_STORAGE_KEY, refreshToken);

          state.token = accessToken;
          state.user = userInfo;
        },
      )
      .addCase(signup.fulfilled, (state, action) => {
        state.signupStep = SignupStep.VERIFY;
        state.tokenRegister = action.payload.registerToken;
      })
      .addCase(signupVerify.fulfilled, (state) => {
        state.signupStep = SignupStep.SIGNUP;
        state.tokenRegister = undefined;
      })
      .addCase(
        updateUserInfo.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.user = Object.assign(state?.user ?? {}, action.payload);
        },
      )
      .addCase(
        getProfile.fulfilled,
        (state, action: PayloadAction<UserInfo>) => {
          state.user = Object.assign(state?.user ?? {}, action.payload);
          state.appReady = true;
        },
      ),
});

export const {
  addSnackbar,
  addNotification,
  removeSnackbar,
  removeNotification,
  toggleAppReady,
  clearAuth,
  updateAuth,
  updateHeaderConfig,
  toggleExpandSidebar,
  reset,
} = appSlice.actions;

export default appSlice.reducer;
