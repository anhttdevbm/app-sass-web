import { memo } from "react";
import Image, { ImageProps } from "next/image";
import AppLogoImage from "public/images/img-app-logo.webp";
import LogoImage from "public/images/img-logo.webp";

type AppLogoProps = Omit<ImageProps, "src" | "alt"> & {
  icon?: boolean;
};

const AppLogo = (props: AppLogoProps) => {
  const { icon, ...rest } = props;

  return (
    <Image src={icon ? LogoImage : AppLogoImage} alt="App Logo" {...rest} />
  );
};

export default memo(AppLogo);
