"use client";
import LandingPageLayout from "layouts/LandingPageLayout";
type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

const RootLayout = ({ children, params: { slug } }: RootLayoutProps) => {
  return <LandingPageLayout>{children}</LandingPageLayout>;
};

export default RootLayout;
