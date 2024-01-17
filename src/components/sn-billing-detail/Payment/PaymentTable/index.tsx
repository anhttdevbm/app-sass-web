import { Menu, MenuItem, Stack, TableRow } from "@mui/material";
import { BodyCell, CellProps, TableLayout } from "components/Table";
import { Button, IconButton, Text } from "components/shared";
import { NS_BILLING, NS_COMMON } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import TrashIcon from "icons/TrashIcon";
import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import { Bill, Billing, Budgets } from "store/billing/reducer";
import MobileContentCell from "./MobileContentCell";
import DesktopCells from "./DesktopCells";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MoreHoriz from "@mui/icons-material/MoreHoriz";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";

type IProps = {
  arrBudgets?: Budgets[];
  isEdit?: boolean;
  item?: Billing;
  handleOpen: () => void;
};

const ITEM_HEIGHT = 48;

const PaymentTable = (props: IProps) => {
  const { arrBudgets, isEdit, item, handleOpen } = props;

  const { isMdSmaller } = useBreakpoint();
  const commonT = useTranslations(NS_COMMON);
  const billingT = useTranslations(NS_BILLING);

  const options = [
    billingT("detail.form.payment.button.option.edit"),
    billingT("detail.form.payment.button.option.delete"),
  ];

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: `${billingT("detail.form.payment.table2.status")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.date")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.overdue")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.amount")}`,
        align: "left",
        width: "15%",
      },

      {
        value: `${billingT("detail.form.payment.table2.note")}`,
        align: "left",
        width: "15%",
      },
    ],
    [billingT],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: `${billingT("detail.form.payment.table2.status")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.date")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.overdue")}`,
        align: "left",
        width: "15%",
      },
      {
        value: `${billingT("detail.form.payment.table2.amount")}`,
        align: "left",
        width: "15%",
      },

      {
        value: `${billingT("detail.form.payment.table2.note")}`,
        align: "left",
        width: "15%",
      },
    ],
    [billingT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;
    return [
      ...additionalHeaderList,
      { value: "", width: "10%" },
    ] as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  const findBudget = arrBudgets?.filter((budget) =>
    item?.budget?.find((budget2) => budget2.id === budget.id),
  );
  return (
    <>
      <TableLayout
        headerList={headerList}
        // pending={isFetching}
        headerProps={{
          sx: { px: { xs: 0.5, md: 2 } },
        }}

        // error={error as string}
        // noData={!isIdle && totalItems === 0}
        // px={{ md: 3 }}
      >
        {/* {findBudget?.map((item, index) => { */}
        {/* //   const indexSelected = selectedList.findIndex(
          //     (selected) => selected?.id === item.id,
          //   ); */}
        {/* return ( */}
        <TableRow key={1}>
          {/* <BodyCell sx={{ pl: { xs: 0.5, md: 2 } }}>
            <Checkbox
              checked={indexSelected !== -1}
              onChange={onToggleSelect(item, indexSelected)}
            />
          </BodyCell> */}
          {isMdSmaller ? (
            <MobileContentCell />
          ) : (
            <DesktopCells
              // item={item}
              order={0}
            />
          )}
          <BodyCell align="left" sx={{ px: { xs: 0.5, md: 2 } }}>
            <IconButton
              aria-label="more"
              id="long-button"
              aria-controls={open ? "long-menu" : undefined}
              aria-expanded={open ? "true" : undefined}
              aria-haspopup="true"
              onClick={handleClick}
            >
              <MoreHoriz />
            </IconButton>
            <Menu
              id="long-menu"
              MenuListProps={{
                "aria-labelledby": "long-button",
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              PaperProps={{
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: "20ch",
                },
              }}
            >
              {options.map((option) => (
                <MenuItem
                  key={option}
                  selected={option === "Pyxis"}
                  onClick={handleClose}
                >
                  {option ===
                  billingT("detail.form.payment.button.option.edit") ? (
                    <Text variant={"body2"} onClick={() => handleOpen()}>
                      <Stack direction={"row"} alignItems={"center"} gap={2}>
                        <PencilUnderlineIcon /> {option}
                      </Stack>
                    </Text>
                  ) : option ===
                    billingT("detail.form.payment.button.option.delete") ? (
                    <Text variant={"body2"} color={"red"}>
                      <Stack direction={"row"} alignItems={"center"} gap={2}>
                        <TrashIcon /> {option}
                      </Stack>
                    </Text>
                  ) : (
                    ""
                  )}
                </MenuItem>
              ))}
            </Menu>
          </BodyCell>
        </TableRow>
        {/* ); */}
        {/* })} */}
      </TableLayout>
    </>
  );
};
export default memo(PaymentTable);
