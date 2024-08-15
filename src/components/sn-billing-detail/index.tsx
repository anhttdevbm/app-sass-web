"use client";
import { Stack } from "@mui/material";
import { memo, use, useEffect, useMemo, useState } from "react";
import { TabInfo, TopContent } from "./components";

import FixedLayout from "components/FixedLayout";
import useQueryParams from "hooks/useQueryParams";
import { useParams } from "next/navigation";
import { useAuth } from "store/app/selectors";
import { Service } from "store/billing/reducer";
import {
  useBillings,
  useBudgets,
  useServiceBudgets,
  useTags,
} from "store/billing/selectors";
import { useEmployeeOptions, useEmployees } from "store/company/selectors";
import { useTagOptions } from "store/tags/selector";
import { User } from "constant/types";
import { useInvoices } from "store/invoice/selectors";

const InformationBillingPage = () => {
  const { item, onGetInvoiceDetail, onGetInvoices } = useInvoices();
  const { tagsOptions, onGetTags } = useTags();
  const { initQuery, isReady, query } = useQueryParams();
  const { user } = useAuth();

  const [openComment, setOpenComment] = useState(false);

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

  const [newServices, setNewServices] = useState<Service[]>([]);
  useEffect(() => {
    if (typeof id === "string" && id) {
      onGetInvoiceDetail(id);
    }
  }, [id]);

  return (
    <Stack
      padding={{ sm: 3 }}
      sx={{ overflowY: "auto" }}
      bgcolor={{ md: "background.default" }}
    >
      <TopContent
        tagsOptions={tagsOptions}
        // item={id ? item : duplicateBill}
        item={item}
        user={userInfo}
        handleDisplayComment={handleDisplayComment}
        // memberOptions={options}
      />

      <TabInfo
        // item={id ? item : duplicateBill}
        item={item}
        user={userInfo}
        handleDisplayComment={handleDisplayComment}
        openComment={openComment}

        // arrBudgets={budgets}
      />
    </Stack>
    // </FixedLayout>
  );
};
export default InformationBillingPage;
