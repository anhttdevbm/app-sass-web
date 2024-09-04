"use client";

import { memo, ReactNode, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import CloseIcon from "icons/CloseIcon";
import ButtonCustom from "../components/Button";
import SearchPackageManagement from "../components/Search";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";

type Props = {
  open: boolean;
  onClose: any;
};

const Change = (props: Props) => {
  const { open, onClose } = props;

  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  const [step, setStep] = useState<number>(0);
  const onSubmit = () => {
    if (step === 1) {
      setStep((prevStep) => prevStep + 1);
    } else {
      handleClose();
    }
  };
  const handleClose = () => {
    onClose();
    setStep(0);
  };
  return (
    <Modal
      open={open}
      // onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 3,
          width: 744,
          padding: "33px 100px 58px 100px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {step === 2 ? (
            <Text
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                textAlign: "center",
                flexGrow: 1,
              }}
            >
              {packageT("title.confirmToChange")}
            </Text>
          ) : (
            <Text
              id="modal-title"
              variant="h6"
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                textAlign: "left",
                flexGrow: 1,
              }}
            >
              {packageT("title.chooseBillingOwner")}
            </Text>
          )}
        </Box>
        <Box>
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", top: 25, right: 30 }}
          >
            <CloseIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>
        {step === 0 ? (
          <Box marginTop="20px">
            <Text>{packageT("description.onlyAdmin")}</Text>
            <SearchPackageManagement width="100%" />
            <Box
              onClick={() => setStep((prevStep) => prevStep + 1)}
              display="flex"
              gap={2}
            >
              <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
              <Box>
                Nguyễn Văn A (phamvana@taskcover.com) <br /> Admin
              </Box>
            </Box>
          </Box>
        ) : step === 1 ? (
          <Box marginTop="20px" display="flex" gap={2}>
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
            Nguyễn Văn A (phamvana@taskcover.com){" "}
          </Box>
        ) : (
          <Box marginTop="20px" textAlign={"center"}>
            <Text fontWeight={400} marginBottom="20px">
              {packageT("description.confirm")}
            </Text>
            <Text color="#999999">{packageT("description.byAssigning")}</Text>
          </Box>
        )}
        {step !== 0 && (
          <Box
            display="flex"
            justifyContent={step === 2 ? "center" : "flex-end"}
            mt={5}
            gap={"10px"}
          >
            <ButtonCustom
              buttonDefault
              onClick={handleClose}
              text={packageT("button.cancel")}
              width={168}
              height={40}
            />
            <ButtonCustom
              onClick={onSubmit}
              text={packageT("button.confirm")}
              width={168}
              height={40}
            />
          </Box>
        )}
      </Paper>
    </Modal>
  );
};

export default memo(Change);
