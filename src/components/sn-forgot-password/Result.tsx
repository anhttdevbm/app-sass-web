"use client";

import { memo } from "react";
import { Stack } from "@mui/material";
import AppLogo from "components/AppLogo";
import { Button, Text } from "components/shared";
import ResultForgotImage from "public/images/img-result-forgot-password.webp";
import Image from "next/image";
import ArrowIcon from "icons/ArrowIcon";
import { SIGNIN_PATH } from "constant/paths";
import Link from "components/Link";
import { NS_AUTH } from "constant/index";
import { useTranslations } from "next-intl";
import SwitchLanguage from "components/SwitchLanguage";
import SwitchTheme from "components/SwitchTheme";

const Result = () => {
  const authT = useTranslations(NS_AUTH);
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

        <AppLogo width={188} />
        <Text variant="h3" textAlign="center" mt={3}>
          {authT("forgot.title")}
        </Text>
        <Text variant="body2" textAlign="center" mt={1} mb={2}>
          {authT.rich("forgot.messageSuccess", {
            br: (chunks) => (
              <>
                <br />
                {chunks}
              </>
            ),
          })}
        </Text>

        <Image src={ResultForgotImage} alt="Result forgot" width={230} />

        <Link href={SIGNIN_PATH} underline="none">
          <Button
            variant="secondary"
            sx={{
              mt: 2,
            }}
            startIcon={<ArrowIcon color="primary" sx={{ fontSize: 24 }} />}
          >
            {authT("forgot.backSignin")}
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default memo(Result);
