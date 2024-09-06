"use client";
import { Stack } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { TabInfo, TopContent } from "./components";

import { User } from "constant/types";
import { useParams } from "next/navigation";
import { useAuth, useHeaderConfig } from "store/app/selectors";
import { Service } from "store/billing/reducer";
import { useTags } from "store/billing/selectors";
import { useInvoices } from "store/invoice/selectors";
import { Endpoint } from "api";
const InformationBillingPage = () => {
  const { item, onGetInvoiceDetail, onGetInvoices } = useInvoices();
  const { tagsOptions, onGetTags } = useTags();
  const { user } = useAuth();

  const [openComment, setOpenComment] = useState(false);
  const { onUpdateHeaderConfig } = useHeaderConfig();

  useEffect(() => {
    onUpdateHeaderConfig({
      title: "Invoice Detail",
      prevPath: Endpoint.INVOICE,
    });
    return () => {
      onUpdateHeaderConfig({
        title: undefined,
        searchPlaceholder: undefined,
        prevPath: undefined,
        endpoint: undefined,
        key: undefined,
      });
    };
  }, [onUpdateHeaderConfig]);
  const handleDisplayComment = (value: boolean) => {
    setOpenComment(value);
  };

  const userInfo = useMemo(() => {
    const dataUser = {
      email: user?.email,
      id: user?.id,
      fullname: user?.fullname,
      avatar: user?.avatar,
      roles: user?.roles,
      company: user?.company,
      phone: user?.phone,
      taxCode: user?.taxCode,
      address: user?.address,
      country: user?.country,
    } as User;
    return dataUser;
  }, [user]);

  const { id } = useParams();

  useEffect(() => {
    if (typeof id === "string" && id) {
      onGetInvoiceDetail(id);
    }
  }, [id]);

  return (
    <Stack
      padding={{ sm: 3 }}
      // sx={{ overflowY: "auto" }}
      bgcolor={{ md: "background.default" }}
    >
      <TopContent
        tagsOptions={tagsOptions}
        item={item}
        user={userInfo}
        handleDisplayComment={handleDisplayComment}
      />

      <TabInfo
        item={item}
        user={userInfo}
        handleDisplayComment={handleDisplayComment}
        openComment={openComment}
      />
    </Stack>
  );
};
export default InformationBillingPage;
