"use client";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import { Box, DialogContent, Slider, Stack } from "@mui/material";
import AvatarEditor from "react-avatar-editor";
import { useTranslations } from "next-intl";

import { Endpoint, client } from "api";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { IMAGES_ACCEPT, NS_ACCOUNT, NS_COMMON } from "constant/index";
import { Button, IconButton, Text } from "components/shared";
import Avatar from "components/Avatar";
import PencilIcon from "icons/PencilIcon";
import { UpdateUserInfoData } from "store/app/actions";
import { useAuth, useSnackbar, useUserInfo } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";

const UserInformationHeader = ({ isEdit }) => {
  const { user, onGetProfile } = useAuth();
  const { onUpdateUserInfo } = useUserInfo();
  const commonT = useTranslations(NS_COMMON);
  const accountT = useTranslations(NS_ACCOUNT);
  const { onAddSnackbar } = useSnackbar();

  const [avatar, setAvatar] = useState<string | File>(user?.avatar?.link ?? "");
  const imageEdittorRef = useRef<AvatarEditor>(null);
  const [imageScale, setImageScale] = useState(1.2);
  const [openImageEditor, setOpenImageEditor] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

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

  const previewImage = useMemo(() => {
    if (typeof avatar === "object") {
      return URL.createObjectURL(avatar as unknown as File);
    }
    return avatar as string | undefined;
  }, [avatar]);

  const handleCropAndSubmitAvatar = async () => {
    try {
      const dataUrl = imageEdittorRef.current
        ?.getImageScaledToCanvas()
        .toDataURL();

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "avatar.png", { type: blob.type });
      setAvatar(file);

      const avatarUrl: string = await client.upload(
        Endpoint.UPLOAD,
        file,
      );

      const data = {
        avatar: avatarUrl,
      } as UpdateUserInfoData;

      await onUpdateUserInfo(data);
      // PUT request doesn't have avatar field in its response
      // so as a workaround, send another GET request
      onGetProfile();

      onAddSnackbar(
        accountT("accountInformation.notification.updateSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      setOpenImageEditor(null);
    }
  };

  return (
    <>
      <Stack direction="row" alignItems="center" pl={4} pt={4}>
        <Stack width={90} height={90} borderRadius="50%" position="relative">
          <Avatar
            size={90}
            src={previewImage}
            alt={user?.fullname}
            onClick={isEdit ? onChooseFile : undefined}
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
          <Text variant="subtitle1" fontWeight={700}>{user?.fullname}</Text>
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
              value={imageScale}
            />
          </Stack>

          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              variant="secondary"
              onClick={() => setOpenImageEditor(null)}
            >
              {commonT("cancel")}
            </Button>
            <Button variant="primary" onClick={handleCropAndSubmitAvatar}>
              {commonT("crop")}
            </Button>
          </Stack>
        </DialogContent>
      </DefaultPopupLayout>
    </>
  )
};

export default UserInformationHeader;