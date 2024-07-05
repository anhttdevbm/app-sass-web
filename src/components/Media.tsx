import { memo } from "react";
import Image, { ImageProps, StaticImageData } from "next/image";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";

type MediaProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | StaticImageData;
  alt?: string;
  size: number;
  className?: string;
  borderRadius?: string;
};

const Media = (props: MediaProps) => {
  const { src, alt = "Media", size, className, borderRadius, ...rest } = props;

  return (
    <Image
      className={className}
      src={src ? src : UserPlaceholderImage}
      alt={alt}
      width={size}
      height={size}
      style={{
        minWidth: size,
        maxWidth: size,
        objectFit: "cover",
        borderRadius: borderRadius,
      }}
      {...rest}
    />
  );
};

export default memo(Media);
