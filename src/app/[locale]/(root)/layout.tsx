import MainLayout from "layouts/MainLayout";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
});

type RootLayoutProps = {
  children: React.ReactNode;
};

const RootLayout = (props: RootLayoutProps) => {
  return (
    <main className={inter.className}>
      <MainLayout>{props.children}</MainLayout>;
    </main>
  );
};

export default RootLayout;
