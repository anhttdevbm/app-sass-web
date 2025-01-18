import { Stack, TableRow } from "@mui/material";
import Avatar from "components/Avatar";
import Link from "components/Link";
import { Checkbox, Text } from "components/shared";
import { CURRENCY_SYMBOL } from "components/sn-sales/helpers";
import { BodyCell, CellProps } from "components/Table";
import { TableLayoutWithScroll } from "components/Table/TableLayoutWithScroll";
import { NS_PROJECT } from "constant/index";
import { BUDGET_DETAIL_PATH } from "constant/paths";
import { HEADER_HEIGHT } from "layouts/Header";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { TBudgets } from "store/project/budget/action";
import { formatNumber, getPath } from "utils/index";

type Props = {
  idSelecteds: string[];
  setIdSelected: (ids: string[]) => void;
  budgets: TBudgets;
};

export const ItemWithProject = ({
  idSelecteds,
  setIdSelected,
  budgets,
}: Props) => {
  const projectT = useTranslations(NS_PROJECT);

  const getXsCell = (index: number) => {
    return {
      width: desktopHeaderList[index].width + "!important",
      minWidth: desktopHeaderList[index].minwidth + "!important",
      maxWidth: desktopHeaderList[index].width + "!important",
    };
  };

  const desktopHeaderList: CellProps[] = useMemo(() => {
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
        value: projectT("budget.table.owner"),
        align: "center",
        width: "160px",
        minwidth: "160px",
        // data: "$109,000,567",
      },
      {
        value: projectT("budget.table.margin"),
        align: "center",
        // data: "69.04%",
        width: "100px",
        minwidth: "100px",
      },
      {
        value: projectT("budget.table.revenue"),
        align: "center",
        // data: "$109,000,567",
        width: "150px",
        minwidth: "150px",
      }
    ];
  }, [idSelecteds.length, budgets, projectT, setIdSelected]);

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
                  <Avatar src={budget?.created_by?.avatar} size={35} />
                  <Text paddingLeft="10px">{budget.name}</Text>
                </Link>
              )}
            </BodyCell>
            <BodyCell sx={getXsCell(2)}>
              <Stack direction="row" alignItems="center">
                <Avatar src={budget?.owner?.avatar} size={35} />
                <Text paddingLeft="10px" align="left">
                  {budget.owner.fullname}
                </Text>
              </Stack>
            </BodyCell>
            <BodyCell sx={getXsCell(3)}>
              <Text>
                {formatNumber(budget.totalMargin, {
                  prefix: CURRENCY_SYMBOL[_.get(budget, "currency", "USD")],
                  numberOfFixed: 0,
                })}
              </Text>
            </BodyCell>
            <BodyCell sx={getXsCell(3)}>
              <Text>
                {formatNumber(budget.totalRevenue, {
                  prefix: CURRENCY_SYMBOL[_.get(budget, "currency", "USD")],
                  numberOfFixed: 0,
                })}
              </Text>
            </BodyCell>

          </TableRow>
        );
      })}
    </TableLayoutWithScroll>
  );
};
