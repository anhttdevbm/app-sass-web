"use client";
import Box from "@mui/material/Box";
import DialogContent from "@mui/material/DialogContent";
import Slider from "@mui/material/Slider";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { ChangeEvent, useMemo, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";

import { Endpoint, client } from "api";
import Avatar from "components/Avatar";
import { Button, IconButton, Text } from "components/shared";
import { Permission } from "constant/enums";
import { IMAGES_ACCEPT, NS_ACCOUNT, NS_COMMON } from "constant/index";
import PencilIcon from "icons/FocusedCameraIcon";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { UpdateUserInfoData } from "store/app/actions";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";
import { useEmployeeDetailContext } from "./EmployeeDetailContext";

const EmployeeDetailHeader = ({ isEdit }: { isEdit: boolean }) => {
  const { user } = useAuth();
  const commonT = useTranslations(NS_COMMON);
  const accountT = useTranslations(NS_ACCOUNT);

  const { type, employee, onGetProfile, onUpdateUserInfo } =
    useEmployeeDetailContext();
  const { onAddSnackbar } = useSnackbar();
  const [avatar, setAvatar] = useState<string | File>(
    employee?.avatar ?? "",
  );
  const imageEdittorRef = useRef<AvatarEditor>(null);
  const [imageScale, setImageScale] = useState(1.2);
  const [openImageEditor, setOpenImageEditor] = useState<string | null>(null);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const isAdmin = useMemo(
    () => user?.roles.includes(Permission.AM),
    [user?.roles],
  );

  const hasPermissionToEdit = useMemo(
    () => type === "SELF" || isAdmin,
    [type, isAdmin],
  );

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
    if (avatar instanceof File) {
      return URL.createObjectURL(avatar);
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

      const avatarUrl = await client.uploadFile(Endpoint.UPLOAD_FILE, file);      

      const data = {
        avatar: avatarUrl.data?.link,
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
      <Stack direction="row" alignItems="center">
        <Stack width={100} height={100} borderRadius="50%" position="relative">
          <Avatar
            size={100}
            src={previewImage}
            alt={employee.fullname}
            onClick={isEdit && hasPermissionToEdit ? onChooseFile : undefined}
            style={{ cursor: "pointer" }}
          />
          {isEdit && hasPermissionToEdit && (
            <>
              <IconButton
                onClick={onChooseFile}
                noPadding
                sx={{
                  width: 37,
                  height: 37,
                  backgroundColor: "#D9F0FD",
                  "&:hover": {
                    backgroundColor: "#D9F0FD",
                  },
                  borderRadius: "50%",
                  position: "absolute",
                  bottom: -17,
                  right: -3,
                }}
              >
                <PencilIcon sx={{ color: "#0575E6", fontSize: 18 }} />
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
        <Stack marginLeft={2} spacing="8px" alignItems="start">
          <Text
            variant="subtitle1"
            fontWeight={600}
            color="#404040"
            fontSize={20}
          >
            {employee.fullname}
          </Text>
          <Text
            py="6px"
            px="18px"
            bgcolor="#14B9E5"
            color="common.white"
            borderRadius={9999}
            textAlign="center"
            fontSize={13}
            fontWeight={500}
          >{`${employee.position?.name ?? "--"} at ${
            employee.company ?? "--"
          }`}</Text>
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
  );
};

export default EmployeeDetailHeader;
