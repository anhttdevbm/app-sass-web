"use client";

import { memo, useEffect, useMemo } from "react";
import { Stack } from "@mui/material";
import { useRouter } from "next-intl/client";
import { HOME_PATH, JOIN_WORKSPACE_PATH } from "constant/paths";
import { useAppReady, useAuth } from "store/app/selectors";
import AppLoading from "components/AppLoading";
import { Permission } from "constant/enums";

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = (props: WrapperProps) => {
  const { isLoggedIn, user } = useAuth();
  const { appReady } = useAppReady();
  const { replace } = useRouter();

  const isNotJoin = useMemo(
    () =>
      isLoggedIn &&
      user?.roles?.includes(Permission.EU) &&
      !user.is_pay_user &&
      !user.approve,
    [isLoggedIn, user?.approve, user?.is_pay_user, user?.roles],
  );

  useEffect(() => {
    if (!isLoggedIn) return;
    replace(isNotJoin ? JOIN_WORKSPACE_PATH : HOME_PATH);
  }, [isLoggedIn, isNotJoin, replace]);

  if (!appReady || isLoggedIn) return <AppLoading />;

  return (
    <Stack
      flex={1}
      m={{ sm: 3, lg: 4 }}
      direction="row"
      sx={{
        background: {
          xs: "url('/images/img-auth-banner.webp') no-repeat center center",
          sm: "none",
        },

        backgroundSize: { xs: "cover", sm: undefined },
      }}
      height={({ spacing }) => ({
        xs: "calc(var(--vh, 1vh) * 100)",
        sm: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(3 * 2)})`,
        lg: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(4 * 2)})`,
      })}
      bgcolor={{ sm: "common.white" }}
      justifyContent={{ xs: "center", sm: "initial" }}
      alignItems={{ xs: "center", sm: "initial" }}
    >
      {props.children}
    </Stack>
  );
};

export default memo(Wrapper);
