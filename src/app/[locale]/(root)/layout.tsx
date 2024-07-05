import MainLayout from "layouts/MainLayout";

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = (props: RootLayoutProps) => {
  return <MainLayout>{props.children}</MainLayout>;
};

export default RootLayout;
