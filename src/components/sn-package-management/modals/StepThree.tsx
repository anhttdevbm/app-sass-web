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
import { DataPrice, DataStepOne } from ".";
import { pay } from "store/payment/actions";
import { useDispatch } from "react-redux";
import { AppDispatch } from "store/configureStore";
type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  dataPrice: DataPrice;
  dataStepOne: DataStepOne;
};
const StepThree = (props: Props) => {
  const { setStep, onClose, dataPrice, dataStepOne } = props;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const handleClose = () => {
    onClose();
    setStep(0);
  };

  const handleSubmit = async () => {
    const payload = {
      billing_plan:
        dataStepOne.billingPlan === "monthly"
          ? "Monthly"
          : dataStepOne.billingPlan === "yearly"
          ? "Yearly"
          : "",
      packageName:
        dataStepOne.newPackage === "Standard"
          ? "1"
          : dataStepOne.newPackage === "Business"
          ? "2"
          : dataStepOne.newPackage === "Enterprise"
          ? "3"
          : "0",
      currency_code: "USD",
      sub_total: dataPrice.subTotal,
      vat: dataPrice.vat,
    };
    const resultAction = await dispatch(pay(payload));

    if (pay.fulfilled.match(resultAction)) {
      window.open(resultAction?.payload?.return_url, "_blank");
    } else {
      console.error("Error");
    }
    // onClose();
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "1278px",
        bgcolor: "background.paper",
        borderRadius: 3,
        padding: "74px 63px",
      }}
    >
      <IconButton
        onClick={handleClose}
        sx={{ position: "absolute", top: 50, right: 74 }}
      >
        <CloseIcon sx={{ fontSize: "24px" }} />
      </IconButton>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={10}
      >
        <IconButton onClick={handleBack}>
          <ArrowBackIcon />
        </IconButton>
        <Text
          id="modal-title"
          variant="h6"
          sx={{
            fontSize: "39px",
            fontWeight: 600,
            textAlign: "center",
            flexGrow: 1,
          }}
        >
          {packageT("head.upgradePackage")}
        </Text>
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        gap="68px"
        padding="0 144px"
      >
        <Box width="527px">
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

        <Box width="425px">
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
              width={365}
              height={40}
            />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default memo(StepThree);
