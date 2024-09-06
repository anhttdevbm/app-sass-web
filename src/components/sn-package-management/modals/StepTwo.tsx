"use client";

import { memo } from "react";
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

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
};

const StepTwo = (props: Props) => {
  const { setStep, onClose } = props;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };
  const handleClose = () => {
    onClose();
    setStep(0);
  };

  const handleSubmit = () => {
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        bgcolor: "background.paper",
        borderRadius: 3,
        padding: "74px 136px 45px 74px",
        width: 1278,
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
        mt={3}
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

      <Box display="flex" justifyContent="space-between" mb={5}>
        <Box width="40%">
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
            rootSx={{ borderRadius: 100, height: 40, width: 376 }}
          />
          <Box display="flex" gap="16px" mt={2}>
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
                options={[{ label: "Monthly", value: "Monthly" }]}
                rootSx={{ borderRadius: 100, height: 40, width: 180 }}
              />
            </Box>
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
                  width: 180,
                  height: 40,
                  backgroundColor: "#EAEAEA",
                  borderRadius: "100px ",
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box
          width="48%"
          sx={{
            padding: "30px",
            background: "#F9F8F8",
            borderRadius: "12px",
          }}
        >
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text>Price per month</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>$23.00</Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}>Subtotal</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>$23.00</Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}>VAT</Text>
            <Text sx={{ fontSize: "14px", fontWeight: "600" }}>$23.00</Text>
          </Box>

          <Box display="flex" justifyContent="space-between" mb={1}>
            <Text sx={{ fontSize: "14px" }}>Total</Text>
            <Text sx={{ fontSize: "20px", fontWeight: "600" }}>$23.00</Text>
          </Box>
        </Box>
      </Box>

      <ListItem />

      <Box display="flex" justifyContent="flex-end" mt={5} gap={"10px"}>
        <ButtonCustom
          onClick={handleClose}
          text={packageT("button.cancel")}
          buttonDefault
          width={168}
          height={40}
        />
        <ButtonCustom
          onClick={handleSubmit}
          text={packageT("button.confirm")}
          width={168}
          height={40}
        />
      </Box>
    </Paper>
  );
};

export default memo(StepTwo);
