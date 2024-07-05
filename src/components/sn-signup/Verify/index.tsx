"use client";

import { memo, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import AppLogo from "components/AppLogo";
import { Button, Input, Text } from "components/shared";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { formErrorCode } from "api/formErrorCode";
import { ErrorResponse, Locale } from "constant/types";
import { AN_ERROR_TRY_AGAIN, NS_AUTH, NS_COMMON } from "constant/index";
import { useRouter } from "next-intl/client";
import { SIGNIN_PATH } from "constant/paths";
import { useLocale, useTranslations } from "next-intl";
import SwitchLanguage from "components/SwitchLanguage";
import SwitchTheme from "components/SwitchTheme";

const Verify = () => {
  const { onVerify } = useAuth();
  const { onAddSnackbar } = useSnackbar();
  const { push } = useRouter();
  const locale = useLocale() as Locale;

  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);

  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isVNLang = useMemo(() => locale === "vi", [locale]);

  const onChange = (newValue?: string | number) => {
    setCode(`${newValue ?? ""}`);
    setError(undefined);
  };

  const onSubmit = async () => {
    if (!code) return;
    setIsSubmitting(true);
    try {
      const newData = await onVerify(code);
      if (newData) {
        onAddSnackbar(authT("signup.notification.signupSuccess"), "success");
        push(SIGNIN_PATH);
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      if ((error as ErrorResponse)["code"] === formErrorCode.INVALID_CODE) {
        setError(
          commonT("form.error.incorrect", {
            name: authT("verify.form.title.code"),
          }),
        );
      } else {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Stack
      flex={1}
      height="calc(var(--vh, 1vh) * 100)"
      width="100vw"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        m={{ xs: 2, sm: 8 }}
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
          sm: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(8 * 2)})`,
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
          left={16}
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
          <Text variant="h3" textAlign="center" mt={3}>
            {authT("verify.title")}
          </Text>
          <Text
            variant="body2"
            display={{ xs: "none", sm: "initial" }}
            textAlign="center"
            mt={1}
            mb={2}
          >
            {authT.rich("verify.description", {
              br: (chunks) => (
                <>
                  {chunks}
                  <br />
                </>
              ),
            })}
          </Text>
          <Text
            variant="body2"
            display={{ sm: "none" }}
            textAlign="center"
            mt={1}
            mb={2}
          >
            {authT.rich("verify.description", {
              br: (chunks) => <>{chunks}.</>,
            })}
          </Text>
          <Input
            titleSx={{ left: isVNLang ? "39%" : "42%" }}
            rootSx={{
              backgroundColor: "grey.50",
              height: 58,
              "& input": { textAlign: "center" },
            }}
            title={authT("verify.form.title.code")}
            value={code}
            onChangeValue={onChange}
            error={error}
            fullWidth
          />
          <Button
            onClick={onSubmit}
            disabled={!code || isSubmitting}
            variant="primary"
            sx={{ mt: 3, minHeight: 48 }}
            fullWidth
            pending={isSubmitting}
          >
            {authT("verify.key")}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(Verify);
