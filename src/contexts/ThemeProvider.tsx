/* eslint-disable react/jsx-no-comment-textnodes */
"use client";

import { typography, breakpoints } from "public/material";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  getInitColorSchemeScript,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import colorSchemes from "utils/colorSchemes";
import { DARK_THEME_MEDIA_SYSTEM, DEFAULT_MODE } from "constant/index";
import { ThemeMode } from "constant/enums";
import { useCallback, useRef, useEffect } from "react";
import { getThemeSystem, getTheme } from "utils/index";
import useTheme from "hooks/useTheme";

type ThemeProviderProps = {
  children: React.ReactNode;
};

const theme = extendTheme({
  colorSchemes,
  typography,
  breakpoints,
});

const THEME_KEY = "app_mode";

const ThemeProvider = (props: ThemeProviderProps) => {
  const { children } = props;

  getInitColorSchemeScript({
    defaultMode: getTheme(THEME_KEY, ThemeMode.LIGHT),
    modeStorageKey: THEME_KEY,
  });

  return (
    <CssVarsProvider theme={theme} defaultMode={DEFAULT_MODE}>
      <CssBaseline />
      {/* <ListenerThemeSystem /> */}
      {children}
    </CssVarsProvider>
  );
};

export default ThemeProvider;

const ListenerThemeSystem = () => {
  const { setMode } = useTheme();

  const onChangeThemeStorage = useCallback(
    (newMode: ThemeMode) => {
      // clientStorage.set(THEME_KEY, newMode);
      setMode(newMode);
    },
    [setMode],
  );

  const onMediaQuery = useCallback(
    (event?) => {
      const systemTheme = getThemeSystem(event);
      onChangeThemeStorage(systemTheme);
    },
    [onChangeThemeStorage],
  );

  const mediaListener = useRef(onMediaQuery);
  mediaListener.current = onMediaQuery;

  useEffect(() => {
    const defaultMode = getTheme(THEME_KEY, ThemeMode.LIGHT);
    onChangeThemeStorage(defaultMode);

    const handlerMediaListener = (...args) => mediaListener.current(...args);

    // Always listen to System preference
    const media = window.matchMedia(DARK_THEME_MEDIA_SYSTEM);
    if (!media) return;

    if (media?.addEventListener) {
      media?.addEventListener("change", handlerMediaListener);
      return () => media?.removeEventListener("change", handlerMediaListener);
    } else {
      media.addListener(handlerMediaListener);
      return () => media.removeListener(handlerMediaListener);
    }
  }, [onChangeThemeStorage]);

  return null;
};