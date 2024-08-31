"use client";

import { memo } from "react";
import { Box, Paper, IconButton, TextField, Modal } from "@mui/material";
import { Text } from "components/shared";

import {
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
} from "@mui/icons-material";
import ListItem from "../components/ListItem";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";

type Props = {
  open: boolean;
  onClose: () => void;
};

const TransactionDetail = (props: Props) => {
  const { open, onClose } = props;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
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
            {packageT("head.transactionDetail")}
          </Text>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={5} gap="200px">
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

            <Box display="flex" justifyContent="space-between" mt={2} gap={16}>
              <Box width="50%">
                <Text
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                  mb={1}
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
              <Box width="50%">
                <Text
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                  mb={1}
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
          </Box>

          <Box width="50%">
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
      </Paper>
    </Modal>
  );
};

export default memo(TransactionDetail);
