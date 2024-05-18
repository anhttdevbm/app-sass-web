"use client";

import { memo, useEffect, useMemo, useRef } from "react";
import { Stack } from "@mui/material";
import { useRouter } from "next-intl/client";
import { HOME_PATH, JOIN_WORKSPACE_PATH } from "constant/paths";
import { useAppReady, useAuth } from "store/app/selectors";
import AppLoading from "components/AppLoading";
import useWindowSize from "hooks/useWindowSize";
import { Permission } from "constant/enums";

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = (props: WrapperProps) => {
  const { isLoggedIn, user } = useAuth();
  const { appReady } = useAppReady();
  const { replace } = useRouter();

  const { height } = useWindowSize();

  const isNotJoin = useMemo(
    () => isLoggedIn && !user?.company && !user?.roles?.includes(Permission.SA),
    [isLoggedIn, user?.company, user?.roles],
  );

  const isSmallHeight = useMemo(() => height && height < 768, [height]);

  useEffect(() => {
    if (!isLoggedIn) return;
    replace(isNotJoin ? JOIN_WORKSPACE_PATH : HOME_PATH);
  }, [isLoggedIn, isNotJoin, replace]);

  if (!appReady || isLoggedIn) return <AppLoading />;

  return (
    <Stack
      flex={1}
      mx={{ sm: 0}}
      my={{ sm: 0}}
      direction="row"
      sx={{
        background:"url('/images/img-signin-background.svg') no-repeat center center #f7f7fd",
        backgroundSize: { xs: "cover", sm: undefined },
      }}
      height={({ spacing }) => ({
        xs: "calc(var(--vh, 1vh) * 100)",
        // sm: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(
        //   (isSmallHeight ? 3 : 6) * 2,
        // )})`,
        sm: `100vh`,
        // lg: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(
        //   (isSmallHeight ? 3 : 8) * 2,
        // )})`,
      })}
      // bgcolor={{ sm: "common.white" }}
      justifyContent={{ xs: "center", sm: "initial" }}
      alignItems={{ xs: "center", sm: "initial" }}
    >
      {props.children}
    </Stack>
  );
};

export default memo(Wrapper);
