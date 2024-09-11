"use client";

import { memo, useCallback, useEffect, useState } from "react";
import { Box, Paper, IconButton, TextField } from "@mui/material";
import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ButtonCustom from "../components/Button";
import ListItem from "../components/ListItem";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { Select, Text } from "components/shared";
import { useDispatch } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { getPriceUpgradePackage } from "store/payment/actions";
import { DataPrice, DataStepOne } from ".";
import { AppDispatch } from "store/configureStore";

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  dataStepOne: DataStepOne;
  setDataPrice: React.Dispatch<React.SetStateAction<DataPrice>>;
  dataPrice: DataPrice;
  setDataStepOne: React.Dispatch<React.SetStateAction<DataStepOne>>;
};

type FormValues = {
  newPackage: string;
  billingPlan: string;
  numberOfUser: number;
};

const StepTwo = (props: Props) => {
  const { setStep, dataStepOne, dataPrice, setDataPrice, setDataStepOne } =
    props;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();

  const [newPackage, setNewPackage] = useState("");
  const [billingPlan, setBillingPlan] = useState("");
  const [numberOfUser, setNumberOfUser] = useState(4);

  useEffect(() => {
    if (dataStepOne) {
      setNewPackage(dataStepOne.newPackage);
      setBillingPlan(dataStepOne.billingPlan);
    }
  }, [dataStepOne]);
  const fetchPrice = useCallback(async () => {
    try {
      const formValues = {
        newPackage,
        billingPlan,
        numberOfUser,
      };

      const resultAction = await dispatch(getPriceUpgradePackage(formValues));

      if (getPriceUpgradePackage.fulfilled.match(resultAction)) {
        setDataPrice(resultAction.payload?.data);
        setDataStepOne({
          ...dataStepOne,
          newPackage: newPackage,
          billingPlan: billingPlan,
        });
      } else {
        console.error("Error");
      }
    } catch (error) {
      console.error("Error", error);
    }
  }, [newPackage, billingPlan, numberOfUser, dispatch]);

  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleClose = () => {
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

      <Box width="100%">
        <Text
          sx={{
            fontSize: "13px",
            fontWeight: 700,
          }}
          mb={1}
        >
          {packageT("form.package")}
        </Text>
        <Select
          options={[
            { label: "Standard", value: "Standard" },
            { label: "Business", value: "Business" },
            { label: "Enterprise", value: "Enterprise" },
          ]}
          value={newPackage}
          onChange={(e) => setNewPackage(e.target.value)}
          fullWidth
          rootSx={{
            borderRadius: 100,
            height: 40,
            background:
              "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
          }}
        />
        <Box>
          <Text
            sx={{
              fontSize: "13px",
              fontWeight: 700,
            }}
            mb={1}
          >
            {packageT("form.billingPlan")}
          </Text>
          <Select
            options={[{ label: "Monthly", value: "monthly" }]}
            value={billingPlan}
            onChange={(e) => setBillingPlan(e.target.value)}
            fullWidth
            rootSx={{
              borderRadius: 100,
              height: 40,
              background:
                "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
            }}
          />
          <Box>
            <Text
              sx={{
                fontSize: "13px",
                fontWeight: 700,
              }}
              mb={1}
            >
              {packageT("form.account")}
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
                padding: "4px 20px",
              }}
              value={numberOfUser + "  accounts"}
            />
          </Box>
        </Box>

        <Box
          sx={{
            padding: "30px",
            background: "#F9F8F8",
            borderRadius: "12px",
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text> {packageT("form.pricePerMonth")}</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>
              ${Number(dataPrice?.priceOfMonth ?? 0).toFixed(2)}
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}> {packageT("form.subTotal")}</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>
              ${Number(dataPrice?.subTotal ?? 0).toFixed(2)}
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}> {packageT("form.vat")}</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>
              ${Number(dataPrice?.vat ?? 0).toFixed(2)}
            </Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}> {packageT("form.total")}</Text>
            <Text sx={{ fontSize: "20px", fontWeight: "600" }}>
              $ {Number(dataPrice?.total ?? 0).toFixed(2)}
            </Text>
          </Box>
        </Box>
      </Box>

      <ListItem />

      <Box mt={5}>
        <ButtonCustom
          onClick={handleClose}
          text={packageT("button.cancel")}
          buttonDefault
          width={"100%"}
          height={44}
          sx={{
            marginBottom: "16px",
          }}
        />
        <ButtonCustom
          onClick={() => setStep((prevStep) => prevStep + 1)}
          text={packageT("button.confirm")}
          height={44}
          width={"100%"}
        />
      </Box>
    </>
  );
};

export default memo(StepTwo);
