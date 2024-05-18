"use client";

import { memo } from "react";
import { Stack } from "@mui/material";
import Image from "next/image";
import AppLogo from "public/images/img-app-logo.webp";
import { Text } from "components/shared";
import Link from "components/Link";
import { SIGNUP_PATH } from "constant/paths";
import Form from "./Form";
import { NS_AUTH } from "constant/index";
import { useTranslations } from "next-intl";
import SwitchLanguage from "components/SwitchLanguage";
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
      alignItems="center"
      m={{ xs: 2, sm: 0 }}
      justifyContent="center"
      bgcolor={{
        xs: isDarkMode ? "background.paper" : "rgba(255, 255, 255, 0.9)",
        sm: "transparent",
      }}
      boxShadow={{ xs: "0px 4px 12px rgba(0, 0, 0, 0.15)", sm: undefined }}
      borderRadius={{ xs: 2, sm: 0 }}
      py={{ xs: 2, sm: undefined }}
      px={2}
      position="relative"
    >
      {/* <Stack
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
      </Stack> */}

      <Image src={AppLogo} alt="App logo" width={440} />

      <Stack
        flex={1}
        p={{lg:"52px 122px 76px 122px"}}
        mt={{ xs: 3, sm: 6, lg:"39px" }}
        alignItems="center"
        maxWidth={744}
        maxHeight={500}
        width="100%"
        overflow="hidden"
        bgcolor={{
          sm: "common.white",
        }}
      >
        <Text variant="h3">{t("signin.title")}</Text>
        <Stack mt={1} direction="row" alignItems="center" spacing={0.5}>
          <Text variant="body2">{t("signin.notSignup")}</Text>
          <Link
            href={SIGNUP_PATH}
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
            {t("signin.signupNow")}
          </Link>
        </Stack>

        <Form />
      </Stack>
    </Stack>
  );
};

export default memo(MainSection);
