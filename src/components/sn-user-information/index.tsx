"use client";
import { Box, DialogContent, Grid, Slider, Stack } from "@mui/material";
import { Endpoint, client } from "api";
import Avatar from "components/Avatar";
import FixedLayout from "components/FixedLayout";
import { Button, IconButton, Input, Text } from "components/shared";
import {
  AN_ERROR_TRY_RELOAD_PAGE,
  IMAGES_ACCEPT,
  NS_ACCOUNT,
  NS_COMMON,
} from "constant/index";
import { FormikErrors, useFormik } from "formik";
import useBreakpoint from "hooks/useBreakpoint";
import useToggle from "hooks/useToggle";
import CopyIcon from "icons/CopyIcon";
import PencilIcon from "icons/PencilIcon";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useTranslations } from "next-intl";
import { ChangeEvent, memo, useMemo, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { UpdateUserInfoData } from "store/app/actions";
import { useAuth, useSnackbar, useUserInfo } from "store/app/selectors";
import { getDataFromKeys, getMessageErrorByAPI } from "utils/index";
import * as Yup from "yup";

const UserInformation = () => {
  const { user } = useAuth();
  const { onUpdateUserInfo } = useUserInfo();
  const commonT = useTranslations(NS_COMMON);
  const accountT = useTranslations(NS_ACCOUNT);
  const imageEdittorRef = useRef<AvatarEditor>(null);
  const [imageScale, setImageScale] = useState(1.2);
  const [openImageEditor, setOpenImageEditor] = useState<string | null>(null);

  const { isSmSmaller } = useBreakpoint();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [isEdit, onEditTrue, onEditFalse] = useToggle();

  const { onAddSnackbar } = useSnackbar();

  const onSubmit = async (values: UpdateUserInfoData) => {
    try {
      const newData = { ...values };
      console.log("newData", newData);
      console.log("type newData", typeof formik.values);
      console.log("type avatar", typeof values["avatar"]);
      console.log("value avatar", values["avatar"]);

      if (typeof values["avatar"] === "object") {
        const avatarUrl: string = await client.upload(
          Endpoint.UPLOAD,
          values["avatar"] as unknown as File,
        );
        newData["avatar"] = [avatarUrl];
      } else {
        delete newData["avatar"];
      }

      await onUpdateUserInfo(newData);
      onEditFalse();
      onAddSnackbar(
        accountT("accountInformation.notification.updateSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const onCancel = () => {
    formik.resetForm();
    onEditFalse();
  };

  const onChooseFile = () => {
    inputFileRef?.current?.click();
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    if (IMAGES_ACCEPT.includes(files[0].type)) {
      setOpenImageEditor(URL.createObjectURL(files[0]));
      // formik.setFieldValue("avatar", files[0]);
    } else {
      onAddSnackbar(commonT("form.notification.imageTypeInvalid"), "error");
    }
  };

  const initialValues = useMemo(
    () => ({
      ...getDataFromKeys(user, Object.keys(INITIAL_VALUES)),
      avatar: user?.avatar?.link,
    }),
    [user],
  ) as UpdateUserInfoData;

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const handleCropAvatar = () => {
    const dataUrl = imageEdittorRef.current
      ?.getImageScaledToCanvas()
      .toDataURL();
    fetch(dataUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "avatar.png", { type: blob.type });
        formik.setFieldValue("avatar", file);
      })
      .finally(() => {
        setOpenImageEditor(null);
      });
  };

  const previewImage = useMemo(() => {
    if (typeof formik.values?.avatar === "object") {
      return URL.createObjectURL(formik.values.avatar as unknown as File);
    }
    return formik.values?.avatar as string | undefined;
  }, [formik.values?.avatar]);

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (
        out: FormikErrors<typeof INITIAL_VALUES & { rePassword: string }>,
        [key, error],
      ) => {
        if (formik.touched[key]) {
          out[key] = error;
        }
        return out;
      },
      {},
    );
  }, [formik.touched, formik.errors]);

  const disabled = useMemo(
    () => !!Object.values(touchedErrors)?.length || formik.isSubmitting,
    [touchedErrors, formik.isSubmitting],
  );

  if (!user) {
    return (
      <Text variant="body2" textAlign="center" fontWeight={600}>
        {commonT(AN_ERROR_TRY_RELOAD_PAGE)}
      </Text>
    );
  }

  return (
    <>
      <FixedLayout flex={1}>
        <Box margin={4}>
          <Stack direction="row">
            <Stack width={90} height={90} borderRadius="50%" position="relative">
              <Avatar
                size={90}
                src={previewImage}
                alt={user.fullname}
                onClick={isEdit ? onChooseFile : onEditTrue}
                style={{ cursor: "pointer" }}
              />
              {isEdit && (
                <>
                  <IconButton
                    onClick={onChooseFile}
                    noPadding
                    sx={{
                      width: 24,
                      height: 24,
                      backgroundColor: "grey.50",
                      "&:hover": {
                        backgroundColor: "grey.50",
                      },
                      borderRadius: "50%",
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                    }}
                  >
                    <PencilIcon sx={{ color: "grey.400", fontSize: 24 }} />
                  </IconButton>
                  <Box
                    component="input"
                    type="file"
                    accept={IMAGES_ACCEPT.join(", ")}
                    display="none"
                    ref={inputFileRef}
                    onChange={onChangeFile}
                  />
                </>
              )}
            </Stack>
            <Stack marginLeft={2} alignItems="start">
              <Text variant="subtitle1" fontWeight={700}>{user.fullname}</Text>
              <Text
                py={1}
                px={3}
                bgcolor="primary.main"
                color="common.white"
                borderRadius={9999}
                textAlign="center"
                fontSize={12}
                fontWeight={500}
              >{ user?.position?.name ?? "--" }</Text>
            </Stack>
          </Stack>
          <Grid
            container
            spacing={3}
            width="100%"
            py={{
              xs: 3,
              sm: 4,
            }}
            component="form"
            noValidate
            onSubmit={formik.handleSubmit}
          >

            <Grid item xs={12} sm={6}>
              <Input
                rootSx={sxConfig.input}
                title={commonT("fullName")}
                fullWidth
                name="fullname"
                disabled={!isEdit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values?.fullname}
                error={commonT(touchedErrors?.fullname, {
                  name: commonT("fullName"),
                  min: 6,
                })}
                required={isEdit}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                rootSx={sxConfig.input}
                title="Username"
                fullWidth
                name="username"
                disabled
                value={user?.["username"]}
                endNode={
                  <IconButton
                    sx={{color: 'blue.500', bgcolor: 'grey.50'}}
                    aria-label="copy"
                    onClick={() => { navigator.clipboard.writeText(user?.["username"]) }}
                  >
                    <CopyIcon />
                  </IconButton>
                }
                tooltip={
                  isEdit
                    ? accountT("accountInformation.notAllowUpdate", {
                        name: "Username",
                      })
                    : undefined
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                rootSx={sxConfig.input}
                title={commonT("phone")}
                fullWidth
                name="phone"
                disabled={!isEdit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values?.phone}
                error={commonT(touchedErrors?.phone, {
                  name: commonT("phone"),
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                rootSx={sxConfig.input}
                title={commonT("address")}
                fullWidth
                name="address"
                disabled={!isEdit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values?.address}
                error={commonT(touchedErrors?.address, {
                  name: commonT("address"),
                })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Input
                rootSx={sxConfig.input}
                title="Email"
                fullWidth
                name="email"
                disabled
                value={user.email}
                tooltip={
                  isEdit
                    ? accountT("accountInformation.notAllowUpdate", {
                        name: "Email",
                      })
                    : undefined
                }
              />
            </Grid>

            <Grid container item xs={12} justifyContent="center" >
              {!isEdit && (
                <Button onClick={onEditTrue} variant="secondary" size="small">
                  {accountT("accountInformation.changeInformation")}
                </Button>
              )}

              {isEdit && (
                <Stack
                  direction={{ xs: "column-reverse", sm: "row" }}
                  alignItems="center"
                  spacing={{ xs: 2, sm: 3 }}
                  width="100%"
                >
                  <Button
                    type="button"
                    onClick={onCancel}
                    sx={sxConfig.button}
                    variant="primaryOutlined"
                    size={isSmSmaller ? "medium" : "small"}
                    fullWidth
                  >
                    {commonT("form.cancel")}
                  </Button>
                  <Button
                    disabled={disabled}
                    pending={formik.isSubmitting}
                    sx={{ ...sxConfig.button }}
                    variant="primary"
                    size={isSmSmaller ? "medium" : "small"}
                    type="submit"
                    fullWidth
                  >
                    {commonT("form.confirm")}
                  </Button>
                </Stack>
              )}
            </Grid>
          </Grid>
        </Box>
      </FixedLayout>

      <DefaultPopupLayout
        open={!!openImageEditor}
        title="Image editor"
        onClose={() => setOpenImageEditor(null)}
      >
        <DialogContent>
          <Stack alignItems="center" gap={2}>
            <AvatarEditor
              ref={imageEdittorRef}
              image={openImageEditor}
              width={300}
              height={300}
              border={50}
              color={[255, 255, 255, 0.6]} // RGBA
              borderRadius={300}
              scale={imageScale}
              rotate={0}
            />

            <Slider
              onChange={(event: Event, newValue: number | number[]) => {
                setImageScale(parseFloat(newValue.toString()));
              }}
              min={1}
              max={2}
              step={0.1}
              defaultValue={imageScale}
            />
          </Stack>

          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              variant="secondary"
              onClick={() => setOpenImageEditor(null)}
            >
              {commonT("cancel")}
            </Button>
            <Button variant="primary" onClick={handleCropAvatar}>
              {commonT("crop")}
            </Button>
          </Stack>
        </DialogContent>
      </DefaultPopupLayout>
    </>
  );
};

export default memo(UserInformation);

const INITIAL_VALUES = {
  fullname: "",
  phone: "",
  address: "",
  avatar: "",
};

export const validationSchema = Yup.object().shape({
  fullname: Yup.string()
    .trim()
    .required("form.error.required")
    .min(6, "form.error.min"),
  // phone: Yup.string().trim().matches(VN_PHONE_REGEX, "form.error.invalid"),
});

const sxConfig = {
  input: {
    height: 58,
    "& input": {
      color: ({ palette }) => `${palette.grey[900]}!important`,
    },
  },
  button: {
    minWidth: 150,
  },
};
