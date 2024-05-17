"use client";

import AIAgentChatLayout from "layouts/AIAgentChatLayout";

type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const RootLayout = ({ children, params: { id } }: RootLayoutProps) => {
  return <AIAgentChatLayout id={id}>{children}</AIAgentChatLayout>;
};

export default RootLayout;
