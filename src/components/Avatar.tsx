import { memo } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";

type AvatarProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | StaticImageData;
  alt?: string;
  size: number;
};

const Avatar = (props: AvatarProps) => {
  const { src, alt = "Avatar", size, ...rest } = props;

  return (
    <Image
      className="rounded"
      src={src ? src : UserPlaceholderImage}
      alt={alt}
      width={size}
      height={size}
      style={{
        minWidth: size,
        maxWidth: size,
        objectFit: "cover",
        // borderRadius: "50%",
      }}
      {...rest}
    />
  );
};

export default memo(Avatar);
