"use client";

import { Text } from "components/shared";
import { useLayoutEffect } from "react";
import { useDocs } from "store/docs/selectors";
import { useAppSelector } from "store/hooks";

type RootLayoutProps = {
  children: React.ReactNode;
  params: {
    id: string;
  };
};

const RootLayout = ({ children, params: { id } }: RootLayoutProps) => {
  const { handleGetDocDetail } = useDocs();
  const isView = useAppSelector((data) => data.doc.perm);

  useLayoutEffect(() => {
    if (id) {
      handleGetDocDetail(id);
    }
  }, []);

  if (!isView) {
    return <Text>Không có quyền truy cập</Text>;
  }

  return children;
};

export default RootLayout;
