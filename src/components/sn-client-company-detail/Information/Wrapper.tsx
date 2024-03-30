"use client";

import { memo, useEffect } from "react";
import { useClientCompanies } from "store/company/selectors";
import { useParams } from "next/navigation";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const { onGetClientCompanyDetails } = useClientCompanies();

  useEffect(() => {
    onGetClientCompanyDetails(id as string);
  }, [onGetClientCompanyDetails, id]);

  return children;
};

export default memo(Wrapper);
