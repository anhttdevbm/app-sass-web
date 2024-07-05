"use client";

import CompanyDetailLayout from "layouts/CompanyDetailLayout";

type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const RootLayout = ({ children, params: { id } }: RootLayoutProps) => {
  return <CompanyDetailLayout id={id}>{children}</CompanyDetailLayout>;
};

export default RootLayout;
