import { Stack } from "@mui/material";
import React, { memo } from "react";
import FormLayout from "components/FormLayout";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { NS_COMMON, NS_SALES, SALE_API_URL } from "constant/index";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Select } from "components/shared";
import {
  CURRENCY_SYMBOL,
  EXPORT_ORIENTATION_OPTIONS,
  EXPORT_PAGE_SIZE_OPTIONS,
  EXPORT_TYPE_OPTIONS,
} from "../helpers";
import axios from "axios";
import { Endpoint, client } from "api";
import FileSaver from "file-saver";
import useExportDeal, { useGetExportOption } from "../hooks/useExportDeal";

interface IProps {
  open: boolean;
  onClose(): void;
}

const salesFormTranslatePrefix = "list.exportView";

const ExportModal = ({ open, onClose }: IProps) => {
  //create form
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);

  const {
    EXPORT_TYPE,
    ORIENTATION_TYPE,
    INCLUDE_ATTACHMENT_TYPE,
    PAGE_SIZE_TYPE,
  } = useGetExportOption();

  const { exportDeal, isFetching } = useExportDeal();
  const schema = yup.object().shape({
    type: yup.string(),
    orientation: yup.string(),
    pageSize: yup.string(),
    includeAttachment: yup.string(),
  });

  const { handleSubmit, control, reset, getValues, watch } = useForm({
    defaultValues: {
      type: EXPORT_TYPE_OPTIONS.XLSX,
      orientation: EXPORT_ORIENTATION_OPTIONS.PORTRAIT,
      pageSize: EXPORT_PAGE_SIZE_OPTIONS.A4,
      includeAttachment: "yes",
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = async () => {
    await exportDeal({
      format: getValues("type"),
      orientation: getValues("orientation"),
      pageSize: getValues("pageSize"),
    }).then(() => {
      onClose();
    });
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      open={open}
      label={salesT(`${salesFormTranslatePrefix}.title`)}
      submitText={salesT(`list.action.export`)}
      cancelText={commonT("form.cancel")}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
      submitting={isFetching}
    >
      <Stack gap={2} direction="column" sx={{ mb: 4 }}>
        <Controller
          control={control}
          name="type"
          render={({ field, fieldState: { error } }) => (
            <Select
              options={EXPORT_TYPE}
              fullWidth
              error={error?.message}
              {...field}
              title={salesT(`${salesFormTranslatePrefix}.documentFormat`)}
            />
          )}
        />
        {watch("type") === EXPORT_TYPE_OPTIONS.PDF && (
          <>
            <Controller
              control={control}
              name="orientation"
              render={({ field, fieldState: { error } }) => (
                <Select
                  options={ORIENTATION_TYPE}
                  fullWidth
                  error={error?.message}
                  {...field}
                  title={salesT(`${salesFormTranslatePrefix}.orientation`)}
                />
              )}
            />
            <Controller
              control={control}
              name="pageSize"
              render={({ field, fieldState: { error } }) => (
                <Select
                  options={PAGE_SIZE_TYPE}
                  fullWidth
                  error={error?.message}
                  {...field}
                  title={salesT(`${salesFormTranslatePrefix}.pagesize`)}
                />
              )}
            />
          </>
        )}
      </Stack>
    </FormLayout>
  );
};

export default memo(ExportModal);
