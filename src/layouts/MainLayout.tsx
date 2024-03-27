"use client";

import { Snackbar, Stack } from "@mui/material";
import AppLoading from "components/AppLoading";
import Header from "./Header";
import { memo, useEffect, useMemo } from "react";
import { Sidebar } from "./components";
import { useAppSelector } from "store/hooks";
import { shallowEqual } from "react-redux";
import { usePathname, useRouter } from "next-intl/client";
import {
  AUTHORIZED_PATHS,
  CHATTING_ROOM_PATH,
  FORGOT_PASSWORD_PATH,
  HOME_PATH,
  JOIN_WORKSPACE_PATH,
  SIGNIN_PATH,
  SIGNUP_PATH,
} from "constant/paths";
import { Text } from "components/shared";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { useAuth } from "store/app/selectors";
import { Permission } from "constant/enums";
import ChatListTemp from "components/sn-chat/ChatListTemp";

type MainLayoutProps = {
  children: React.ReactNode;
};

const AUTH_PATHS = [SIGNUP_PATH, FORGOT_PASSWORD_PATH, JOIN_WORKSPACE_PATH];

const IS_CHATTING_ROOM = [CHATTING_ROOM_PATH];

const MainLayout = (props: MainLayoutProps) => {
  const { children } = props;

  const { push } = useRouter();
  const pathname = usePathname();
  const { id } = useParams() as { id: string };
  const commonT = useTranslations(NS_COMMON);

  const pathNameWithoutId = id ? pathname.replace(`/${id}`, "") : pathname;

  const { appReady, token, user } = useAppSelector(
    (state) => state.app,
    shallowEqual,
  );

  const { onGetProfile } = useAuth();

  const isLoggedIn = useMemo(() => !!token, [token]);
  const isChatting = useMemo(
    () => !!IS_CHATTING_ROOM.includes(pathNameWithoutId),
    [pathNameWithoutId],
  );

  // const isAuthorized = useMemo(() => {
  //   if (!user?.roles?.length) return false;
  //   return user?.roles?.some((role) => {
  //     const basePath = id ? pathname.replace(id, "{id}") : pathname;
  //     return AUTHORIZED_PATHS[role].includes(basePath);
  //   });
  // }, [user?.roles, pathname, id]);

  useEffect(() => {
    if (isLoggedIn) {
    } else if (!AUTH_PATHS.includes(pathname)) {
      push(SIGNIN_PATH);
    }
  }, [isLoggedIn, push, pathname]);

  useEffect(() => {
    if (user?.id) return;
    onGetProfile();
  }, [user?.id, onGetProfile]);

  if (!appReady || !token || !user) return <AppLoading />;

  return (
    <>
      <Stack
        direction="row"
        width="100vw"
        height="calc(var(--vh, 1vh) * 100)"
        flex={1}
        overflow="hidden"
      >
        <Sidebar />
        <Stack flex={1} width="100%" height="100%" overflow="hidden">
          <Header />
          <Stack
            flex={1}
            // height="fit-content"
            spacing={{ xs: 1.5, sm: 3 }}
            sx={{ overflow: 'auto' }}
            // justifyContent={isAuthorized ? undefined : "center"}
            // alignItems={isAuthorized ? undefined : "center"}
            // overflow="hidden"
          >
            {
              // isAuthorized ? (
              children
              // ) : (
              //   <Text variant="body2" fontWeight={600}>
              //     {commonT("unauthorized")}
              //   </Text>
              // )
            }
          </Stack>
        </Stack>
      </Stack>
      <Snackbar />
      {!isChatting ? <ChatListTemp /> : null}
    </>
  );
};

export default memo(MainLayout);
