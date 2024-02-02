/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ExpenseStatus } from "constant/enums";


export type TBudgetExpenseAdd = {
  date: string | null;
  owner: string;
  service: string;
  budget: string | string[];
  qty: number;
  cost: number;
  currency: string;
  totalCost: number;
  markUp: number;
  billable: number;
  description: string;
  company: string;
  reimbursement: {
    reimbursement: string;
    reimbursementDate: string | null;
  };
  payment: {
    dueDate: string | null;
    paymentDate: string | null;
    vendor: string;
  };
  status: ExpenseStatus;
  attachment: any[];
};

export type TBudgetExpense = TBudgetExpenseAdd & { id: string };