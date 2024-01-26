/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, TableRow, Typography } from "@mui/material";
import { Button, Checkbox } from "components/shared";
import { BadgeCustom } from "components/sn-budgeting/BadgeCustom";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { NS_BUDGETING } from "constant/index";
import PlusIcon from "icons/PlusIcon";
import UploadIcon from "icons/UploadIcon";
import _ from "lodash";
import moment from "moment";
import { useTranslations } from "next-intl";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { budgetDetailRef } from "../BudgetDetail";
import FolderIcon from "icons/FolderIcon";
import { ModalExportExpense } from "./Modals/ModalExportExpense";
import { TBudgetExpense } from "queries/budgeting/expense";
import { useRouter } from "next-intl/client";

interface Props {
  expenseList: TBudgetExpense[];
}

export const Expenses = ({ expenseList = [] }: Props) => {
  const [expenseSelected, setExpenseSelected] = useState<TBudgetExpense[]>([]);
  const [expenses, setExpenses] = useState<TBudgetExpense[]>([]);
  const [isOpenExportModal, setIsOpenExportModal] = useState<boolean>(false);

  const budgetT = useTranslations(NS_BUDGETING);

  const { push } = useRouter();

  useEffect(() => {
    if (!_.isEmpty(expenseList)) {
      setExpenses(expenseList);
    }
  }, [JSON.stringify(expenseList)]);

  const handleSelectAllExpense = (
    event: ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
  ) => {
    if (!isChecked) {
      setExpenseSelected([]);
      return;
    }

    setExpenseSelected(expenses);
  };

  const handleSelectExpense = (expense: TBudgetExpense, isChecked: boolean) => {
    const selected = _.find(expenseSelected, (item) => item.id === expense.id);

    if (isChecked && _.isEmpty(selected)) {
      setExpenseSelected(_.concat(expenseSelected, [expense]));
    }

    if (!isChecked && !_.isEmpty(selected)) {
      setExpenseSelected(_.filter(expenseSelected, (item) => item.id !== expense.id));
    }
  };

  const headerList = useMemo((): CellProps[] => {
    const totalCost = _.reduce(
      expenses || [],
      (total, expense) => total + Number(expense.totalCost || 0),
      0,
    );
    const billable = _.reduce(
      expenses || [],
      (total, expense) => total + Number(expense.billable || 0),
      0,
    );
    return [
      {
        value: (
          <Checkbox
            checked={expenseSelected.length === expenses.length}
            onChange={handleSelectAllExpense}
          />
        ),
        align: "center",
        width: "5%",
      },
      { value: budgetT("tabExpenses.service"), align: "center", width: "15%" },
      {
        value: budgetT("tabExpenses.description"),
        align: "center",
        width: "20%",
      },
      { value: budgetT("tabExpenses.date"), align: "center", width: "10%" },
      { value: budgetT("tabExpenses.att"), align: "center", width: "10%" },
      {
        value: budgetT("tabExpenses.paymentStatus"),
        align: "center",
        width: "15%",
      },
      {
        value: budgetT("tabExpenses.totalCost"),
        data: `$${totalCost}`,
        align: "center",
        width: "15%",
      },
      {
        value: budgetT("tabExpenses.billable"),
        data: `$${billable}`,
        align: "center",
        width: "10%",
      },
    ];
  }, [expenseSelected, expenses]);

  return (
    <>
      <Box
        px="15px"
        sx={{
          mb: 2,
          overflow: {
            xs: "auto",
          },
        }}
      >
        <Stack direction="row" justifyContent="space-between" py="7px">
          <Button
            sx={{ color: "secondary.main" }}
            startIcon={<PlusIcon />}
            size="small"
          >
            Add Filter
          </Button>
          <Button sx={{ color: "secondary.main" }} size="small">
            <UploadIcon
              fontSize="medium"
              sx={{ transform: "rotate(180deg)" }}
            />
          </Button>
        </Stack>
        <TableLayout
          headerList={headerList}
          noData={false}
          titleColor="grey.300"
        >
          {expenses.map((data: any, index) => {
            const expenseSelectedIndex = _.findIndex(expenseSelected, (item) => item.id === data.id);
            return (
              <TableRow key={`budget-expense-${index}`}>
                <BodyCell>
                  <Checkbox
                    checked={expenseSelectedIndex !== -1}
                    value={data.id}
                    onChange={(e, value) => handleSelectExpense(data, value)}
                  />
                </BodyCell>
                <BodyCell>
                  <Typography
                    sx={{ fontWeight: 700, cursor: "pointer" }}
                    onClick={() => {
                      budgetDetailRef.current?.setSelectedExpense(data);
                      budgetDetailRef.current?.openModalExpense();
                    }}
                  >
                    {_.get(data, "service.name", "")}
                  </Typography>
                </BodyCell>
                <BodyCell>{data.description}</BodyCell>
                <BodyCell>
                  {data?.date ? moment(data.date).format("DD/MM/YYYY") : null}
                </BodyCell>
                <BodyCell>
                  <Button
                    onClick={() => {
                      setExpenseSelected([data]);
                      // push(getPath(BUDGET_EXPENSE_EXPORT_PATH, clearNullField(data), { id: _.get(data, 'id') || "" }));
                      // setIsOpenExportModal(true);
                    }}
                  >
                    <FolderIcon />
                  </Button>
                </BodyCell>
                <BodyCell>
                  <BadgeCustom color="success.main" text={data.status} />
                </BodyCell>
                <BodyCell>{data.totalCost}</BodyCell>
                <BodyCell>{data.billable}</BodyCell>
              </TableRow>
            );
          })}
        </TableLayout>
      </Box>

      <ModalExportExpense
        open={isOpenExportModal}
        onClose={() => {
          setIsOpenExportModal(false);
        }}
        selectedExpenses={expenseSelected}
      />
    </>
  );
};
