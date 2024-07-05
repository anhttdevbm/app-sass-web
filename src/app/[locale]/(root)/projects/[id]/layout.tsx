"use client";

import ProjectDetailLayout from "layouts/ProjectDetailLayout";

type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const RootLayout = ({ children, params: { id } }: RootLayoutProps) => {
  return <ProjectDetailLayout id={id}>{children}</ProjectDetailLayout>;
};

export default RootLayout;
