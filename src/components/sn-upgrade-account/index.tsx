"use client";

import { memo, useMemo } from "react";
import { Box, Stack, useTheme } from "@mui/material";
import { Text } from "components/shared";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import PackageItem from "./PackageItem";
import FixedLayout from "components/FixedLayout";

const Page = () => {
  return (
    <FixedLayout>
      <Stack flex={1} p={3}>
        <Text textAlign="center" variant="h4">
          Choose a plan that’s right for you
        </Text>
        <Box
          component={Swiper}
          spaceBetween={120}
          className="mySwiper"
          breakpoints={{
            0: {
              slidesPerView: 1,
            },
            780: {
              slidesPerView: 2,
            },
            1020: {
              slidesPerView: 3,
            },
            1260: {
              slidesPerView: 4,
            },
            1500: {
              slidesPerView: 5,
            },
            1740: {
              slidesPerView: 6,
            },
          }}
          sx={{
            width: "100%",
            height: "100%",
            mt: 8.5,
          }}
        >
          <SwiperSlide>
            <PackageItem />
          </SwiperSlide>
          <SwiperSlide>
            <PackageItem />
          </SwiperSlide>
          <SwiperSlide>
            <PackageItem />
          </SwiperSlide>
          <SwiperSlide>
            <PackageItem />
          </SwiperSlide>
          <SwiperSlide>
            <PackageItem />
          </SwiperSlide>
        </Box>
      </Stack>
    </FixedLayout>
  );
};

export default memo(Page);
