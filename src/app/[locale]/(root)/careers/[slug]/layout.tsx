"use client";
import CareerDetaiLayout from "layouts/CareerDetaiLayout";
type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    slug: string;
  };
};

const RootLayout = ({ children, params: { slug } }: RootLayoutProps) => {
  return <CareerDetaiLayout slug={slug}>{children}</CareerDetaiLayout>;
};

export default RootLayout;
