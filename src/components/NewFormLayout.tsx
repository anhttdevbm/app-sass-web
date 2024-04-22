import { CircularProgress, Stack } from "@mui/material";
import { NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { memo } from "react";
import DialogLayout, { DialogLayoutProps } from "./DialogLayout";
import { NewButton as Button } from "./shared";

type FormLayoutProps = {
  label?: string;
  submitText?: string;
  cancelText?: string;
  disabled?: boolean;
  submitting?: boolean;
  pending?: boolean;
  bodyFlex?: number;
  renderHeader?: React.ReactNode;
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
    headerProps,
    bottomProps,
    ...rest
  } = props;
  return (
    <DialogLayout
      sx={{ ...defaultSx.root, ...sx }}
      headerProps={{
        sx: defaultSx.header,
        ...headerProps,
      }}
      bottomProps={{
        sx: defaultSx.bottom,
        ...bottomProps,
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
            sx={defaultSx.button}
          >
            {cancelText}
          </Button>
          <Button
            variant="primary"
            disabled={disabled}
            sx={defaultSx.button}
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
      <Stack direction="column" flex={bodyFlex} overflow="auto">
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
    borderRadius: 6,
    p: 0,
    zIndex: 50,
    "& .MuiDialogContent-root": {
      px: 5,
    },
  },
  bottom: {
    pt: 3,
    pb: 5,
    px: 5,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "end",
  },
  header: {
    ml: 5,
    mr: 2,
    mt: 2,
    "& > button": {
      top: 0,
      transform: "unset",
    },
    "& .MuiTypography-root": {
      mt: 4,
    },
  },
  button: {
    minWidth: 120,
    mx: 1.5,
  },
};
