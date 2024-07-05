"use client";

import BlogDetailLayout from "layouts/BlogDetailLayout";


type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const RootLayout = ({ children, params: { id } }: RootLayoutProps) => {
  return <BlogDetailLayout id={id}>{children}</BlogDetailLayout>;
};

export default RootLayout;
