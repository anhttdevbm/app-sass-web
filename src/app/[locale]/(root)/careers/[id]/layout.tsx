"use client";
import CareerDetaiLayout from "layouts/CareerDetaiLayout";
type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const RootLayout = ({ children, params: { id } }: RootLayoutProps) => {
  return <CareerDetaiLayout id={id}>{children}</CareerDetaiLayout>;
};

export default RootLayout;
