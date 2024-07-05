"use client";

import { memo, useState } from "react";
import { Stack } from "@mui/material";
import AppLogo from "components/AppLogo";
import { Button, Input, Text } from "components/shared";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { NS_AUTH, NS_COMMON } from "constant/index";
import { EMAIL_REGEX } from "constant/regex";
import Result from "./Result";
import { formErrorCode } from "api/formErrorCode";
import { ErrorResponse } from "constant/types";
import { useTranslations } from "next-intl";
import SwitchLanguage from "components/SwitchLanguage";
import SwitchTheme from "components/SwitchTheme";

const Forgot = () => {
  const { onForgot } = useAuth();
  const { onAddSnackbar } = useSnackbar();
  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const onChange = (newValue?: string | number) => {
    const newText = `${newValue ?? ""}`;
    setEmail(newText);
    setError(
      EMAIL_REGEX.test(newText)
        ? undefined
        : commonT("form.error.invalid", { name: "Email" }),
    );
  };

  const onSubmit = async () => {
    if (!email) return;
    setIsSubmitting(true);
    try {
      await onForgot(email);
      setIsSuccess(true);
    } catch (error) {
      if ((error as ErrorResponse)["code"] === formErrorCode.INVALID_DATA) {
        setError(commonT("form.error.notExist", { name: "Email" }));
      } else {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return <Result />;
  }

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
          minWidth={{ sm: 380 }}
          maxWidth={380}
          justifyContent="center"
          alignItems="center"
        >
          <AppLogo width={188} />
          <Text variant="h3" textAlign="center" mt={3}>
            {authT("forgot.title")}
          </Text>
          <Text variant="body2" textAlign="center" mt={1} mb={2}>
            {authT.rich("forgot.description", {
              br: (chunks) => (
                <>
                  <br />
                  {chunks}
                </>
              ),
            })}
          </Text>

          <Input
            rootSx={{
              backgroundColor: "grey.50",
              height: 58,
            }}
            title="Email"
            value={email}
            onChangeValue={onChange}
            error={error}
            fullWidth
          />
          <Button
            onClick={onSubmit}
            disabled={!email || isSubmitting}
            variant="primary"
            sx={{ mt: 3, minHeight: 48 }}
            fullWidth
            pending={isSubmitting}
          >
            {commonT("form.confirm")}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(Forgot);
