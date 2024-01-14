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
import { useParams } from "next/navigation";
import { useBudgetGetExpenseQuery } from "queries/budgeting/expense";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

export type TExpense = {
  id: string;
  owner: string;
  service: string;
  description: string;
  date: string;
  attachment: any[];
  status: string;
  totalCost: string;
  billable: string;
};

export const Expenses = () => {
  const [expenseSelected, setExpenseSelected] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<TExpense[]>([]);
  const { id } = useParams();

  const budgetT = useTranslations(NS_BUDGETING);

  const budgetGetExpenseQuery = useBudgetGetExpenseQuery(String(id));

  useEffect(() => {
    if (!_.isEmpty(budgetGetExpenseQuery)) {
      setExpenses(_.get(budgetGetExpenseQuery, "data.data.docs", []));
    }
  }, [JSON.stringify(budgetGetExpenseQuery)]);

  const handleSelectAllExpense = (
    event: ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
  ) => {
    if (!isChecked) {
      setExpenseSelected([]);
      return;
    }
    const allExpenseIds = expenses.map((expense) => expense.id);
    setExpenseSelected(allExpenseIds);
  };

  const handleSelectExpense = (
    event: ChangeEvent<HTMLInputElement>,
    isChecked: boolean,
  ) => {
    const id = String(event.target.value);

    const indexIdInExpenseSelected = expenseSelected.findIndex(
      (expenseId) => expenseId === id,
    );

    if (isChecked) {
      if (indexIdInExpenseSelected === -1) {
        expenseSelected.push(id);
      }
    } else {
      delete expenseSelected[indexIdInExpenseSelected];
    }

    setExpenseSelected(expenseSelected.filter(Boolean));
  };

  const headerList = useMemo((): CellProps[] => {
    return [
      {
        value: (
          <Checkbox
            checked={expenseSelected.length === expenses.length}
            onChange={handleSelectAllExpense}
          />
        ),
        align: "center",
        width: "3%",
      },
      { value: budgetT("tabExpenses.service"), align: "center" },
      { value: budgetT("tabExpenses.description"), align: "center" },
      { value: budgetT("tabExpenses.date"), align: "center" },
      { value: budgetT("tabExpenses.att"), align: "center" },
      {
        value: budgetT("tabExpenses.paymentStatus"),
        align: "center",
      },
      {
        value: budgetT("tabExpenses.totalCost"),
        data: "$56.000.000",
        align: "center",
      },
      {
        value: budgetT("tabExpenses.billable"),
        data: "$56.000.000",
        align: "center",
      },
    ];
  }, [expenseSelected, expenses]);

  return (
    <Box px="15px">
      <Stack direction="row" justifyContent="space-between" py="7px">
        <Button
          sx={{ color: "secondary.main" }}
          startIcon={<PlusIcon />}
          size="small"
        >
          Add Filter
        </Button>
        <Button sx={{ color: "secondary.main" }} size="small">
          <UploadIcon fontSize="medium" sx={{ transform: "rotate(180deg)" }} />
        </Button>
      </Stack>
      <TableLayout headerList={headerList} noData={false} titleColor="grey.300">
        {expenses.map((data: any, index) => {
          const indexIdInExpenseSelected = expenseSelected.findIndex(
            (expenseId) => expenseId === data.id,
          );
          return (
            <TableRow key={`budget-expense-${index}`}>
              <BodyCell>
                <Checkbox
                  checked={indexIdInExpenseSelected !== -1}
                  value={data.id}
                  onChange={handleSelectExpense}
                />
              </BodyCell>
              <BodyCell>
                <b>{_.get(data, 'service.name', '')}</b>
              </BodyCell>
              <BodyCell>{data.description}</BodyCell>
              <BodyCell>{data?.date ? moment(data.date).format('DD/MM/YYYY') : null}</BodyCell>
              <BodyCell>
                {_.map(_.get(data, 'attachment', []), (att, attIndex) => (
                  <>
                    <Typography key={attIndex}>{att}</Typography>
                  </>
                ))}
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
  );
};
