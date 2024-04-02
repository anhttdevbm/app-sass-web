"use client";

import { Button, Divider, Stack } from "@mui/material";
import { Endpoint, client } from "api";
import FixedLayout from "components/FixedLayout";
import { Text } from "components/shared";
import { ClientCompany } from "components/sn-client-companies/type";
import EditForm from "components/sn-sales-detail/components/Client/EditForm";
import SelectClient from "components/sn-sales-detail/components/Client/SelectClient";
import ViewDetail from "components/sn-sales-detail/components/Client/ViewDetail";
import { DEFAULT_PAGING, NS_COMPANY } from "constant/index";
import { Option } from "constant/types";
import EditIcon from "icons/EditIcon";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import LogoPlaceholderImage from "public/images/img-logo-placeholder.webp";
import { useEffect, useState } from "react";
import { updateClientBill } from "store/billing/actions";
import { useClientBill } from "store/billing/selectors";
import { useClientCompanies } from "store/company/selectors";

const TabClient = () => {
  const { id } = useParams();
  const {
    onGetClientCompanyDetails,
    detailItem,
    items,
    onGetClientCompanies,
    onUpdateClientCompany,
  } = useClientCompanies();

  const { onUpdateClientId } = useClientBill();

  const [isEditMode, setEditMode] = useState<boolean>(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [optionSelected, setOptionSelected] = useState<
    string | number | undefined
  >();
  const [clientSelected, setClientSelected] = useState<ClientCompany>();
  const companyT = useTranslations(NS_COMPANY);

  useEffect(() => {
    onGetClientCompanies({ ...DEFAULT_PAGING });
  }, [onGetClientCompanies]);

  useEffect(() => {
    const opts = (items as ClientCompany[]).map((item) => ({
      label: item.name,
      value: item.id || 0,
      avatar: (item?.avatar || LogoPlaceholderImage) as string,
      subText: `${companyT("clientCompany.taxCode")}: ${item.tax_code}`,
    }));
    setOptions(opts);
  }, [items, companyT]);

  useEffect(() => {
    if (!!options.length) {
      setOptionSelected(options[0]?.value);
    }
  }, [options, setOptionSelected]);

  useEffect(() => {
    if (optionSelected) {
      onGetClientCompanyDetails(optionSelected.toString());
    }
  }, [optionSelected, onGetClientCompanyDetails]);

  const onChangeClientCompany = (name, value) => {
    setClientSelected(items?.find((item) => item?.id === value));
    setOptionSelected(value);
  };

  const onUpdate = async (data: ClientCompany) => {
    const payload = { ...data };
    if (!Array.isArray(data?.avatar) && typeof data["avatar"] === "object") {
      const logoUrl = await client.upload(Endpoint.UPLOAD, data["avatar"]);
      payload.avatar = logoUrl;
    } else {
      delete payload["avatar"];
    }
    setEditMode(false);

    await onUpdateClientId(id.toString(), data?.id ?? "");
    return await onUpdateClientCompany(payload);
  };

  return (
    <FixedLayout flex={1} p="30px">
      <Stack sx={{ height: 58 }}>
        <Stack direction="row" spacing={2} justifyContent="space-between">
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
                size="extraSmall"
                sx={{
                  width: 32,
                  minWidth: 32,
                  maxWidth: 32,
                  paddingX: 0,
                  paddingY: 1,
                }}
                onClick={() => setEditMode(!isEditMode)}
              >
                <EditIcon
                  sx={{
                    width: 16,
                    height: 16,
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
      <Divider sx={{ borderColor: "grey.100", marginY: 3 }} />
      {isEditMode ? (
        <EditForm initialValues={detailItem} onSubmit={onUpdate} />
      ) : (
        <ViewDetail item={clientSelected || detailItem} />
      )}
    </FixedLayout>
  );
};

export default TabClient;
