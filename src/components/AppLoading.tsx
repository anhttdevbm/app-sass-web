import { memo } from "react";
import Image from "next/image";
import AppLogoImage from "public/images/img-app-logo.webp";

const AppLoading = () => {
  return (
    <div className="row-center-center w-screen h-screen">
      <Image src={AppLogoImage} alt="App Logo" width={240} />
    </div>
  );
};

export default memo(AppLoading);
