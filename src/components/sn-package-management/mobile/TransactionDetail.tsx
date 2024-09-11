"use client";

import { memo, useEffect } from "react";
import { Box, TextField, Stack, useMediaQuery } from "@mui/material";
import { IconButton, Text } from "components/shared";

import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ListItem from "../components/ListItem";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

type Props = {};

const TransactionDetailMobile = (props: Props) => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const isMobile = useMediaQuery("(max-width:600px)");
  const router = useRouter();

  useEffect(() => {
    if (!isMobile) {
      router.push("/package-management");
    }
  }, [isMobile, router]);

  const handleBack = () => {
    router.push("/package-management");
  };

  return (
    <Stack padding="16px">
      <Box mb={2} display="flex" alignItems="center">
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Text
          id="modal-title"
          variant="h6"
          sx={{
            fontSize: "16px",
            fontWeight: 600,
          }}
        >
          {packageT("head.transactionDetail")}
        </Text>
      </Box>

      <Box>
        <Box>
          <Box>
            <Text
              sx={{
                fontSize: "13px",
                fontWeight: 700,
              }}
              mb={1}
            >
              {packageT("transactionDetail.transactionId")}
            </Text>
            <TextField
              variant="standard"
              disabled
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                height: 40,
                width: "100%",
                backgroundColor: "#EAEAEA",
                borderRadius: "100px ",
              }}
            />
          </Box>
          <Box>
            <Text
              sx={{
                fontSize: "13px",
                fontWeight: 700,
              }}
              mt={2}
              mb={1}
            >
              {packageT("transactionDetail.package")}{" "}
            </Text>
            <TextField
              variant="standard"
              disabled
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                width: "100%",
                height: 40,
                backgroundColor: "#EAEAEA",
                borderRadius: "100px ",
              }}
            />
          </Box>

          <Box>
            <Text
              sx={{
                fontSize: "13px",
                fontWeight: 700,
              }}
              mb={1}
              mt={2}
            >
              {packageT("transactionDetail.billingPlan")}
            </Text>
            <TextField
              variant="standard"
              disabled
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                width: "100%",
                height: 40,
                backgroundColor: "#EAEAEA",
                borderRadius: "100px ",
              }}
            />
          </Box>
          <Box>
            <Text
              sx={{
                fontSize: "13px",
                fontWeight: 700,
              }}
              mb={1}
              mt={2}
            >
              {packageT("transactionDetail.account")}
            </Text>
            <TextField
              variant="standard"
              disabled
              InputProps={{
                disableUnderline: true,
              }}
              sx={{
                width: "100%",
                height: 40,
                backgroundColor: "#EAEAEA",
                borderRadius: "100px ",
              }}
            />
          </Box>
        </Box>

        <Box padding={"30px"}>
          {["Price per month", "Subtotal", "VAT"].map((label) => (
            <Box
              key={label}
              display="flex"
              justifyContent="space-between"
              mb={1}
            >
              <Text sx={{ fontSize: "14px" }}>{label}</Text>
              <Text sx={{ fontSize: "14px", fontWeight: "600" }}>$23.00</Text>
            </Box>
          ))}
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}>Total</Text>
            <Text sx={{ fontSize: "20px", fontWeight: "600" }}>$23.00</Text>
          </Box>
        </Box>
      </Box>
      <ListItem />
    </Stack>
  );
};

export default memo(TransactionDetailMobile);
