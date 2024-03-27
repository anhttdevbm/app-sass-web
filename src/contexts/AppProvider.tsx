"use client";

import { store } from "store/configureStore";
import { Provider } from "react-redux";
import ThemeProvider from "./ThemeProvider";
import { useCallback, useEffect, useRef } from "react";
import { clientStorage } from "utils/storage";
import { ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { usePathname, useRouter } from "next-intl/client";
import {
  SIGNIN_PATH,
  SIGNUP_PATH,
  FORGOT_PASSWORD_PATH,
  RESET_PASSWORD_PATH,
  LANDING_HOME_PATH,
} from "constant/paths";
import { updateAuth, toggleAppReady, UserInfo } from "store/app/reducer";
import Snackbar from "components/Snackbar";
import AppLoading from "components/AppLoading";
import { useAppSelector } from "store/hooks";
import { Locale } from "constant/types";
import { AbstractIntlMessages } from "next-intl";
import NextIntlProvider from "./NextIntlProvider";
import { getProfile } from "store/app/actions";
// import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { QueryClient, QueryClientProvider } from "react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const AUTH_PATHS = [SIGNUP_PATH, FORGOT_PASSWORD_PATH, RESET_PASSWORD_PATH];
const LANDING_PATHS = [LANDING_HOME_PATH];

const AppProvider = ({
  children,
  locale,
  messages,
}: {
  children: React.ReactNode;
  locale: Locale;
  messages: AbstractIntlMessages;
}) => {
  const { replace } = useRouter();

  const pathname = usePathname();

  const replaceRef = useRef<AppRouterInstance["replace"] | undefined>();

  useEffect(() => {
    replaceRef.current = replace;
  }, [replace]);

  useEffect(() => {
    const accessToken = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);

    const isResetPath = pathname.startsWith(RESET_PASSWORD_PATH);

    if (
      !accessToken &&
      replaceRef.current &&
      !AUTH_PATHS.includes(pathname) &&
      !LANDING_PATHS.includes(pathname) &&
      !isResetPath
    ) {
      replaceRef.current(SIGNIN_PATH);
    }

    store.dispatch(updateAuth({ accessToken }));
    if (accessToken) {
      store.dispatch(getProfile());
    } else {
      store.dispatch(toggleAppReady(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSetViewHeight = useCallback(() => {
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }, []);

  useEffect(() => {
    onSetViewHeight();

    window.addEventListener("resize", () => {
      onSetViewHeight();
    });
  }, [onSetViewHeight]);

  const queryClient: QueryClient = new QueryClient();

  return (
    <NextIntlProvider locale={locale} messages={messages}>
      <ThemeProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <QueryClientProvider client={queryClient}>
            <Provider store={store}>
              <AuthWrapper>{children}</AuthWrapper>
            </Provider>
          </QueryClientProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </NextIntlProvider>
  );
};

export default AppProvider;

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const appReady = useAppSelector((state) => state.app.appReady);
  const token = useAppSelector((state) => state.app.token);

  useEffect(() => {
    if (token) {
      document.body.classList.remove("not-auth");
    } else {
      document.body.classList.add("not-auth");
    }
  }, [token]);

  if (!appReady) return <AppLoading />;

  return (
    <>
      {children}
      <Snackbar />
    </>
  );
};
