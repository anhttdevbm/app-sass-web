"use client";

import { memo, useEffect } from "react";
import { useMyCompany } from "store/company/selectors";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { onGetCompany } = useMyCompany();

  useEffect(() => {
    onGetCompany();
  }, [onGetCompany]);

  return children;
};

export default memo(Wrapper);
