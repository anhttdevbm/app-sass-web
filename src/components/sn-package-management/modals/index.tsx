"use client";

import { memo, useState } from "react";
import Modal from "@mui/material/Modal";
import StepTwo from "./StepTwo";
import StepOne from "./StepOne";
import StepThree from "./StepThree";

type Props = {
  open: boolean;
  onClose: () => void;
};

const ModalUpgradePackage = (props: Props) => {
  const { open, onClose } = props;
  const [step, setStep] = useState(0);

  const renderModal = () => {
    switch (step) {
      case 0:
        return <StepOne setStep={setStep} onClose={onClose} />;
      case 1:
        return <StepTwo setStep={setStep} onClose={onClose} />;
      case 2:
        return <StepThree setStep={setStep} onClose={onClose} />;
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
