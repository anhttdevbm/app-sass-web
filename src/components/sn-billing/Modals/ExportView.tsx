import { Box, Stack } from "@mui/material";
import React, { memo, useEffect, useState } from "react";
import FormLayout from "components/FormLayout";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { NS_BILLING, NS_COMMON, NS_SALES, SALE_API_URL } from "constant/index";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Select } from "components/shared";
import axios from "axios";
import { Endpoint, client } from "api";
import FileSaver from "file-saver";
import path from "path";
import { BILLING_EXPORT_PATH } from "constant/paths";
import { useRouter } from "next-intl/client";
import { Billing } from "store/billing/reducer";
import { getPath } from "utils/index";
import { useBillings } from "store/billing/selectors";
import { BillingDataExport } from "store/billing/actions";
import { useSnackbar } from "store/app/selectors";

// import useExportDeal from "../hooks/useExportDeal";

interface IProps {
  open: boolean;
  onClose(): void;
  item: BillingDataExport;
}

const salesFormTranslatePrefix = "list.modalExport";

const EXPORT_TYPE = [
  {
    label: "PDF",
    value: "PDF",
  },
  {
    label: "Csv",
    value: "csv",
  },
  {
    label: "Excel",
    value: "xlsx",
  },
];
const ORIENTATION = [
  {
    label: "Poitrait",
    value: "pdf_portrait",
  },
  {
    label: "Landscape",
    value: "pdf_landscape",
  },
];
const PAGE_SIZE = [
  {
    label: "A4",
    value: "A4",
  },
  {
    label: "A3",
    value: "A3",
  },
  {
    label: "Letter",
    value: "Letter",
  },
];

const ExportModal = ({ open, onClose, item }: IProps) => {
  //create form
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);
  const { push } = useRouter();
  const { fileExport, onExportBilling } = useBillings();
  const schema = yup.object().shape({
    type: yup.string(),
  });
  const { onAddSnackbar } = useSnackbar();

  const { handleSubmit, control, reset, getValues } = useForm({});

  const [selected, setSelected] = useState({
    document: "",
    orient: "",
    page: "",
  });

  const onSubmit = async () => {
    // return await exportDeal().then(() => {
    //   onClose();
    // });
    // if (selected.document && selected.document !== "") {
    //   push(BILLING_EXPORT_PATH);
    // }
    if (!selected.document || selected.document.length === 0) {
      onAddSnackbar("Bạn chưa chọn định dạng file!", "error");
      return;
    }
    if (selected && selected.document === "PDF") {
      const queries = { fileType: selected.orient, pageType: selected.page };
      onExportBilling(queries, item);
    } else {
      const queries = { fileType: selected.document };
      onExportBilling(queries, item);
    }
    onClose();
  };

  // useEffect(() => {
  //   if (fileExport) {
  //     push(getPath(BILLING_EXPORT_PATH, undefined));
  //   }
  // }, [fileExport]);

  return (
    <Box>
      <FormLayout
        sx={{
          minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
          maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
          minHeight: "auto",
        }}
        open={open}
        label={billingT(`${salesFormTranslatePrefix}.title`)}
        submitText={billingT(`${salesFormTranslatePrefix}.button.export`)}
        cancelText={commonT("form.cancel")}
        onClose={onClose}
        onSubmit={handleSubmit(onSubmit)}

        //   submitting={isFetching}
      >
        <Stack gap={2} direction="column" sx={{ mb: 4 }}>
          <Controller
            control={control}
            name="type"
            render={({ field, fieldState: { error } }) => (
              <Stack spacing={2}>
                <Select
                  options={EXPORT_TYPE}
                  fullWidth
                  error={error?.message}
                  {...field}
                  title={billingT(`${salesFormTranslatePrefix}.documentFormat`)}
                  value={selected.document}
                  onChange={(e) => {
                    setSelected({ ...selected, document: e.target.value });
                  }}
                />
                {selected.document === "PDF" && (
                  <>
                    <Select
                      options={ORIENTATION}
                      fullWidth
                      error={error?.message}
                      {...field}
                      title={billingT(
                        `${salesFormTranslatePrefix}.orientation`,
                      )}
                      value={selected.orient}
                      onChange={(e) => {
                        setSelected({ ...selected, orient: e.target.value });
                      }}
                    />
                    <Select
                      options={PAGE_SIZE}
                      fullWidth
                      error={error?.message}
                      {...field}
                      title={billingT(`${salesFormTranslatePrefix}.pageSize`)}
                      value={selected.page}
                      onChange={(e) => {
                        setSelected({ ...selected, page: e.target.value });
                      }}
                    />
                  </>
                )}
              </Stack>
            )}
          />
        </Stack>
      </FormLayout>
    </Box>
  );
};

export default memo(ExportModal);
function onAddSnackbar(arg0: any, arg1: string) {
  throw new Error("Function not implemented.");
}
