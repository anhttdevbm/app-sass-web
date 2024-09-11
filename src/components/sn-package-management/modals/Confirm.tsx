"use client";

import { memo, ReactNode } from "react";
import { Box, Typography, Modal, Paper, IconButton } from "@mui/material";
import ButtonCustom from "../components/Button";
import CloseIcon from "icons/CloseIcon";
import { useTranslations } from "next-intl";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";

type Props = {
  title: string;
  open: boolean;
  onSubmit?: () => void;
  onCancel?: () => void;
  children: ReactNode;
  buttonAlignment?: "center" | "right";
  titleAlignment?: "left" | "center";
};

const Confirm = (props: Props) => {
  const {
    title,
    open,
    onSubmit,
    onCancel,
    children,
    buttonAlignment = "right",
  } = props;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  return (
    <Modal
      open={open}
      onClose={onCancel}
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
          padding: { xs: "47px 27px", sm: "33px 100px 58px 100px" },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
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
            onClick={onCancel}
            sx={{ position: "absolute", top: 25, right: 30 }}
          >
            <CloseIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>
        <Box marginTop="20px">{children}</Box>
        <Box
          display="flex"
          justifyContent={buttonAlignment === "center" ? "center" : "flex-end"}
          mt={5}
          gap={"10px"}
        >
          {onCancel && (
            <Box>
              <ButtonCustom
                buttonDefault
                onClick={onCancel}
                text={packageT("button.cancel")}
                width={168}
                height={40}
                sx={{
                  display: { xs: "none", sm: "block" },
                }}
              />
            </Box>
          )}
          {onSubmit && (
            <ButtonCustom
              onClick={onSubmit}
              text={packageT("button.confirm")}
              width={{ xs: 292, sm: 168 }}
              height={40}
            />
          )}
        </Box>
      </Paper>
    </Modal>
  );
};

export default memo(Confirm);
