"use client";

import { Button, Divider, Stack } from "@mui/material";
import { Endpoint, client } from "api";
import FixedLayout from "components/FixedLayout";
import { Text } from "components/shared";
import { ClientCompany, IAvatar } from "components/sn-client-companies/type";
import EditForm from "components/sn-sales-detail/components/Client/EditForm";
import SelectClient from "components/sn-sales-detail/components/Client/SelectClient";
import ViewDetail from "components/sn-sales-detail/components/Client/ViewDetail";
import {
  DEFAULT_PAGING,
  NS_COMMON,
  NS_COMPANY,
  NS_SALES,
} from "constant/index";
import { Option } from "constant/types";
import { useTranslations } from "next-intl";
import { useBudgetUpdate } from "queries/budgeting/budgeting-update";
import { useEffect, useState } from "react";
import { useClientCompanies } from "store/company/selectors";
import { useSnackbar } from "store/app/selectors";
import EditUnderlineIcon from "icons/EditUnderlineIcon";
import { TBudget } from "store/project/budget/action";

export const Client = (props: {
  bugetId: string;
  clientId?: string;
  update: (TBudget) => void;
}) => {
  const { bugetId, clientId, update } = props;
  const {
    onGetClientCompanyDetails,
    detailItem,
    items,
    onGetClientCompanies,
    onUpdateClientCompany,
  } = useClientCompanies();

  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [optionSelected, setOptionSelected] = useState<
    string | number | undefined
  >();
  const [clientSelected, setClientSelected] = useState<ClientCompany>();
  const [isUpdated, setUpdated] = useState<boolean>(false);
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);
  const saleT = useTranslations(NS_SALES);
  const budgetUpdate = useBudgetUpdate();

  useEffect(() => {
    onGetClientCompanies({ ...DEFAULT_PAGING, pageSize: 50 });
  }, [onGetClientCompanies]);

  useEffect(() => {
    const opts = (items as ClientCompany[]).map((item) => ({
      label: item.name,
      value: item.id || 0,
      avatar:
        Array.isArray(item?.avatar) && !!item?.avatar?.length
          ? (item?.avatar[0] as IAvatar)?.link
          : "",
      subText: `${companyT("clientCompany.taxCode")}: ${item.tax_code ?? "--"}`,
    }));
    setOptions(opts);
  }, [items, companyT]);

  useEffect(() => {
    if (isUpdated) return;
    if (clientId) {
      setOptionSelected(clientId);
    } else if (!!options.length) {
      setOptionSelected(options[0]?.value);
    }
  }, [options, setOptionSelected, clientId]);

  useEffect(() => {
    if (optionSelected) {
      onGetClientCompanyDetails(optionSelected.toString());
    }
  }, [optionSelected, onGetClientCompanyDetails]);

  const onChangeClientCompany = async (name, value) => {
    setClientSelected(items?.find((item) => item?.id === value));
    setOptionSelected(value);
    const { data } = await budgetUpdate.mutateAsync({
      id: bugetId,
      client: value,
    });
    update(data);
    onAddSnackbar(
      commonT("notification.success", {
        label: saleT("list.newDealForm.update"),
      }),
      "success",
    );
  };

  const onUpdate = async (data: ClientCompany) => {
    const payload = { ...data };
    if (data.files) {
      const logoUrl = await client.upload(Endpoint.UPLOAD, data?.files);
      payload.avatar = [logoUrl];
    } else {
      delete payload["files"];
    }
    setEditMode(false);
    setUpdated(true);
    return await onUpdateClientCompany(payload);
  };

  return (
    <FixedLayout
      flex={1}
      px={{ xs: "8px", sm: "24px", md: "24px" }}
      pb="24px"
      rounded="4px"
      borderRadius={1}
    >
      <Stack>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" alignItems="center">
            {isEditMode ? (
              <Stack sx={{ height: "100%" }}>
                <Text variant="h4">{detailItem?.name}</Text>
                <Text variant="h6" color="grey.400">
                  {companyT("clientCompany.taxCode")}: {detailItem?.tax_code}
                </Text>
              </Stack>
            ) : (
              <SelectClient
                options={options}
                name="clientId"
                hasAll={false}
                hasAvatar={true}
                value={optionSelected}
                onChange={(name, value) => onChangeClientCompany(name, value)}
              />
            )}
          </Stack>
          {!isEditMode && (
            <Stack>
              <Button
                variant="text"
                size="medium"
                sx={{
                  width: 32,
                  minWidth: 32,
                  maxWidth: 32,
                  maxHeight: 32,
                  minHeight: 32,
                  paddingX: 0,
                  paddingY: 1,
                }}
                onClick={() => setEditMode(!isEditMode)}
              >
                <EditUnderlineIcon
                  sx={{
                    width: 24,
                    height: 24,
                    padding: 0,
                    margin: "auto",
                    color: "#666666",
                  }}
                />
              </Button>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Divider
        sx={{
          borderColor: "grey.100",
          marginY: { xs: 1.5, sm: 1.5, md: 1.5, lg: 3 },
        }}
      />
      {isEditMode ? (
        <EditForm initialValues={detailItem} onSubmit={onUpdate} />
      ) : (
        <ViewDetail item={clientSelected || detailItem} />
      )}
    </FixedLayout>
  );
};
