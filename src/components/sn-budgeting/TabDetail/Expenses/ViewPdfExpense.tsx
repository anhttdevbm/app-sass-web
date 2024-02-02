/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Button, Text } from "components/shared";
import ArrowExport from "icons/ArrowExport";
import DownloadIcon from "icons/DownloadIcon";
import { memo, useCallback, useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import FixedLayout from "components/FixedLayout";
import { BUDGET_EXPENSE_EXPORT_PATH } from "constant/paths";
import { formatNumber, getMessageErrorByAPI, getPath } from "utils/index";
import { useBudgetExpenseExport } from "queries/budgeting/expense";
import { useBudgetExpense } from "store/expense/selectors";
import { useTranslations } from "next-intl";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import _ from "lodash";
import { ExportFormData } from "../Modals/ModalExportExpense";
import fileDownload from "js-file-download";
import { useAuth, useSnackbar } from "store/app/selectors";
import moment from "moment";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";

const ViewPdfExpense = () => {
  const { onAddSnackbar } = useSnackbar();

  const budgetT = useTranslations(NS_BUDGETING);
  const commonT = useTranslations(NS_COMMON);

  const { id } = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const { selectedExpenses } = useBudgetExpense();
  const budgetExpenseExport = useBudgetExpenseExport();

  const queryParams = useMemo(() => {
    return {
      format: searchParams.get("format"),
      orientation: searchParams.get("orientation"),
      pageSize: searchParams.get("pagesize"),
      includeAttachments: searchParams.get("includeAttachments"),
    };
  }, [searchParams]);

  const openNewTab = () => {
    window.open(
      getPath(
        BUDGET_EXPENSE_EXPORT_PATH,
        { ...queryParams, pagesize: queryParams.pageSize },
        {
          id: id?.toString() ?? "",
        },
      ),
    );
  };

  const downloadFile = () => {
    budgetExpenseExport
      .mutateAsync({
        expenseId: _.get(_.first(selectedExpenses), "id", ""),
        documentData: queryParams as ExportFormData,
      })
      .then((res: any) => {
        fileDownload(res.data, `export.${_.get(queryParams, "format", "")}`);
      })
      .catch((err) => {
        onAddSnackbar(getMessageErrorByAPI(err, commonT), "error");
      });
  };

  const totalCost = useMemo(() => {
    return _.reduceRight(
      selectedExpenses || [],
      (total, expense) => (total += expense.totalCost),
      0,
    );
  }, [selectedExpenses]);

  const totalBillable = useMemo(() => {
    return _.reduceRight(
      selectedExpenses || [],
      (total, expense) => (total += expense.billable),
      0,
    );
  }, [selectedExpenses]);

  return (
    <FixedLayout
      maxWidth={{
        xs: 1120,
        xl: 1450,
      }}
    >
      <Stack
        direction={"row"}
        gap={2}
        justifyContent={"end"}
        p={2}
        borderBottom={"1px solid #ECECF3"}
      >
        <Button
          variant="secondary"
          startIcon={<ArrowExport />}
          onClick={() => openNewTab()}
        >
          {budgetT("expenseExport.openNewTab")}
        </Button>
        <Button
          variant="secondary"
          startIcon={<DownloadIcon />}
          onClick={() => {
            downloadFile();
          }}
        >
          {budgetT("expenseExport.download")}
        </Button>
      </Stack>
      <Stack style={{ background: "#898989" }}>
        <Stack gap={2} p={2} padding={8} alignItems={"center"}>
          <div
            style={{
              fontSize: 20,
              fontWeight: 600,
              width: "68%",
              background: "#fff",
              zIndex: 1,
              padding: 24,
              marginBottom: "12px",
              marginTop: "12px",
            }}
          >
            <Grid container spacing={2}>
              <Grid md={12} p={2}>
                <Text variant="h3" color="GrayText">{`${budgetT(
                  "expenseExport.title",
                )} (${selectedExpenses?.length || 0})`}</Text>
              </Grid>
              <Grid container md={12} p={2}>
                <Grid md={6}>
                  <Stack direction="row" alignItems="center">
                    <Text sx={{ color: "#92a2be", mr: 6 }}>
                      {budgetT("expenseExport.totalCost")}
                    </Text>
                    <Text sx={{ display: "inline-block" }}>
                      {formatNumber(totalCost, {
                        prefix: CURRENCY_SYMBOL.USD,
                        numberOfFixed: 2,
                      })}
                    </Text>
                  </Stack>
                </Grid>

                <Grid md={6}>
                  <Stack direction="row" alignItems="center">
                    <Text sx={{ color: "#92a2be", mr: 4 }}>
                      {budgetT("expenseExport.generatedAt")}
                    </Text>
                    <Text>
                      {_.get(_.first(selectedExpenses), "payment.dueDate")
                        ? moment(
                            _.get(_.first(selectedExpenses), "payment.dueDate"),
                          ).format("D MMM YYYY")
                        : ""}
                    </Text>
                  </Stack>
                </Grid>

                <Grid md={6}>
                  <Stack direction="row" alignItems="center">
                    <Text sx={{ color: "#92a2be", mr: 3 }}>
                      {budgetT("expenseExport.totalBillable")}
                    </Text>
                    <Text>
                      {formatNumber(totalBillable, {
                        prefix: CURRENCY_SYMBOL.USD,
                        numberOfFixed: 2,
                      })}
                    </Text>
                  </Stack>
                </Grid>

                <Grid md={6}>
                  <Stack direction="row" alignItems="center">
                    <Text sx={{ color: "#92a2be", mr: 4 }}>
                      {budgetT("expenseExport.generatedBy")}
                    </Text>
                    <Text sx={{ fontWeight: 700 }}>
                      {_.get(user, "fullname", "")}
                    </Text>
                  </Stack>
                </Grid>
              </Grid>
              <Grid md={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          {budgetT("expenseExport.service")}
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          {budgetT("expenseExport.description")}
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          {budgetT("expenseExport.date")}
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          {budgetT("expenseExport.paymentStatus")}
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          {budgetT("expenseExport.att")}
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          {budgetT("expenseExport.cost")}
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          {budgetT("expenseExport.billable")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {_.map(selectedExpenses || [], (item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell sx={{ textAlign: "center" }}>
                              {_.get(item, "service.name", "")}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {_.get(item, "service.desc", "")}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {_.get(item, "date")
                                ? moment(_.get(item, "date")).format(
                                    "D MMM YYYY",
                                  )
                                : ""}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {_.capitalize(_.get(item, "status", ""))}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {item?.attachment ? (
                                <Typography>Att.</Typography>
                              ) : (
                                ""
                              )}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {_.get(item, "cost", "")}
                            </TableCell>
                            <TableCell sx={{ textAlign: "center" }}>
                              {_.get(item, "billable", "")}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Stack>
    </FixedLayout>
  );
};

export default memo(ViewPdfExpense);
