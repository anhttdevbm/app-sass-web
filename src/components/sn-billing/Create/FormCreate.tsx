"use client";
import {
  Box,
  Button,
  DialogTitle,
  Grid,
  InputAdornment,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import React, { memo, useMemo } from "react";
import FormLayout from "components/FormLayout";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { NS_BILLING, NS_COMMON, NS_SALES, SALE_API_URL } from "constant/index";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Select, Text } from "components/shared";
import axios from "axios";
import { Endpoint, client } from "api";
import FileSaver from "file-saver";
import StepForm from "../components/StepForm";
import Avatar from "components/Avatar";
import PlusIcon from "icons/PlusIcon";
import { CellProps, TableLayout } from "components/Table";
import useBreakpoint from "hooks/useBreakpoint";
import FixedLayout from "components/FixedLayout";
import FormStepOne from "./StepOne/FormStepOne";
import FormStepTwo from "./StepTwo/FormStepTwo";
import { Budgets } from "store/billing/reducer";
import { useSearchParams } from "next/navigation";
// import useExportDeal from "../hooks/useExportDeal";

const billingFormTranslatePrefix = "list.form";

const FormCreate = () => {
  //create form
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const { isMdSmaller } = useBreakpoint();
  //   const { exportDeal, isFetching } = useExportDeal();

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const [selectedBudget, setSelectedBudget] = React.useState<Budgets[]>([]);

  const steps = [
    billingT(`${billingFormTranslatePrefix}.step.title.budgets`),
    billingT(`${billingFormTranslatePrefix}.step.title.preview`),
  ];

  const schema = yup.object().shape({
    type: yup.string(),
  });

  const { handleSubmit, control, reset, getValues } = useForm({
    defaultValues: {
      type: "xlsx",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    // return await exportDeal().then(() => {
    //   onClose();
    // });
  };

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = (item) => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
    setSelectedBudget(item);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <>
      {/* <FixedLayout
        // maxHeight={920}
        // maxWidth={{
        //   xs: 1120,
        //   xl: 1450,
        // }}
        // p={3}
        sx={{ overflow: "scroll" }}
      > */}
      <Stack gap={2} direction="column" sx={{ mb: 4, p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={{
            md: 0,
            xs: 3,
          }}
          borderBottom={"1px solid #ECECF3"}
        >
          <StepForm
            activeStep={activeStep}
            listSteps={steps}
            skipped={skipped}
            setActiveStep={setActiveStep}
          />
        </Stack>
        {activeStep === 1 ? (
          <FormStepTwo
            isMdSmaller={isMdSmaller}
            budgets={selectedBudget}
            setActiveStep={setActiveStep}
          />
        ) : (
          <FormStepOne isMdSmaller={isMdSmaller} handleNext={handleNext} />
        )}
      </Stack>
      {/* </FixedLayout> */}
    </>
  );
};

export default memo(FormCreate);
