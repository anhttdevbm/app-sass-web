"use client";

import { memo, useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import StepTwo from "./StepTwo";
import StepOne from "./StepOne";
import StepThree from "./StepThree";
import { Box, useMediaQuery } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

export interface DataStepOne {
  newPackage: string;
  billingPlan: string;
  numberOfUser: number;
}
type Props = {};
export type DataPrice = {
  priceOfMonth: number;
  subTotal: number;
  total: number;
  vat: number;
};

const MobileUpgradePackage = (props: Props) => {
  const searchParams = useSearchParams();

  const unupgradedAccount = searchParams.get("unupgradedAccount");
  const totalAccount = searchParams.get("totalAccount");
  const [step, setStep] = useState(0);
  const isMobile = useMediaQuery("(max-width:600px)");
  const router = useRouter();

  const [dataStepOne, setDataStepOne] = useState<DataStepOne>({
    billingPlan: "",
    newPackage: "",
    numberOfUser: 0,
  });
  const [dataPrice, setDataPrice] = useState<DataPrice>({
    priceOfMonth: 0,
    subTotal: 0,
    total: 0,
    vat: 0,
  });

  useEffect(() => {
    if (!isMobile) {
      router.push("/package-management");
    }
  }, [isMobile, router]);

  useEffect(() => {
    if (unupgradedAccount) {
      setDataStepOne({
        ...dataStepOne,
        numberOfUser: Number(totalAccount) ?? 1,
      });
    }
  }, [unupgradedAccount]);

  const renderModal = () => {
    switch (step) {
      case 0:
        return <StepOne setStep={setStep} setDataStepOne={setDataStepOne} />;
      case 1:
        return (
          <StepTwo
            setStep={setStep}
            dataStepOne={dataStepOne}
            dataPrice={dataPrice}
            setDataPrice={setDataPrice}
            setDataStepOne={setDataStepOne}
          />
        );
      case 2:
        return <StepThree setStep={setStep} dataPrice={dataPrice} />;
      default:
        return null;
    }
  };
  return <Box padding="16px">{renderModal()}</Box>;
};

export default memo(MobileUpgradePackage);
