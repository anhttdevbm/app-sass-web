"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import AppLogo from "components/AppLogo";
import { Button, Input, Text } from "components/shared";
import { useAppReady, useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import CrownIcon from "icons/CrownIcon";
import { SUFFIX_EMAIL_REGEX } from "constant/regex";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import SwitchLanguage from "components/SwitchLanguage";
import AppLoading from "components/AppLoading";
import { HttpStatusCode, Permission } from "constant/enums";
import {
  JOIN_WORKSPACE_PATH,
  HOME_PATH,
  UPGRADE_ACCOUNT_PATH,
  SIGNIN_PATH,
} from "constant/paths";
import useWindowSize from "hooks/useWindowSize";
import { useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";
import {
  AN_ERROR_TRY_AGAIN,
  AUTH_API_URL,
  NS_AUTH,
  NS_COMMON,
} from "constant/index";
import Link from "components/Link";
import { Endpoint, client } from "api";
import SwitchTheme from "components/SwitchTheme";
import { formErrorCode } from "api/formErrorCode";
import { ErrorResponse } from "constant/types";

const JoinWorkspace = () => {
  const { onAddSnackbar } = useSnackbar();
  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);
  const { isLoggedIn, user, onGetProfile } = useAuth();
  const { appReady } = useAppReady();
  const { replace, push } = useRouter();

  const { height } = useWindowSize();

  const isJoined = useMemo(
    () => Boolean(isLoggedIn && user?.company),
    [isLoggedIn, user?.company],
  );

  const isSmallHeight = useMemo(() => height && height < 768, [height]);

  const [isShow, onShow, onHide] = useToggle();

  const [suffixEmail, setSuffixEmail] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onChange = (newValue?: string | number) => {
    const newText = `${newValue ?? ""}`;
    setSuffixEmail(newText);

    setError(
      SUFFIX_EMAIL_REGEX.test(newText)
        ? undefined
        : authT("joinWorkspace.form.error.email"),
    );
  };

  const onSubmit = async () => {
    if (!suffixEmail) return;
    setIsSubmitting(true);
    try {
      const response = await client.post(
        Endpoint.JOIN_WORKSPACE,
        {
          email: suffixEmail,
        },
        { baseURL: AUTH_API_URL },
      );
      if (response?.status === HttpStatusCode.OK) {
        onAddSnackbar(authT("joinWorkspace.notification.success"), "success");
        onGetProfile();
        push(HOME_PATH);
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      if ((error as ErrorResponse)["code"] === formErrorCode.NOT_FOUND) {
        setError(authT("joinWorkspace.form.error.notFound"));
      } else {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    } finally {
      onHide();
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isJoined) return;
    replace(HOME_PATH);
  }, [isJoined, replace]);

  if (!appReady) return <AppLoading />;

  return (
    <>
      <Stack
        flex={1}
        height="calc(var(--vh, 1vh) * 100)"
        width="100vw"
        justifyContent="center"
        alignItems="center"
      >
        <Stack
          mx={{ xs: 2, sm: 8 }}
          my={{ sm: isSmallHeight ? 3 : 6, lg: isSmallHeight ? 3 : 8 }}
          justifyContent="center"
          alignItems="center"
          bgcolor="background.paper"
          p={3}
          flex={{ sm: 1 }}
          width={({ spacing }) => ({
            xs: `calc(100vw - ${spacing(2 * 2)})`,
            sm: `calc(100vw - ${spacing(8 * 2)})`,
          })}
          height={({ spacing }) => ({
            xs: "fit-content",
            sm: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(
              (isSmallHeight ? 3 : 6) * 2,
            )})`,
            lg: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(
              (isSmallHeight ? 3 : 8) * 2,
            )})`,
          })}
          sx={{
            overflowX: "hidden",
          }}
          maxHeight={{ xs: "fit-content", sm: "100%" }}
          borderRadius={2}
          overflow="auto"
          position="relative"
        >
          <Stack
            direction="row"
            alignItems="center"
            position="absolute"
            top={16}
            right={16}
            spacing={{ xs: 1, sm: 2 }}
            zIndex={10}
          >
            <SwitchLanguage />
            <SwitchTheme />
          </Stack>

          <Stack
            minWidth={340}
            maxWidth={340}
            justifyContent="center"
            alignItems="center"
          >
            <AppLogo width={188} />
            <Text variant="h3" textAlign="center" mt={3} mb={2}>
              {authT("joinWorkspace.title")}
            </Text>
            <Input
              rootSx={{
                backgroundColor: "grey.50",
                height: 58,
              }}
              title={authT("joinWorkspace.form.title.email")}
              placeholder="sssasas"
              value={suffixEmail}
              onChangeValue={onChange}
              error={error}
              fullWidth
            />
            <Button
              onClick={onShow}
              disabled={!suffixEmail || isSubmitting}
              variant="primary"
              sx={{ mt: 3 }}
              fullWidth
            >
              {authT("joinWorkspace.getStarted")}
            </Button>

            <Text
              variant="body2"
              textAlign="center"
              mt={{ xs: 3, sm: 10 }}
              mb={2}
              color="text.primary"
              maxWidth={280}
            >
              {authT("joinWorkspace.content")}
            </Text>

            <Link href={UPGRADE_ACCOUNT_PATH} underline="none">
              <Button
                variant="secondary"
                startIcon={<CrownIcon color="primary" sx={{ fontSize: 24 }} />}
                fullWidth
              >
                {commonT("upgradeAccount")}
              </Button>
            </Link>
          </Stack>
        </Stack>
      </Stack>

      <ConfirmDialog
        open={isShow}
        onClose={onHide}
        onSubmit={onSubmit}
        title={authT("joinWorkspace.confirmJoin.title")}
        content={authT("joinWorkspace.confirmJoin.content")}
        submitText={authT("joinWorkspace.confirmJoin.submit")}
      />
    </>
  );
};

export default memo(JoinWorkspace);
