"use client";

import { memo } from "react";
import { Stack } from "@mui/material";
import Image from "next/image";
import AppLogo from "public/images/img-app-logo.webp";
import { Text } from "components/shared";
import Link from "components/Link";
import { SIGNIN_PATH } from "constant/paths";
import Form from "./Form";
import SwitchLanguage from "components/SwitchLanguage";
import { NS_AUTH } from "constant/index";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";
import SwitchTheme from "components/SwitchTheme";

const MainSection = () => {
  const t = useTranslations(NS_AUTH);
  const { isDarkMode } = useTheme();

  return (
    <Stack
      overflow="hidden"
      flex={{ sm: 1 }}
      width="100%"
      maxHeight={({ spacing }) => ({
        xs: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(2 * 2)})`,
        sm: "100%",
      })}
      alignItems="center"
      m={{ xs: 2, sm: 0 }}
      justifyContent="center"
      bgcolor={{
        xs: isDarkMode ? "background.paper" : "rgba(255, 255, 255, 0.9)",
        sm: undefined,
      }}
      boxShadow={{ xs: "0px 4px 12px rgba(0, 0, 0, 0.15)", sm: undefined }}
      borderRadius={{ xs: 2, sm: 0 }}
      py={{ xs: 2, sm: undefined }}
      px={2}
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
      <Image src={AppLogo} alt="App logo" width={152} />

      <Stack
        flex={1}
        mt={{ xs: 3, sm: 4 }}
        alignItems="center"
        maxWidth={340}
        width="100%"
        overflow="hidden"
      >
        <Text variant="h3">{t("signup.title")}</Text>
        <Stack mt={1} direction="row" alignItems="center" spacing={0.5}>
          <Text variant="body2">{t("signup.haveAccount")}</Text>
          <Link
            href={SIGNIN_PATH}
            fontWeight={600}
            sx={{
              fontSize: 14,
              "&:hover": {
                color: "primary.dark",
              },
            }}
            color="primary.main"
            underline="none"
          >
            {t("signup.signinNow")}
          </Link>
        </Stack>

        <Form />
      </Stack>
    </Stack>
  );
};

export default memo(MainSection);
