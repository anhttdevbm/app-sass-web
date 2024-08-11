import { SxProps } from "@mui/material";
import DialogLayout from "components/DialogLayout";
import { Text } from "components/shared";
import { NS_DOCS } from "constant/index";
import { useTranslations } from "next-intl";
import React from "react";

interface IDialogProps {
  title: string;
  open: boolean;
  children?: React.ReactNode;
  renderBottom?: React.ReactNode;
  bottomSx?: SxProps;
  onClose: () => void;
}

export default function Dialog(props: IDialogProps) {
  const { title, open, children, renderBottom, bottomSx, onClose } = props;
  const docsT = useTranslations(NS_DOCS);

  return (
    <DialogLayout
      sx={{ ...defaultSx.root }}
      renderHeader={
        <>
          <Text variant="body1" fontWeight={600}>
            {title}
          </Text>
          <Text variant="caption" color="#999999">
            {docsT("import.dialog.subtitle")}
          </Text>
        </>
      }
      headerProps={{
        sx: defaultSx.header,
      }}
      title={"Close"}
      onClose={onClose}
      open={open}
      sizeCloseIcon="medium"
      contentProps={{
        sx: {
          ...defaultSx.content,
          "&::-webkit-scrollbar": { display: "none" },
        },
      }}
      bottomProps={{
        sx: bottomSx,
      }}
      renderBottom={renderBottom}
    >
      {children}
    </DialogLayout>
  );
}

const defaultSx: {
  root: SxProps;
  header: SxProps;
  content: SxProps;
} = {
  root: {
    width: "fit-content",
    minWidth: { sm: 560 },
    minHeight: 230,
    p: 0,
    borderRadius: 1,
  },
  header: {
    borderBottom: "1px solid",
    borderColor: "grey.100",
    px: 3,
    py: 2,
    mx: 0,
    "& > p": {
      textAlign: "left",
    },
    "& > button": {
      top: "calc(50% - 26px)",
      right: 8,
      transform: "unset",
      p: 2,
    },
  },
  content: {
    p: "24px !important",
  },
};
