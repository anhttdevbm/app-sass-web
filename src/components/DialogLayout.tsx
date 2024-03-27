import { ForwardedRef, forwardRef, memo } from "react";
import {
  backdropClasses,
  Dialog,
  dialogClasses,
  DialogProps,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogTitleProps,
  DialogActionsProps,
  DialogContentProps,
  SxProps,
} from "@mui/material";
import { IconButton, Text } from "./shared";
import CloseIcon from "icons/CloseIcon";
import { SlotComponentProps } from "@mui/base";
import { useTranslations } from "next-intl";
import { NS_COMMON } from "constant/index";
import { ThemeMode } from "constant/enums";

export type DialogLayoutProps = Omit<DialogProps, "onSubmit"> & {
  children: React.ReactNode;
  renderHeader?: React.ReactNode | string;
  renderBottom?: React.ReactNode;
  headerProps?: DialogTitleProps;
  contentProps?: DialogContentProps;
  bottomProps?: DialogActionsProps;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit?: (event?: React.FormEvent<any> | undefined) => void | Promise<any>;
  hasCloseButton?: boolean;
  hasDialogClose?: boolean;
  zIndex?: number;
  submitWhenEnter?: boolean;
};

const DialogLayout = forwardRef(
  (props: DialogLayoutProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      children,
      renderHeader,
      renderBottom,
      sx,
      onClose: onCloseProps,
      headerProps = {},
      bottomProps = {},
      contentProps = {},
      hasCloseButton = true,
      hasDialogClose = true,
      onSubmit,
      zIndex = 50,
      submitWhenEnter,
      ...rest
    } = props;
    const t = useTranslations(NS_COMMON);

    const { sx: sxContentProps, ...restContentProps } = contentProps;
    const { sx: sxHeaderProps, ...restHeaderProps } = headerProps;

    const onClose = (_: {}, reason: "backdropClick" | "escapeKeyDown") => {
      if (reason !== "backdropClick") {
        onCloseProps();
      }
    };

    return (
      <Dialog
        scroll="paper"
        slots={{
          root: onSubmit && submitWhenEnter ? "form" : undefined,
        }}
        slotProps={{
          root: {
            noValidate: true,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
        }}
        onSubmit={onSubmit}
        sx={{
          [`& .${backdropClasses.root}`]: {
            zIndex,
          },
          [`& .${dialogClasses.paper}`]: {
            ...defaultSx.paper,
            ...sx,
          },
        }}
        onClose={hasDialogClose ? onClose : undefined}
        {...rest}
      >
        <DialogTitle
          id="scroll-dialog-title"
          component="div"
          position="relative"
          sx={
            {
              ...defaultSx.header,
              ...sxHeaderProps,
            } as DialogTitleProps["sx"]
          }
          {...restHeaderProps}
        >
          {!renderHeader || typeof renderHeader === "string" ? (
            <Text textTransform="capitalize" fontWeight={600}>
              {renderHeader ?? ""}
            </Text>
          ) : (
            renderHeader
          )}
          {hasCloseButton && (
            <IconButton
              size="normal"
              noPadding
              onClick={onCloseProps}
              sx={{
                color: "grey.400",
                position: "absolute",
                top: "50%",
                right: 0,
                transform: "translateY(-50%)",
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent
          sx={{ p: 0, overflowX: "hidden", pr: 0.5, ...sxContentProps }}
          {...restContentProps}
          ref={ref}
        >
          {children}
        </DialogContent>
        {Boolean(renderBottom) && (
          <DialogActions sx={{ ml: "auto" }} {...bottomProps}>
            {renderBottom}
          </DialogActions>
        )}
      </Dialog>
    );
  },
);

DialogLayout.displayName = "DialogLayout";

export default memo(DialogLayout);

const defaultSx = {
  paper: {
    py: 3,
    m: 0,
    width: { xs: "calc(100% - 24px)", sm: 360 },
    maxWidth: "calc(100vw - 24px)",
    backgroundImage: "none",
    backgroundColor: "background.paper",
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: 2,
    boxShadow: "0px 4px 20px rgba(33, 33, 33, 0.04)",
    outline: "none",
    zIndex: 100,
  },
  header: {
    p: 0,
    mx: 3,
    minHeight: 24,
    height: "fit-content",
  },
} as { [key: string]: SxProps };
