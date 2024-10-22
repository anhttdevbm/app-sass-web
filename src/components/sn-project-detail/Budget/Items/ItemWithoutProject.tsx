/* eslint-disable @typescript-eslint/no-explicit-any */
import { Stack, TableRow } from "@mui/material";
import Avatar from "components/Avatar";
import Link from "components/Link";
import { Checkbox, Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { BodyCell, CellProps } from "components/Table";
import { TableLayoutWithScroll } from "components/Table/TableLayoutWithScroll";
import { DATE_FORMAT_FORM, NS_PROJECT } from "constant/index";
import { BUDGET_DETAIL_PATH } from "constant/paths";
import { HEADER_HEIGHT } from "layouts/Header";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useSnackbar } from "store/app/selectors";
import { TBudgetCreateParam, TBudgets } from "store/project/budget/action";
import { useBudgets } from "store/project/budget/selector";
import { formatDate, formatNumber, getPath } from "utils/index";
import ActionsCell from "./ActionsCell";
import FilterWithIds from "./FilterWithIds";

type Props = {
  idSelecteds: string[];
  setIdSelected: (ids: string[]) => void;
  budgets: TBudgets;
};

export const ItemWithoutProject = ({
  idSelecteds,
  setIdSelected,
  budgets,
}: Props) => {
  const projectT = useTranslations(NS_PROJECT);
  const projectBudget = useBudgets();
  const { onAddSnackbar } = useSnackbar();

  const handleDuplicate = async (budgetId: string) => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return;

    const param: TBudgetCreateParam = {
      project_id: budget.project.id,
      start_date: formatDate(budget.start_date, DATE_FORMAT_FORM),
      end_date: formatDate(budget.end_date, DATE_FORMAT_FORM),
      owner: budget.owner.id,
      name: budget.name
    } as TBudgetCreateParam;

    try {
      await projectBudget.create(param);
      onAddSnackbar(projectT("budget.duplicateBudgetSuccess"), "success");
      await projectBudget.get();
    } catch (error) {
      onAddSnackbar("budget.duplicateBudgetFailed", "error");
    }
  };

  const handleDelete = async (budgetId: string) => {
    try {
      await projectBudget.delete(budgetId);
      onAddSnackbar(projectT("budget.deleteBudgetSuccess"), "success");
      setIdSelected(idSelecteds.filter(id => id !== budgetId));
      await projectBudget.get();
    } catch (error) {
      onAddSnackbar("budget.deleteBudgetFailed", "error");
    }
  };

  const getXsCell = (index: number) => {
    return {
      width: desktopHeaderList[index]?.width || "0px" + "!important",
      minWidth: desktopHeaderList[index]?.minwidth || "0px" + "!important",
      maxWidth: desktopHeaderList[index]?.width || "0px" + "!important",
    } as any;
  };

  const desktopHeaderList: CellProps[] = useMemo(() => {
    const _totalRevenue = budgets.reduce(
      (prev, curr) => prev + curr.revenue,
      0,
    );

    return [
      {
        value: (
          <Checkbox
            sx={{
              "&.Mui-checked": {
                color: "#0575E6",
              },
            }}
            checked={idSelecteds.length === budgets.length}
            onChange={() => {
              if (idSelecteds.length === budgets.length) {
                setIdSelected([]);
                return;
              }
              const ids = budgets.map((budget) => budget.id);
              setIdSelected(ids);
            }}
          />
        ),
        align: "center",
        minwidth: "56px",
        width: "56px",
      },
      {
        value: projectT("budget.table.budget"),
        align: "left",
        width: "220px",
        minwidth: "220px",
      },
      {
        value: projectT("budget.table.company"),
        align: "left",
        width: "220px",
        minwidth: "220px",
      },
      {
        value: projectT("budget.table.project"),
        align: "left",
        width: "220px",
        minwidth: "220px",
      },
      {
        value: projectT("budget.table.revenue"),
        align: "center",
        width: "160px",
        minwidth: "160px",
        data: formatNumber(_totalRevenue, {
          prefix: CURRENCY_SYMBOL["USD"],
          numberOfFixed: 0,
        }),
        color: "green",
      },
      { value: "", width: "15%", align: "center" },
    ];
  }, [budgets, idSelecteds.length, projectT, setIdSelected]);

  const selectBudget = (id: string) => {
    const indexExist = idSelecteds.findIndex((idBudget) => idBudget === id);
    if (indexExist === -1) {
      idSelecteds.push(id);
    } else {
      delete idSelecteds[indexExist];
    }
    setIdSelected(idSelecteds.filter(Boolean));
  };

  return (
    <TableLayoutWithScroll
      headerList={desktopHeaderList}
      noData={false}
      titleColor="grey.300"
      containerHeaderProps={{
        sx: {
          maxHeight: { xs: 0, md: undefined },
          minHeight: { xs: 0, md: HEADER_HEIGHT },
        },
      }}
    >
      {!!idSelecteds.length && (
        <FilterWithIds
          getXsCell={(index: number) => ({
            width: "100%",
            minWidth: "100%",
            maxWidth: "100%",
          })}
          budgets={budgets}
          idSelecteds={idSelecteds}
        />
      )}
      {budgets?.map((budget) => {
        return (
          <TableRow key={budget.id}>
            <BodyCell sx={{ pl: { xs: 0.5, md: 2 }, ...getXsCell(0) }}>
              <Checkbox
                sx={{
                  "&.Mui-checked": {
                    color: "#0575E6",
                  },
                }}
                checked={idSelecteds.indexOf(budget.id) !== -1}
                onChange={() => {
                  selectBudget(budget.id);
                }}
              />
            </BodyCell>
            <BodyCell sx={getXsCell(1)}>
              {budget.created_by && typeof budget.created_by === "object" && (
                <Link
                  href={getPath(BUDGET_DETAIL_PATH, undefined, {
                    id: budget.id as string,
                  })}
                  underline="none"
                  sx={{
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    fontSize: 14,
                    "&:hover *": {
                      color: "primary.main",
                    },
                  }}
                >
                  <Avatar src={budget?.created_by?.avatar?.link} size={35} />
                  <Text paddingLeft="10px" align="left">
                    {budget.name}
                  </Text>
                </Link>
              )}
            </BodyCell>
            <BodyCell sx={getXsCell(2)}>
              <Stack direction="row" alignItems="center">
                <Avatar src={budget?.created_by?.avatar?.link} size={35} />
                <Text paddingLeft="10px" align="left">
                  {budget.company}
                </Text>
              </Stack>
            </BodyCell>
            <BodyCell sx={getXsCell(2)}>
              {budget.project?.avatar &&
                typeof budget.project.avatar[0] === "object" && (
                  <Stack direction="row" alignItems="center">
                    <Avatar src={budget.project.avatar[0].link} size={35} />
                    <Text paddingLeft="10px" align="left">
                      {budget.project.name}
                    </Text>
                  </Stack>
                )}
            </BodyCell>
            <BodyCell sx={getXsCell(3)}>
              <Text>
                {formatNumber(_.get(budget, "revenue"), {
                  prefix: CURRENCY_SYMBOL[_.get(budget, "currency", "USD")],
                  numberOfFixed: 0,
                })}
              </Text>
            </BodyCell>
            <ActionsCell
              onDuplicate={() => handleDuplicate(budget.id)}
              onDelete={() => handleDelete(budget.id)}
            />
          </TableRow>
        );
      })}
    </TableLayoutWithScroll>
  );
};
