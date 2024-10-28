import { Box, Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import { IMAGES_ACCEPT, NS_AUTH, NS_COMMON } from "constant/index";
import UploadIcon from "icons/UploadIcon";
import { useTranslations } from "next-intl";
import Image from "next/image";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { ChangeEvent, memo, useMemo, useRef, useState } from "react";
import { useSnackbar } from "store/app/selectors";

type AvatarUploadProps = {
  value?: File;
  onChange: (file?: File) => void;
};

const AvatarUpload = (props: AvatarUploadProps) => {
  const { value, onChange } = props;
  const authT = useTranslations(NS_AUTH);
  const commonT = useTranslations(NS_COMMON);
  const inputFileRef = useRef<HTMLInputElement | null>(null);
  const [isHover, setIsHover] = useState(false);
  const { onAddSnackbar } = useSnackbar();

  const previewImage = useMemo(
    () => (value ? URL.createObjectURL(value) : UserPlaceholderImage),
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

  const onRemoveAvatar = () => {
    onChange && onChange(undefined); // Xóa ảnh đã chọn
  };

  return (
    <Stack spacing={1}>
      <Text variant="caption" color="grey.300">
        {authT("signup.form.title.avatar")}
      </Text>
      <Stack direction="row" alignItems="center" spacing={2}>
        {/* <Image
          src={previewImage}
          alt="Avatar"
          width={64}
          height={64}
          className="rounded"
        /> */}
        <Box
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          sx={{ position: 'relative', width: 64, height: 64 }}
        >
          <Image
            src={previewImage}
            alt="Avatar"
            width={64}
            height={64}
            className="rounded"
          />
          {isHover && value && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                cursor: 'pointer',
                fontSize: 12,
              }}
              onClick={onRemoveAvatar}
            >
              Remove bg
            </Box>
          )}
        </Box>
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
