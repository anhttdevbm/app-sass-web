/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  ButtonBase,
  Grow,
  MenuItem,
  MenuList,
  Popper,
  Stack,
  TableRow,
  Typography,
  popoverClasses,
} from "@mui/material";
import { Button, Checkbox, IconButton, Text } from "components/shared";
import { BadgeCustom } from "components/sn-budgeting/BadgeCustom";
import { BodyCell, CellProps } from "components/Table";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import PlusIcon from "icons/PlusIcon";
import UploadIcon from "icons/UploadIcon";
import _ from "lodash";
import moment from "moment";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  createRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";
import { budgetDetailRef } from "../BudgetDetail";
import FolderIcon from "icons/FolderIcon";
import { ModalExportExpense } from "./Modals/ModalExportExpense";
import {
  useBudgetDownloadFile,
  useBudgetExpenseDelete,
} from "queries/budgeting/expense";
import MoreDotIcon from "icons/MoreDotIcon";
import TrashIcon from "icons/TrashIcon";
import { TableLayoutWithScroll } from "components/Table/TableLayoutWithScroll";
import { HEADER_HEIGHT } from "layouts/Header";
import { formatNumber, getMessageErrorByAPI } from "utils/index";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import { useSnackbar } from "store/app/selectors";
import { TBudgetExpense } from "store/expense/actions";
import { useOnClickOutside } from "hooks/useOnClickOutside";
import fileDownload from "js-file-download";

interface Props {
  expenseList: TBudgetExpense[];
}

export const expenseRef = createRef();

export const Expenses = ({ expenseList = [] }: Props) => {
  const { onAddSnackbar } = useSnackbar();

  const [expenseSelected, setExpenseSelected] = useState<TBudgetExpense[]>([]);
  const [expenses, setExpenses] = useState<TBudgetExpense[]>([]);
  const [isOpenExportModal, setIsOpenExportModal] = useState<boolean>(false);
  const [isOpenConfirm, openConfirm, closeConfirm] = useToggle();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const commonT = useTranslations(NS_COMMON);
  const budgetT = useTranslations(NS_BUDGETING);

  const budgetExpenseDelete = useBudgetExpenseDelete();
  const budgetExpenseDownloadFile = useBudgetDownloadFile();

  useEffect(() => {
    if (!_.isEmpty(expenseList)) {
      setExpenses(expenseList);
    }
  }, [JSON.stringify(expenseList)]);

  useImperativeHandle(expenseRef, () => ({
    getSelectedExpense: () => {
      return _.first(expenseSelected);
    },
  }));

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
      setExpenseSelected(
        _.filter(expenseSelected, (item) => item.id !== expense.id),
      );
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
        minwidth: 56,
        width: 56,
      },
      {
        value: budgetT("tabExpenses.service"),
        align: "center",
        width: 220,
        minwidth: 220,
      },
      {
        value: budgetT("tabExpenses.description"),
        align: "center",
        width: 220,
        minwidth: 220,
      },
      {
        value: budgetT("tabExpenses.date"),
        align: "center",
        width: 160,
        minwidth: 160,
      },
      {
        value: budgetT("tabExpenses.att"),
        align: "center",
        width: 56,
        minwidth: 56,
      },
      {
        value: budgetT("tabExpenses.paymentStatus"),
        align: "center",
        width: 150,
        minwidth: 150,
      },
      {
        value: budgetT("tabExpenses.totalCost"),
        data: formatNumber(totalCost, {
          prefix: CURRENCY_SYMBOL.USD,
          numberOfFixed: 3,
        }),
        align: "center",
        width: 160,
        minwidth: 160,
      },
      {
        value: budgetT("tabExpenses.billable"),
        data: formatNumber(billable, {
          prefix: CURRENCY_SYMBOL.USD,
          numberOfFixed: 3,
        }),
        align: "center",
        width: 160,
        minwidth: 160,
      },
      { value: "", align: "center", width: "5%" },
    ];
  }, [expenseSelected, expenses]);

  const getSxCell = (index: number) => {
    return {
      width: headerList[index]?.width || "0px" + "!important",
      minWidth: headerList[index]?.minwidth || "0px" + "!important",
      maxWidth: headerList[index]?.width || "0px" + "!important",
    };
  };

  const handleDeleteExpense = () => {
    budgetExpenseDelete.mutateAsync(_.get(_.first(expenseSelected), "id", ""), {
      onSuccess: (res: any) => {
        onAddSnackbar("Delete expense successful!", "success");
        setExpenseSelected([]);
        budgetDetailRef.current?.budgetGetExpenseRefetch();
        closeConfirm();
      },
      onError: (error: any) => {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      },
    });
  };

  const handleDownloadAttFile = (data: TBudgetExpense) => {
    budgetExpenseDownloadFile.mutateAsync(
      [_.get(data, "attachment", "").toString()],
      {
        onSuccess: async (res: any) => {
          fileDownload(res.data, `export.pdf`);
        },
      },
    );
  };

  const refClickOutSide = useOnClickOutside(() => setAnchorEl(null));

  return (
    <Box ref={expenseRef}>
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
          <Button
            sx={{
              color:
                expenseSelected.length === 0 ? "GrayText" : "secondary.main",
            }}
            size="small"
            onClick={() => setIsOpenExportModal(true)}
            disabled={expenseSelected.length === 0}
          >
            <UploadIcon
              fontSize="medium"
              sx={{ transform: "rotate(180deg)" }}
            />
          </Button>
        </Stack>

        <TableLayoutWithScroll
          headerList={headerList}
          noData={false}
          titleColor="grey.300"
          containerHeaderProps={{
            sx: {
              maxHeight: { xs: 0, md: undefined },
              minHeight: { xs: 0, md: HEADER_HEIGHT },
            },
          }}
        >
          {expenses.map((data: any, index) => {
            const expenseSelectedIndex = _.findIndex(
              expenseSelected,
              (item) => item.id === data.id,
            );
            return (
              <TableRow key={`budget-expense-${index}`}>
                <BodyCell sx={getSxCell(0)}>
                  <Checkbox
                    checked={expenseSelectedIndex !== -1}
                    value={data.id}
                    onChange={(e, value) => handleSelectExpense(data, value)}
                  />
                </BodyCell>
                <BodyCell sx={getSxCell(1)}>
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
                <BodyCell sx={getSxCell(2)}>{data.description}</BodyCell>
                <BodyCell sx={getSxCell(3)}>
                  {data?.date ? moment(data.date).format("DD/MM/YYYY") : null}
                </BodyCell>
                <BodyCell sx={getSxCell(4)}>
                  {data?.attachment && (
                    <Button
                      onClick={() => {
                        handleDownloadAttFile(data);
                      }}
                      sx={{ p: "0px !important" }}
                    >
                      <FolderIcon />
                    </Button>
                  )}
                </BodyCell>
                <BodyCell sx={getSxCell(5)}>
                  <BadgeCustom color="success.main" text={data?.status} />
                </BodyCell>
                <BodyCell sx={getSxCell(6)}>
                  {formatNumber(_.get(data, "totalCost", 0), {
                    prefix: CURRENCY_SYMBOL[_.get(data, "currency", "USD")],
                    numberOfFixed: 2,
                  })}
                </BodyCell>
                <BodyCell sx={getSxCell(7)}>
                  {formatNumber(_.get(data, "billable", 0), {
                    prefix: CURRENCY_SYMBOL[_.get(data, "currency", "USD")],
                    numberOfFixed: 2,
                  })}
                </BodyCell>
                <BodyCell sx={{ p: 0 }}>
                  <IconButton
                    noPadding
                    onClick={(e) => {
                      if (Boolean(anchorEl)) {
                        setExpenseSelected([]);
                        setAnchorEl(null);
                      } else {
                        setExpenseSelected([data]);
                        setAnchorEl(e.currentTarget);
                      }
                    }}
                  >
                    <MoreDotIcon fontSize="medium" sx={{ color: "grey.300" }} />
                  </IconButton>
                </BodyCell>
              </TableRow>
            );
          })}
        </TableLayoutWithScroll>

        <Popper
          ref={refClickOutSide}
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          sx={{
            [`& .${popoverClasses.paper}`]: {
              backgroundImage: "white",
              minWidth: 150,
              maxWidth: 250,
            },
            zIndex: 1000,
          }}
          transition
          placement={"bottom-end"}
        >
          {({ TransitionProps }) => (
            <Grow {...TransitionProps} timeout={350}>
              <Stack
                py={2}
                sx={{
                  boxShadow: "2px 2px 24px rgba(0, 0, 0, 0.2)",
                  border: "1px solid",
                  borderTopWidth: 0,
                  borderColor: "grey.100",
                  borderRadius: 1,
                  bgcolor: "background.paper",
                }}
              >
                <MenuList component={Box} sx={{ py: 0 }}>
                  <MenuItem
                    onClick={() => openConfirm()}
                    component={ButtonBase}
                    sx={{ width: "100%", py: 1, px: 2 }}
                  >
                    <TrashIcon color="error" fontSize="medium" />
                    <Text ml={2} variant="body2" color="error.main">
                      {budgetT("tabTime.delete")}
                    </Text>
                  </MenuItem>
                </MenuList>
              </Stack>
            </Grow>
          )}
        </Popper>
      </Box>

      <ModalExportExpense
        open={isOpenExportModal}
        onClose={() => {
          setIsOpenExportModal(false);
        }}
        selectedExpenses={expenseSelected}
      />

      <ConfirmDialog
        open={isOpenConfirm}
        onClose={closeConfirm}
        onSubmit={handleDeleteExpense}
        title={budgetT("delete.titleConfirmDelete")}
        content={budgetT("delete.contentConfirmDelete")}
      />
    </Box>
  );
};
