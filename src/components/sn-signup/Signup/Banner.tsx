"use client";

import { memo } from "react";
import { Stack } from "@mui/material";
import { Text } from "components/shared";
import { NS_AUTH } from "constant/index";
import { useTranslations } from "next-intl";

const Banner = () => {
  const t = useTranslations(NS_AUTH);

  return (
    <Stack
      flex={1}
      sx={{
        background:
          "url('/images/img-auth-banner.webp') no-repeat center center",
        backgroundSize: "cover",
      }}
      display={{ xs: "none", sm: "flex" }}
      alignItems="center"
    >
      <Text
        mt={6}
        textAlign="center"
        fontWeight={600}
        variant={{ sm: "subtitle1", lg: "h3" }}
        color="common.white"
      >
        {t.rich("common.slogan", {
          br: (chunks) => (
            <>
              <br />
              {chunks}
            </>
          ),
        })}
      </Text>
    </Stack>
  );
};

export default memo(Banner);
