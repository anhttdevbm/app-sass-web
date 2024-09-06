"use client";

import { memo, useState } from "react";
import Modal from "@mui/material/Modal";
import StepTwo from "./StepTwo";
import StepOne from "./StepOne";
import StepThree from "./StepThree";

export interface DataStepOne {
  newPackage: string;
  billingPlan: string;
  numberOfUser: number;
}
type Props = {
  open: boolean;
  onClose: () => void;
};
export type DataPrice = {
  priceOfMonth: number;
  subTotal: number;
  total: number;
  vat: number;
};

const ModalUpgradePackage = (props: Props) => {
  const { open, onClose } = props;
  const [step, setStep] = useState(0);
  const [dataStepOne, setDataStepOne] = useState<DataStepOne>({
    billingPlan: "Standard",
    newPackage: "Monthly",
    numberOfUser: 10,
  });
  const [dataPrice, setDataPrice] = useState<DataPrice>({
    priceOfMonth: 0,
    subTotal: 0,
    total: 0,
    vat: 0,
  });

  const renderModal = () => {
    switch (step) {
      case 0:
        return (
          <StepOne
            setStep={setStep}
            onClose={onClose}
            setDataStepOne={setDataStepOne}
          />
        );
      case 1:
        return (
          <StepTwo
            setStep={setStep}
            onClose={onClose}
            dataStepOne={dataStepOne}
            dataPrice={dataPrice}
            setDataPrice={setDataPrice}
          />
        );
      case 2:
        return (
          <StepThree
            setStep={setStep}
            onClose={onClose}
            dataPrice={dataPrice}
          />
        );
      default:
        return null;
    }
  };
  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <>{renderModal()}</>
    </Modal>
  );
};

export default memo(ModalUpgradePackage);
