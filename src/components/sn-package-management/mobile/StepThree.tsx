"use client";

import { memo } from "react";
import { Box, Paper, IconButton, Radio } from "@mui/material";
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ButtonCustom from "../components/Button";
import { useTranslations } from "next-intl";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { Text } from "components/shared";
import { DataPrice } from ".";
type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  dataPrice: DataPrice;
};
const StepThree = (props: Props) => {
  const { setStep, dataPrice } = props;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const handleClose = () => {
    setStep(0);
  };

  const handleSubmit = () => {
    setStep(0);
  };

  return (
    <>
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
          {packageT("head.upgradePackage")}
        </Text>
      </Box>

      <Box>
        <Box>
          <Text
            sx={{
              fontSize: "16px",
              fontWeight: 600,
            }}
            mb={1}
          >
            {packageT("title.paymentDetails")}
          </Text>
          <Box>
            <Radio checked={true} /> {packageT("description.paypal")}
          </Box>
          <Box mb={3}>
            <Text>{packageT("description.pay")}</Text>
          </Box>
        </Box>

        <Box>
          <Text
            sx={{
              fontSize: "16px",
              fontWeight: 600,
            }}
            mb={1}
          >
            {packageT("title.orderSummary")}{" "}
          </Text>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text>{packageT("form.pricePerMonth")}</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>
              {" "}
              ${Number(dataPrice?.priceOfMonth ?? 0).toFixed(2)}
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}>{packageT("form.subTotal")}</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>
              {" "}
              ${Number(dataPrice?.subTotal ?? 0).toFixed(2)}
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}>{packageT("form.vat")}</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>
              {" "}
              ${Number(dataPrice?.vat ?? 0).toFixed(2)}
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}>{packageT("form.total")}</Text>
            <Text sx={{ fontSize: "20px", fontWeight: "600" }}>
              {" "}
              ${Number(dataPrice?.total ?? 0).toFixed(2)}
            </Text>
          </Box>

          <Box mb={3}>
            <Text sx={{ fontSize: "13px" }}>
              {packageT("description.yourSubscription")}{" "}
              <span style={{ fontWeight: "700" }}>
                {" "}
                {packageT("description.renewAutomatically")}{" "}
              </span>{" "}
              {packageT("description.byCharging")}{" "}
            </Text>
          </Box>
          <Box>
            <ButtonCustom
              onClick={handleSubmit}
              text={packageT("button.payNow")}
              width="100%"
              height={44}
            />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default memo(StepThree);
