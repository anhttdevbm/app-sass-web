import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
  addNotification,
  addSnackbar,
  clearAuth,
  HeaderConfig,
  removeNotification,
  removeSnackbar,
  Snackbar,
  toggleAppReady,
  toggleExpandSidebar,
  updateHeaderConfig,
} from "./reducer";
import {
  ChangePasswordData,
  ResetPasswordData,
  SigninData,
  SignupData,
  UpdateUserInfoData,
  changePassword,
  forgot,
  getProfile,
  resetPassword,
  signin,
  signup,
  signupVerify,
  updateUserInfo,
} from "./actions";
import { shallowEqual } from "react-redux";

export const useSnackbar = () => {
  const dispatch = useAppDispatch();

  const { snackbarList, notificationList } = useAppSelector(
    (state) => state.app,
  );

  const onAddSnackbar = useCallback(
    (
      message: Snackbar["message"],
      severity?: Snackbar["severity"],
      expiredIn?: Snackbar["expiredIn"],
    ) => {
      dispatch(addSnackbar({ message, severity, expiredIn }));
    },
    [dispatch],
  );

  const onAddNotification = useCallback(
    (notification) => {
      dispatch(addNotification(notification));
    },
    [dispatch],
  );

  const onRemoveSnackbar = useCallback(
    (snackbarId: string) => {
      dispatch(removeSnackbar(snackbarId));
    },
    [dispatch],
  );

  const onRemoveNotification = useCallback(
    (notiId: string) => {
      dispatch(removeNotification(notiId));
    },
    [dispatch],
  );

  return {
    snackbarList,
    notificationList,
    onAddSnackbar,
    onAddNotification,
    onRemoveSnackbar,
    onRemoveNotification,
  };
};

export const useAppReady = () => {
  const dispatch = useAppDispatch();

  const appReady = useAppSelector((state) => state.app.appReady);

  const onToggleAppReady = useCallback(
    (newStatus?: boolean) => {
      dispatch(toggleAppReady(newStatus));
    },
    [dispatch],
  );

  return { appReady, onToggleAppReady };
};

export const useSidebar = () => {
  const dispatch = useAppDispatch();

  const isExpandedSidebar = useAppSelector(
    (state) => state.app.isExpandedSidebar,
  );

  const onToggleExpandSidebar = useCallback(
    (newStatus?: boolean) => {
      dispatch(toggleExpandSidebar(newStatus));
    },
    [dispatch],
  );

  return { isExpandedSidebar, onToggleExpandSidebar };
};

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const { token, user, signupStep } = useAppSelector(
    (state) => state.app,
    shallowEqual,
  );

  const isLoggedIn = useMemo(() => !!token, [token]);

  const onSignin = useCallback(
    async (data: SigninData) => {
      try {
        return await dispatch(signin(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onSignup = useCallback(
    async (data: SignupData) => {
      try {
        return await dispatch(signup(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onVerify = useCallback(
    async (code: string) => {
      try {
        return await dispatch(signupVerify(code)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onForgot = useCallback(
    async (email: string) => {
      try {
        return await dispatch(forgot(email)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onResetPassword = useCallback(
    async (data: ResetPasswordData) => {
      try {
        return await dispatch(resetPassword(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onSignOut = useCallback(() => {
    dispatch(clearAuth());
  }, [dispatch]);

  const onGetProfile = useCallback(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return {
    token,
    user,
    isLoggedIn,
    onSignin,
    onSignup,
    onSignOut,
    signupStep,
    onVerify,
    onForgot,
    onResetPassword,
    onGetProfile,
  };
};

export const useUserInfo = () => {
  const dispatch = useAppDispatch();

  const onUpdateUserInfo = useCallback(
    async (data: UpdateUserInfoData) => {
      try {
        return await dispatch(updateUserInfo(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  const onChangePassword = useCallback(
    async (data: ChangePasswordData) => {
      try {
        return await dispatch(changePassword(data)).unwrap();
      } catch (error) {
        throw error;
      }
    },
    [dispatch],
  );

  return {
    onUpdateUserInfo,
    onChangePassword,
  };
};

export const useHeaderConfig = () => {
  const dispatch = useAppDispatch();

  const { headerConfig } = useAppSelector((state) => state.app, shallowEqual);

  const onUpdateHeaderConfig = useCallback(
    (data: HeaderConfig) => {
      dispatch(updateHeaderConfig(data));
    },
    [dispatch],
  );

  return {
    headerConfig,
    ...headerConfig,
    onUpdateHeaderConfig,
  };
};
