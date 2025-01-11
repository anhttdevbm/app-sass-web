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
  onSubmit: () => void;
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
          padding: { sm: "33px 0 58px 0", xs: "33px 0 30px 0" },
          width: { xs: 360, sm: 500 },
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            borderBottom: "1px solid #EFEFEF",
            padding: "20px",
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
            sx={{
              position: "absolute",
              top: { sm: 25, xs: 10 },
              right: { sm: 30, xs: 10 },
            }}
          >
            <CloseIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>
        <Box marginTop="20px" padding={{ sm: "0 100px", xs: "0 30px" }}>
          <Text
            sx={{
              paddingBottom: "37px",
              textAlign: "center",
              paddingTop: "32px",
            }}
          >
            {question}?
          </Text>
          <Text
            sx={{
              color: "#999999",
              textAlign: "center",
            }}
          >
            {packageT("popup.content")}
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
              display: { xs: "none", sm: "block" },
            }}
          >
            {packageT("button.cancel")}
          </Button>
          <Button
            onClick={onSubmit}
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
              width: { xs: 292, sm: 168 },
              color: "#fff",
              textTransform: "none",
            }}
          >
            {packageT("button.confirm")}
          </Button>
        </Box>
      </Paper>
    </Modal>
  );
};

export default memo(ConfirmToRequest);
