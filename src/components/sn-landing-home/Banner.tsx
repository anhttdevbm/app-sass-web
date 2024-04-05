import Stack from "@mui/material/Stack";
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import { Button, IconButton, Text } from "components/shared";
import PencilIcon from "icons/FocusedCameraIcon";
import { IMAGES_ACCEPT, NS_COMMON, NS_CONTENTS } from "constant/index";
import { useSnackbar } from "store/app/selectors";
import { useTranslations } from "next-intl";
import Box from "@mui/material/Box";
import { useContent } from "store/content/selectors"
import AvatarEditor from "react-avatar-editor";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import DialogContent from "@mui/material/DialogContent";
import Slider from "@mui/material/Slider";
import { Endpoint, client } from "api";
import { getMessageErrorByAPI } from "utils/index";
import Image from "next/image";
import StatusServer from "components/StatusServer";
import React, { memo } from "react";

const BannerHomePage = () => {
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [openImageEditor, setOpenImageEditor] = useState<string | null>(null);
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const contentT = useTranslations(NS_CONTENTS);
  const { item, isFetching, error, onGetHomeBanner, onUpdateHomeBanner } = useContent()
  const [banner, setBanner] = useState<string | File>(item?.link ?? "");
  const imageEdittorRef = useRef<AvatarEditor>(null);
  const [imageScale, setImageScale] = useState(1.2);

  const onChooseFile = () => {
    inputFileRef?.current?.click();
  };

  const previewImage = useMemo(() => {  
    if (typeof banner === "object") {
      return URL.createObjectURL(banner as unknown as File);
    }
    
    return banner as string;
  }, [banner]);

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

  const handleCropAndSubmitAvatar = async () => {
    try {
      const dataUrl = imageEdittorRef.current
        ?.getImageScaledToCanvas()
        .toDataURL();

      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], "avatar.png", { type: blob.type });
      setBanner(file);

      const avatarUrl: string = await client.upload(
        Endpoint.UPLOAD_LINK,
        file,
      );

      
      // PUT request doesn't have avatar field in its response
      // so as a workaround, send another GET request
      await onUpdateHomeBanner({data: avatarUrl });

      onAddSnackbar(
        contentT("home.notification.updateSuccess"),
        "success",
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      setOpenImageEditor(null);
    }
  };

  useEffect(() => {
    onGetHomeBanner();
  }, [onGetHomeBanner]);

  useEffect(() => {
    if (item)
    setBanner(item.link)
  }, [item]);

  return (
    <StatusServer isFetching={isFetching} error={error} noData={!item}>
      <Stack
        spacing={2}
        px={{ xs: 0, md: 3 }}
        py={2}
        >
        <Text variant="h4">
          {contentT("home.banner")}
        </Text>
        <Stack position="relative">
            <Stack
              justifyContent="center"
              alignItems="center"
              border="1px solid"
              borderColor="grey.50"
              sx={{ width: '100%', height: '100%' }}
            >
              <Image
                width={100}
                height={100}
                src={previewImage}
                alt="Image"
                style={{ objectFit: "cover", width:"100%", height: "250px" }}
              />
            </Stack>
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
              onChange={(_event: Event, newValue: number | number[]) => {
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
    </StatusServer>
  );
}

export default memo(BannerHomePage)