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
} from "store/billing/selectors";
import { useEmployeeOptions, useEmployees } from "store/company/selectors";
import { useTagOptions } from "store/tags/selector";
import { User } from "constant/types";

const InformationBillingPage = () => {
  const { item, onGetBilling, updateStatus } = useBillings();
  const { tagsOptions } = useTagOptions();
  const { arrService, sumAmount, onGetServiceBudgets } = useServiceBudgets();
  const { budgets, onGetBudgets } = useBudgets();
  const { initQuery, isReady, query } = useQueryParams();
  const { options, onGetOptions } = useEmployeeOptions();
  // const { memberOptions } = useGetMemberOptions();
  const { user } = useAuth();

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
    onGetBilling(id.toString() ?? "");
  }, [onGetBilling, updateStatus]);

  useEffect(() => {
    onGetOptions({ pageIndex: 1, pageSize: 20 });
  }, []);

  return (
    // <FixedLayout
    // maxHeight={920}
    // maxWidth={{
    //   xs: 1120,
    //   xl: 1450,
    // }}
    // overflow={"auto"}
    // >
    <Stack>
      <TopContent
        tagsOptions={tagsOptions}
        item={item}
        user={userInfo}
        memberOptions={options}
      />

      <TabInfo item={item} user={userInfo} arrBudgets={budgets} />
    </Stack>
    // </FixedLayout>
  );
};
export default InformationBillingPage;
