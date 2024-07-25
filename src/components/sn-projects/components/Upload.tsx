import { Avatar, Box, DialogContent, Slider, Stack } from "@mui/material";
import { Button, IconButton, Text } from "components/shared";
import { IMAGES_ACCEPT, NS_COMMON } from "constant/index";
import UploadIcon from "icons/UploadIcon";
import UploadLogoRoundIcon from "icons/UploadLogoRoundIcon";
import DefaultPopupLayout from "layouts/DefaultPopupLayout";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import LogoPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { ChangeEvent, memo, useMemo, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useSnackbar } from "store/app/selectors";

export type UploadProps = {
  name: string;
  required?: boolean;
  onChange: (name: string, file?: File) => void;
  value?: File | string;
  placeholder?: StaticImageData;
};

const Upload = (props: UploadProps) => {
  const {
    name,
    required,
    onChange,
    value,
    placeholder = LogoPlaceholderImage,
  } = props;
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const { onAddSnackbar } = useSnackbar();
  const t = useTranslations(NS_COMMON);
  const imageEdittorRef = useRef<AvatarEditor>(null);
  const [imageScale, setImageScale] = useState(1.2);
  const [openImageEditor, setOpenImageEditor] = useState<string | null>(null);

  const previewImage = useMemo(() => {
    if (typeof value === "object") {
      return URL.createObjectURL(value);
    }
    return (value as string | undefined) ?? placeholder;
  }, [placeholder, value]);

  const onChooseFile = () => {
    inputFileRef?.current?.click();
  };

  const handleCropAvatar = () => {
    const dataUrl = imageEdittorRef.current
      ?.getImageScaledToCanvas()
      .toDataURL();
    fetch(dataUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const file = new File([blob], "avatar.png", { type: blob.type });
        onChange(name, file);
        // formik.setFieldValue("avatar", file);
      })
      .finally(() => {
        setOpenImageEditor(null);
      });
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    if (IMAGES_ACCEPT.includes(files[0].type)) {
      // onChange(name, files[0]);
      setOpenImageEditor(URL.createObjectURL(files[0]));
    } else {
      onAddSnackbar(t("notification.imageTypeInvalid"), "error");
    }
  };

  return (
    <>
      <Stack spacing={1}>
        <IconButton onClick={onChooseFile}>
          {value ? (
            <Image
              alt="Image"
              src={previewImage}
              width={56}
              height={56}
              className="rounded"
            />
          ) : (
            <UploadLogoRoundIcon
              sx={{
                width: 56,
                height: 56,
                color: "transparent",
              }}
            />
          )}
        </IconButton>

        <Box
          type="file"
          accept={IMAGES_ACCEPT.join(", ")}
          component="input"
          display="none"
          onChange={onChangeFile}
          ref={inputFileRef}
        />
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
              defaultValue={imageScale}
            />
          </Stack>

          <Stack direction="row" justifyContent="center" spacing={2}>
            <Button
              variant="secondary"
              onClick={() => setOpenImageEditor(null)}
            >
              {t("cancel")}
            </Button>
            <Button variant="primary" onClick={handleCropAvatar}>
              {t("crop")}
            </Button>
          </Stack>
        </DialogContent>
      </DefaultPopupLayout>
    </>
  );
};

export default memo(Upload);
