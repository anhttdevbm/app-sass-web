import { memo, useState, MouseEvent, useId, useRef, ChangeEvent, useMemo } from "react";
import {
  Box,
  ButtonBase,
  DialogContent,
  Divider,
  Popover,
  popoverClasses,
  Slider,
  Stack,
} from "@mui/material";
import { Button, Text } from "components/shared";
import ChevronIcon from "icons/ChevronIcon";
import { useAuth, useSnackbar, useUserInfo } from "store/app/selectors";
import Link from "components/Link";
import { UPGRADE_ACCOUNT_PATH } from "constant/paths";
import Avatar from "components/Avatar";
import CrownIcon from "icons/CrownIcon";
import { useAppDispatch } from "store/hooks";
import { reset as appReset } from "store/app/reducer";
import { reset as projectReset } from "store/project/reducer";
import { reset as managerReset } from "store/manager/reducer";
import { reset as companyReset } from "store/company/reducer";
import { useTranslations } from "next-intl";
import { IMAGES_ACCEPT, NS_ACCOUNT, NS_COMMON, NS_LAYOUT } from "constant/index";
import { Permission } from "constant/enums";
import UserActions from "./UserActions";
import useToggle from "hooks/useToggle";
import AvatarEditor from "react-avatar-editor";
import { useFormik } from "formik";
import {  getMessageErrorByAPI } from "utils/index";
import { UpdateUserInfoData } from "store/app/actions";
import { Endpoint, client } from "api";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";


const AccountInfo = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const popoverId = useId();
  const { user, onSignOut: onSignOutAuth } = useAuth();
  const dispatch = useAppDispatch();
  const accountT = useTranslations(NS_ACCOUNT);
  const commonT = useTranslations(NS_COMMON);
  const t = useTranslations(NS_LAYOUT);
  const imageEdittorRef = useRef<AvatarEditor>(null);
  const [imageScale, setImageScale] = useState(1.2);
  const [openImageEditor, setOpenImageEditor] = useState<string | null>(null);
  const { onUpdateUserInfo } = useUserInfo();

  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const [isEdit, onEditTrue, onEditFalse] = useToggle();
  const { onAddSnackbar } = useSnackbar();

  const onSubmit = async (values: UpdateUserInfoData) => {
    try {
      const newData = { ...values };
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

  const initialValues = useMemo(
    () => ({
      avatar: user?.avatar?.link,
    }),
    [user],
  ) as UpdateUserInfoData;

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit,
  });

  const onChooseFile = () => {
    inputFileRef?.current?.click();
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    if (IMAGES_ACCEPT.includes(files[0].type)) {
      setOpenImageEditor(URL.createObjectURL(files[0]));            
      formik.setFieldValue("avatar", files[0]);
    } else {
      onAddSnackbar(commonT("form.notification.imageTypeInvalid"), "error");
    }
  };

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
      .then(() => {
        onSubmit(formik.values);
      })
      .finally(() => {
        setOpenImageEditor(null);
      });
  };

  const onOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onSignOut = () => {
    onSignOutAuth();
    dispatch(appReset());
    dispatch(projectReset());
    dispatch(managerReset());
    dispatch(companyReset());
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  if (!user) return null;

  return (
    <>
      <Stack
        component={ButtonBase}
        disableRipple
        direction="row"
        alignItems="center"
        borderRadius={1}
        spacing={1}
        color="common.white"
        sx={{
          cursor: "pointer",
        }}
        onClick={onOpen}
        display={{ xs: "none", sm: "flex" }}
      >
        <Avatar size={32} alt={user.fullname} src={user?.avatar?.link} />

        <ChevronIcon fontSize="medium" sx={{ color: "grey.900" }} />
      </Stack>

      <Popover
        id={popoverId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          [`& .${popoverClasses.paper}`]: {
            backgroundImage: "none",
            minWidth: 216,
            maxWidth: 236,
          },
        }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: 1,
              mt: 0.5,
            },
          },
        }}
      >
        <Stack
          p={2}
          sx={{
            boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.1)",
            border: "1px solid",
            borderColor: "grey.100",
            borderBottomLeftRadius: 1,
            borderBottomRightRadius: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} py={2}>
            <Avatar
              size={60}
              alt={user.fullname}
              src={user?.avatar?.link}
              onClick={isEdit ? onChooseFile : onEditTrue}
            />
            {isEdit && (
              <>
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
            <Stack flex={1} overflow="hidden">
              <Text
                variant="h6"
                color="grey.400"
                sx={{ wordBreak: "break-all" }}
              >
                {user.fullname}
              </Text>
              <Text
                variant="caption"
                color="grey.400"
                sx={{ wordBreak: "break-all" }}
              >
                {user?.position?.name ?? "--"}
              </Text>
              <Text
                variant="body2"
                color="grey.400"
                sx={{ wordBreak: "break-all" }}
              >
                {user.email}
              </Text>
            </Stack>
          </Stack>
          <Divider sx={{ backgroundColor: "grey.100" }} />
          {!user?.company && !user?.roles?.includes(Permission.SA) && (
            <Link href={UPGRADE_ACCOUNT_PATH} underline="none">
              <Button
                variant="secondary"
                startIcon={<CrownIcon sx={{ fontSize: 20 }} />}
                size="extraSmall"
                sx={{ mt: 1 }}
              >
                {commonT("upgradeAccount")}
              </Button>
            </Link>
          )}
          <UserActions onClose={onClose} />
        </Stack>
      </Popover>
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

export default memo(AccountInfo);
