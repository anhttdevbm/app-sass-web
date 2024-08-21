"use client";

import TicketLayout from "layouts/TicketLayout";

type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const RootLayout = ({ children, params }: RootLayoutProps) => {
  return <TicketLayout>{children}</TicketLayout>;
};

export default RootLayout;
