/* eslint-disable @typescript-eslint/no-explicit-any */
import { MenuList, Stack } from "@mui/material";
import FormLayout from "components/FormLayout";
import { Select } from "components/shared";
import { NS_BUDGETING } from "constant/index";
import { useTranslations } from "next-intl";
import { Controller, useForm } from "react-hook-form";
import InputLabelWrapper from "../InputLabelWrapper";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { DocumentFormat } from "constant/enums";
import _ from "lodash";
import { clearNullField, getPath } from "utils/index";
import { useRouter } from "next-intl/client";
import { BUDGET_EXPENSE_EXPORT_PATH } from "constant/paths";
import { TBudgetExpense } from "store/expense/actions";
import { useBudgetExpense } from "store/expense/selectors";
import { useParams } from "next/navigation";

interface Props {
  open: boolean;
  onClose: () => void;
  selectedExpenses: TBudgetExpense[];
}

export interface ExportFormData {
  format: string;
  orientation: string;
  pageSize: string;
  includeAttachments: string;
}

const defaultValues: ExportFormData = {
  format: DocumentFormat.PDF,
  orientation: "",
  pageSize: "",
  includeAttachments: "no",
};

export const ModalExportExpense = ({
  open,
  onClose,
  selectedExpenses,
}: Props) => {
  const budgetT = useTranslations(NS_BUDGETING);

  const { id } = useParams();

  const { onSetSelectedExpenses } = useBudgetExpense();

  const { push } = useRouter();

  const { control, handleSubmit, watch } = useForm<ExportFormData>({
    defaultValues: defaultValues,
    resolver: yupResolver(
      yup.object().shape({
        orientation: yup
          .string()
          .nullable()
          .test("invalid orientation", (value, { path, createError }) => {
            if (!value && watch("format") === DocumentFormat.PDF) {
              return createError({
                path,
                message: "Please select an orientation",
              });
            }

            return true;
          }),
        pageSize: yup
          .string()
          .nullable()
          .test("invalid pageSize", (value, { path, createError }) => {
            if (!value && watch("format") === DocumentFormat.PDF) {
              return createError({
                path,
                message: "Please select an page size",
              });
            }

            return true;
          }),
      }) as any,
    ),
  });

  const onSubmit = (data: ExportFormData) => {
    onSetSelectedExpenses(selectedExpenses);
    push(
      getPath(
        BUDGET_EXPENSE_EXPORT_PATH,
        clearNullField({ 
          format: _.toLower(_.get(data, 'format', '')),
          orientation: _.toLower(_.get(data, 'orientation', '')),
          includeAttachments: _.toLower(_.get(data, 'includeAttachments', 'no')),
          pagesize: _.get(data, 'pageSize', '') }),
        {
          id: id?.toString() || "",
        },
      ),
    );
  };

  return (
    <>
      <FormLayout
        label={budgetT("dialog.exportView")}
        pending={false}
        submitWhenEnter={false}
        open={open}
        onClose={onClose}
        cancelText={budgetT("dialog.cancelBtnText")}
        submitText={budgetT("dialog.exportBtnText")}
        onSubmit={handleSubmit(onSubmit)}
        maxWidth="xs"
      >
        <Stack overflow="auto">
          <MenuList component={Stack} spacing={2}>
            <InputLabelWrapper
              label={budgetT(`exportFile.format`)}
              sx={{ width: "100%" }}
            >
              <Controller
                control={control}
                name="format"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    autoComplete="off"
                    error={error?.message}
                    fullWidth
                    options={[
                      { label: "PDF", value: "pdf" },
                      { label: "CSV", value: "csv" },
                      { label: "XLSX", value: "xlsx" },
                    ]}
                    sx={{
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        backgroundColor: "transparent !important",
                        py: "12px",
                        borderColor: "#99999970 !important",
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </InputLabelWrapper>
            <InputLabelWrapper
              label={budgetT(`exportFile.orientation`)}
              sx={{ width: "100%" }}
            >
              <Controller
                control={control}
                name="orientation"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    autoComplete="off"
                    error={error?.message}
                    fullWidth
                    options={[
                      { label: "Portrait", value: "portrait" },
                      { label: "Landscape", value: "landscape" },
                    ]}
                    sx={{
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        backgroundColor: "transparent !important",
                        py: "12px",
                        borderColor: "#99999970 !important",
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </InputLabelWrapper>
            <InputLabelWrapper
              label={budgetT(`exportFile.pageSize`)}
              sx={{ width: "100%" }}
            >
              <Controller
                control={control}
                name="pageSize"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    autoComplete="off"
                    error={error?.message}
                    fullWidth
                    options={[
                      { label: "A4", value: "A4" },
                      { label: "A3", value: "A3" },
                      { label: "LETTER", value: "LETTER" },
                    ]}
                    sx={{
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        backgroundColor: "transparent !important",
                        py: "12px",
                        borderColor: "#99999970 !important",
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </InputLabelWrapper>
            <InputLabelWrapper
              label={budgetT(`exportFile.includeAttachments`)}
              sx={{ width: "100%" }}
            >
              <Controller
                control={control}
                name="includeAttachments"
                render={({ field, fieldState: { error } }) => (
                  <Select
                    autoComplete="off"
                    error={error?.message}
                    fullWidth
                    options={[
                      { label: "Yes", value: "yes" },
                      { label: "No", value: "no" },
                    ]}
                    sx={{
                      "& .MuiInputBase-root.MuiOutlinedInput-root": {
                        backgroundColor: "transparent !important",
                        py: "12px",
                        borderColor: "#99999970 !important",
                      },
                    }}
                    {...field}
                  />
                )}
              />
            </InputLabelWrapper>
          </MenuList>
        </Stack>
      </FormLayout>
    </>
  );
};
