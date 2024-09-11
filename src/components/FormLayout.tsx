import { CircularProgress, Stack } from "@mui/material";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { memo } from "react";
import DialogLayout, { DialogLayoutProps } from "./DialogLayout";
import { Button } from "./shared";

type FormLayoutProps = {
  label?: string;
  submitText?: string;
  cancelText?: string;
  disabled?: boolean;
  submitting?: boolean;
  pending?: boolean;
  bodyFlex?: number;
  renderHeader?: React.ReactNode;
  isAllTemplate?: boolean;
} & DialogLayoutProps;

const FormLayout = (props: FormLayoutProps) => {
  const commonT = useTranslations(NS_COMMON);
  const {
    label,
    submitText = commonT("form.confirm"),
    cancelText = commonT("form.cancel"),
    children,
    disabled,
    submitting,
    sx,
    onClose,
    pending,
    submitWhenEnter = true,
    onSubmit,
    renderHeader,
    bodyFlex = 1,
    bottomProps,
    isAllTemplate,
    ...rest
  } = props;
  return (
    <DialogLayout
      sx={{ ...defaultSx.root, ...sx }}
      headerProps={{
        sx: {...defaultSx.header, borderBottom: isAllTemplate ? "none" : "1px solid"},
      }}
      bottomProps={{
        sx: {...defaultSx.bottom, marginLeft: isAllTemplate ? "auto" : "" },
      }}
      renderHeader={label ?? renderHeader}
      contentProps={{ sx: { px: 3 } }}
      renderBottom={
        <>
          <Button
            type="button"
            onClick={onClose}
            variant="primaryOutlined"
            disabled={submitting}
            size="small"
            sx={{
              ...defaultSx.button,
              borderRadius: "100px",
              borderColor: "#3699FF",
              "&:hover": {
                borderColor: "#3699FF",
              },
            }}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            disabled={disabled}
            sx={{
              ...defaultSx.button,
              borderRadius: "100px",
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              "&:hover": {
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              },
            }}
            type={submitWhenEnter ? "submit" : "button"}
            size="small"
            pending={submitting}
            onClick={submitWhenEnter ? undefined : onSubmit}
          >
            {submitText}
          </Button>
        </>
      }
      onClose={onClose}
      onSubmit={onSubmit}
      submitWhenEnter={submitWhenEnter}
      {...rest}
    >
      <Stack flex={bodyFlex} overflow="auto">
        {pending ? (
          <CircularProgress
            size={24}
            color="primary"
            sx={{ mx: "auto", my: 3 }}
          />
        ) : (
          children
        )}
      </Stack>
    </DialogLayout>
  );
};

export default memo(FormLayout);

const defaultSx = {
  root: {
    minWidth: { xs: "calc(100vw - 24px)", sm: 850 },
    zIndex: 50,
  },
  bottom: {
    pt: 3,
    pb: 0,
    px: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: "",
  },
  header: {
    borderBottom: "1px solid",
    borderColor: "grey.100",
    pb: 3,

    "& > button": {
      top: 0,
      transform: "unset",
    },
  },
  button: {
    minWidth: 120,
    mx: 1.5,
  },
};
