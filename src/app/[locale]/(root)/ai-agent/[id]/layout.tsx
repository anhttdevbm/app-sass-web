"use client";

import AIAgentDetailLayout from "layouts/AIAgentDetailLayout";

type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const RootLayout = ({ children, params: { id } }: RootLayoutProps) => {
  return <AIAgentDetailLayout id={id}>{children}</AIAgentDetailLayout>;
};

export default RootLayout;
