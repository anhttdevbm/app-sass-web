"use client";

import { memo } from "react";
import { Stack, Box } from "@mui/material";
import Image from "next/image";
import AppLogo from "public/images/img-app-logo.webp";
import { Text } from "components/shared";
import Link from "components/Link";
import { SIGNUP_PATH } from "constant/paths";
import Form from "./Form";
import { NS_AUTH } from "constant/index";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";

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
 <Box   mt={{ xs: 0, sm:"-100px" }}>  <Image src={AppLogo} alt="App logo" width={440} /></Box>
    

      <Stack
        flex={1}
        p={{sm:"22px 92px 46px 92px",lg:"37px 88px"}}
        mt={{ xs: 3, sm:"-20px" }}
        alignItems="center"
        maxWidth={{ sm:"644px", lg:"744px" }}
        maxHeight={{ sm:"450px", lg:"500px" }}
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
