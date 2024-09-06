"use client";

import { memo, ReactNode } from "react";
import {
  Box,
  Typography,
  Modal,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import CloseIcon from "icons/CloseIcon";
import { useTranslations } from "next-intl";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { Text } from "components/shared";

type Props = {
  title: string;
  question: string;
  open: boolean;
  onSubmit?: () => void;
  onClose: () => void;
};

const ConfirmToRequest = (props: Props) => {
  const { title, open, onSubmit, onClose, question } = props;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  return (
    <Modal
      open={open}
      onClose={onClose}
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
          padding: "33px 0 58px 0",
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          paddingBottom="20px"
          sx={{
            borderBottom: "1px solid #EFEFEF",
          }}
        >
          <Typography
            id="modal-title"
            variant="h6"
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              textAlign: "center",
              flexGrow: 1,
            }}
          >
            {title}
          </Typography>
        </Box>
        <Box>
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 25, right: 30 }}
          >
            <CloseIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>
        <Box marginTop="20px" padding="0 100px">
          <Text
            sx={{
              paddingBottom: "37px",
              textAlign: "center",
              paddingTop: "32px",
            }}
          >
            Are you sure to request {question}?
          </Text>
          <Text
            sx={{
              color: "#999999",
              textAlign: "center",
            }}
          >
            By sending upgrade request, the billing owner will receive
            notification
          </Text>
        </Box>
        <Box display="flex" justifyContent={"center"} mt={5} gap={"10px"}>
          <Button
            onClick={onClose}
            size="extraSmall"
            sx={{
              boxShadow: "none",
              fontWeight: "600",
              background: "#fff",
              "&:hover": {
                background: "#fff",
              },
              borderRadius: "100px",
              height: 34,
              width: 158,
              color: "#0575E6",
              textTransform: "none",
              border: "1px solid  #2AF598 ",
            }}
          >
            Cancel
          </Button>
          <Button
            // onClick={onClick}
            size="extraSmall"
            sx={{
              boxShadow: "none",
              fontWeight: "600",
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              "&:hover": {
                background:
                  "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)!important",
              },
              borderRadius: "100px",
              height: 34,
              width: 158,
              color: "#fff",
              textTransform: "none",
            }}
          >
            Confirm
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default memo(ConfirmToRequest);
