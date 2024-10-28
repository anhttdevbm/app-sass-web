"use client";

import { Box, Snackbar, Stack } from "@mui/material";
import AppLoading from "components/AppLoading";
import Header, { HEADER_HEIGHT } from "./Header";
import { memo, useEffect, useMemo, useState } from "react";
import { Sidebar } from "./components";
import { useAppSelector } from "store/hooks";
import { shallowEqual } from "react-redux";
import { usePathname, useRouter } from "next-intl/client";
import {
  AI_AGENT_CHAT,
  AI_CHAT_PATH,
  CHATTING_ROOM_PATH,
  FORGOT_PASSWORD_PATH,
  JOIN_WORKSPACE_PATH,
  SIGNIN_PATH,
  SIGNUP_PATH,
} from "constant/paths";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { useAuth } from "store/app/selectors";
import ChatListTemp from "components/sn-chat/ChatListTemp";
import { useMeeting } from "store/meeting/selectors";
import { CallStatus } from "store/meeting/types";
import { Button } from "components/shared";
import NotSupportBrowser from "components/sn-meeting/components/NotSupportBrowser";
import { store } from "store/configureStore";
import { setIsBrowserSupported } from "store/meeting/reducer";

type MainLayoutProps = {
  children: React.ReactNode;
};

const AUTH_PATHS = [SIGNUP_PATH, FORGOT_PASSWORD_PATH, JOIN_WORKSPACE_PATH];

const IS_CHATTING_ROOM = [
  CHATTING_ROOM_PATH,
  AI_CHAT_PATH,
  AI_AGENT_CHAT.replace("/{id}", ""),
];

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
  const { callStatus, isBrowserSupported } = useAppSelector(
    (state) => state.meeting,
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
        <Stack flex={1} width="100%" height="100vh" overflow="hidden">
          <Header />
          <Stack
            flex={1}
            height={`calc(100% - ${HEADER_HEIGHT}px)`}
            spacing={{ xs: 1.5, sm: 3 }}
            // sx={{ overflow: 'auto' }}
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
      <IncomingCall callStatus={callStatus} />
      <NotSupportBrowser
        open={!isBrowserSupported}
        onClose={() => store.dispatch(setIsBrowserSupported(true))}
      />
    </>
  );
};

export default memo(MainLayout);

interface IncomingCallProps {
  callStatus: "left" | "ringing" | "accepted" | "rejected" | null;
}

const IncomingCall = ({ callStatus }: IncomingCallProps) => {
  const { meetInfo } = useAppSelector((state) => state.meeting);
  const { onAcceptCall, onRejectCall } = useMeeting();

  const handleCall = (accepted) => {
    if (!accepted) {
      onRejectCall(meetInfo.id);
      return;
    }
    onAcceptCall(meetInfo.id);
    window.open(
      `/meeting/${meetInfo.room.id}?meetInfo=${encodeURIComponent(
        JSON.stringify(meetInfo),
      )}&isJoining=true`,
      "_blank",
    );
  };

  return (
    callStatus == CallStatus.ringing && (
      <Box
        sx={{
          position: "fixed",
          top: "10rem",
          right: "2rem",
          background: "var(--mui-palette-info-light)",
          borderRadius: 2,
          padding: 2,
        }}
      >
        <p style={{ textAlign: "center" }}>Incoming Call</p>
        {/* {!callRequest?.audioOnly && (
        <button onClick={() => handleCall(true, false)}>Accept</button>
      )} */}
        <Button
          onClick={() => handleCall(true)}
          variant="outlined"
          sx={{ bgcolor: "var(--mui-palette-primary-main)", margin: "0 4px" }}
        >
          Accept
        </Button>
        <Button
          onClick={() => handleCall(false)}
          variant="outlined"
          sx={{ bgcolor: "var(--mui-palette-error-dark)" }}
        >
          Cancel
        </Button>
      </Box>
    )
  );
};
