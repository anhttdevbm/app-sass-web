import { Stack, Box } from "@mui/material";
import { Button, Text } from "components/shared";
import { ChangeEvent, memo, useEffect, useMemo, useRef, useState } from "react";
import UserPlaceholderImage from "public/images/img-logo-placeholder.webp";
import Image from "next/image";
import UploadIcon from "icons/UploadIcon";
import { useSnackbar } from "store/app/selectors";
import { IMAGES_ACCEPT, NS_AUTH, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";

type AvatarUploadProps = {
  value?: File;
  onChange: (file?: File) => void;
};

const AvatarUpload = (props: AvatarUploadProps) => {
  const { value, onChange } = props;
  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);
  const inputFileRef = useRef<HTMLInputElement | null>(null);

  const { onAddSnackbar } = useSnackbar();

  const previewImage = useMemo(
    () => (value ? {
      image: URL.createObjectURL(value),
      width: 64,
      height: 64
    } : {
      image: UserPlaceholderImage,
      width: 32,
      height: 32
    }),
    [value],
  );

  const onChooseFile = () => {
    inputFileRef?.current?.click();
  };

  const onChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    if (IMAGES_ACCEPT.includes(files[0].type)) {
      onChange && onChange(files[0]);
    } else {
      onAddSnackbar(commonT("notification.imageTypeInvalid"), "error");
    }
  };

  return (
    <Stack spacing={1}>
      <Stack direction="column" alignItems="center" spacing={2}>
        <Stack bgcolor="grey.100" width={64} height={64} display="flex" justifyItems="center" className="rounded">
          <Image
            src={previewImage?.image}
            alt="Avatar"
            width={previewImage?.width}
            height={previewImage?.height}
            className="rounded"
            style={{margin: "auto"}}
          />
        </Stack>
        <Button
          variant="secondary"
          sx={{
            height: 32,
            fontSize: 14,
            lineHeight: 18,
          }}
          onClick={onChooseFile}
          size="extraSmall"
          startIcon={<UploadIcon color="primary" sx={{ fontSize: 16 }} />}
        >
          {commonT("form.title.uploadImage")}
        </Button>
      </Stack>

      <Box
        type="file"
        accept={IMAGES_ACCEPT.join(", ")}
        component="input"
        display="none"
        onChange={onChangeFile}
        ref={inputFileRef}
      />
    </Stack>
  );
};

export default memo(AvatarUpload);
