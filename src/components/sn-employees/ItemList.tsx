"use client";
import {
  memo,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
} from "react";
import { Stack, TableRow } from "@mui/material";
import { usePathname, useRouter } from "next-intl/client";
import { useTranslations } from "next-intl";

import ConfirmDialog from "components/ConfirmDialog";
import {
  TableLayout,
  BodyCell,
  CellProps,
  ActionsCell,
} from "components/NewTable";
import Pagination from "components/NewPagination";
import { IconButton, Checkbox } from "components/shared";
import FixedLayout from "components/FixedLayout";
import { DEFAULT_PAGING, NS_COMMON, NS_COMPANY } from "constant/index";
import { DataAction, EmployeeType, PayStatus } from "constant/enums";
import { HEADER_HEIGHT } from "layouts/Header";
import useQueryParams from "hooks/useQueryParams";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import { getPath } from "utils/index";
import { useEmployees } from "store/company/selectors";
import { Employee } from "store/company/reducer";
import { EmployeeData } from "store/company/actions";
import EditUnderlineIcon from "icons/EditUnderlineAltIcon";
import TrashIcon from "icons/TrashAltIcon";
import EmployeeCompanyForm from "./EmployeeCompanyForm";
import { MobileContentCell, DesktopCells } from "./components";
import DeleteConfirm from "./components/DeleteConfirm";

const ItemList = ({ employeeType }: { employeeType: EmployeeType }) => {
  const {
    items,
    clientEmployees,
    isFetching,
    isIdle,
    error,
    totalItems,
    pageSize,
    pageIndex,
    totalPages,
    onGetEmployees,
    onUpdateEmployee: onUpdateEmployeeAction,
    onDeleteEmployees,
  } = useEmployees();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();
  const { isDarkMode } = useTheme();

  const [item, setItem] = useState<Employee | undefined>();
  const [selectedList, setSelectedList] = useState<Employee[]>([]);
  const [action, setAction] = useState<DataAction | undefined>();

  const employees = useMemo(
    () => { console.log(items); console.log(clientEmployees); return employeeType === EmployeeType.EMPLOYEE ? items : clientEmployees },
    [employeeType, items, clientEmployees],
  );

  const isCheckedAll = useMemo(
    () =>
      Boolean(selectedList.length && selectedList.length === employees.length),
    [selectedList.length, employees.length],
  );
  const onChangeAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        setSelectedList(employees);
      } else {
        setSelectedList([]);
      }
    },
    [employees],
  );

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: commonT("fullName"), width: "25%", align: "left" },
      { value: "Email", width: "15.5%", align: "left" },
      { value: commonT("position"), width: "12.5%", align: "left" },
      { value: commonT("creationDate"), width: "12.5%", align: "left" },
      {
        value: companyT("employees.expirationDate"),
        width: "13.5%",
        align: "left",
      },
      { value: commonT("status"), width: "12.5%" },
    ],
    [commonT, companyT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? MOBILE_HEADER_LIST
      : desktopHeaderList;

    return [
      {
        value: <Checkbox checked={isCheckedAll} onChange={onChangeAll} />,
        width: isMdSmaller ? "10%" : "3%",
      },
      ...additionalHeaderList,
      { value: "", width: isMdSmaller ? "20%" : "8%" },
    ] as CellProps[];
  }, [isMdSmaller, desktopHeaderList, isCheckedAll, onChangeAll]);

  const onToggleSelect = (item: Employee, indexSelected: number) => {
    return () => {
      if (indexSelected === -1) {
        setSelectedList((prevList) => [...prevList, item]);
      } else {
        setSelectedList((prevList) => {
          const newList = [...prevList];
          newList.splice(indexSelected, 1);
          return newList;
        });
      }
    };
  };

  const onActionToItem = (action: DataAction, item?: Employee) => {
    return () => {
      if (action === DataAction.DELETE) {
        item && setSelectedList([item]);
      } else {
        item && setItem(item);
      }
      setAction(action);
    };
  };

  const onResetAction = () => {
    setItem(undefined);
    setAction(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (queries: { [key: string]: any }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);
    push(path);

    onGetEmployees({ ...newQueries });
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  const onUpdateEmployee = async (data: EmployeeData) => {
    if (!item) return;
    return await onUpdateEmployeeAction(item.id, data.position);
  };

  const onPay = () => {
    setAction(DataAction.OTHER);
  };
  const onDelete = () => {
    setAction(DataAction.DELETE);
  };

  const onSubmitDelete = async () => {
    const ids = selectedList.map((item) => item.id);
    try {
      const idsResponse = await onDeleteEmployees(ids);
      if (idsResponse.length) {
        setAction(undefined);
        setSelectedList([]);
        // setId(undefined);
      }
      return idsResponse;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!isReady) return;
    onGetEmployees({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetEmployees]);

  useEffect(() => {
    setSelectedList([]);
  }, [pageIndex]);

  return (
    <>
      <FixedLayout>
        <Stack
          direction="row"
          alignItems="center"
          pb={0.25}
          border="1px solid"
          borderColor="grey.100"
          borderBottom="none"
          sx={{
            "& > *": {
              "--custom-border": "1px solid hsla(0, 0%, 59%, 70%)",
              "--custom-border-radius": "8px",
              px: 1,
              border: 0,
              borderTop: "var(--custom-border)",
              borderRight: "var(--custom-border)",
              borderBottom: "var(--custom-border)",
            },
            "& > *:first-of-type": {
              borderLeft: "var(--custom-border)",
              borderTopLeftRadius: "var(--custom-border-radius)",
              borderBottomLeftRadius: "var(--custom-border-radius)",
            },
            "& > *:last-of-type": {
              borderTopRightRadius: "var(--custom-border-radius)",
              borderBottomRightRadius: "var(--custom-border-radius)",
            },
          }}
          px={{ xs: 0.75, md: 1.125 }}
          py={1.125}
          mx={{ xs: 0, md: 3 }}
        >
          {isMdSmaller && (
            <Checkbox
              checked={isCheckedAll}
              onChange={onChangeAll}
              sx={{ mr: "auto" }}
            />
          )}
          <IconButton
            size="small"
            // onClick={onPay}
            sx={{
              color: "#1A1A1A",
            }}
            tooltip={companyT(
              selectedList.length ? "employees.pay" : "employees.isNeedSelect",
            )}
            disabled={!selectedList.length}
          >
            <EditUnderlineIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            onClick={onDelete}
            sx={{
              color: "#FF4141",
            }}
            tooltip={
              selectedList.length
                ? commonT("delete")
                : companyT("employees.isNeedSelect")
            }
            disabled={!selectedList.length}
          >
            <TrashIcon fontSize="small" />
          </IconButton>
        </Stack>
        <TableLayout
          headerList={headerList}
          pending={isFetching}
          error={error as string}
          noData={!isIdle && totalItems === 0}
          px={{ xs: 0, md: 3 }}
          containerHeaderProps={{
            sx: {
              maxHeight: { xs: 0, md: undefined },
              minHeight: { xs: 0, md: HEADER_HEIGHT },
            },
          }}
          sx={{ bgcolor: { xs: "grey.50", md: "transparent" } }}
        >
          {employees.map((item) => {
            const indexSelected = selectedList.findIndex(
              (selected) => selected.id === item.id,
            );
            return (
              <TableRow key={item.id}>
                <BodyCell sx={{ pl: { xs: 0.5, md: 2 } }}>
                  <Checkbox
                    checked={indexSelected !== -1}
                    onChange={onToggleSelect(item, indexSelected)}
                  />
                </BodyCell>
                {isMdSmaller ? (
                  <MobileContentCell item={item} />
                ) : (
                  <DesktopCells item={item} />
                )}

                <ActionsCell
                  sx={{
                    pl: { xs: 0.5, md: 0 },
                    verticalAlign: { xs: "top", md: "middle" },
                    pt: { xs: 2, md: 0 },
                  }}
                  iconProps={{
                    sx: {
                      p: { xs: "4px!important", lg: 1 },
                    },
                  }}
                  onEdit={onActionToItem(DataAction.UPDATE, item)}
                  onDelete={onActionToItem(DataAction.DELETE, item)}
                  hasPopup={false}
                  options={
                    item.status === PayStatus.WAITING
                      ? [
                          {
                            content: companyT("employees.pay"),
                            onClick: onActionToItem(DataAction.OTHER, item),
                            icon: (
                              <EditUnderlineIcon
                                sx={{ color: "grey.400" }}
                                fontSize="medium"
                              />
                            ),
                          },
                        ]
                      : undefined
                  }
                />
              </TableRow>
            );
          })}
        </TableLayout>

        <Pagination
          totalItems={totalItems}
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>

      {action === DataAction.OTHER && (
        <ConfirmDialog
          open
          onClose={onResetAction}
          title={companyT("employees.confirmPayment.title")}
          content={companyT("employees.confirmPayment.content", { count: 1 })}
        />
      )}
      {action === DataAction.UPDATE && (
        <EmployeeCompanyForm
          open
          onClose={onResetAction}
          type={DataAction.UPDATE}
          initialValues={
            {
              email: item?.email,
              position: item?.position?.id,
            } as EmployeeData
          }
          onSubmit={onUpdateEmployee}
        />
      )}

      <DeleteConfirm
        open={action === DataAction.DELETE}
        onClose={onResetAction}
        title={companyT("employees.confirmRemove.title")}
        content={companyT("employees.confirmRemove.content", {
          count: selectedList.length,
        })}
        items={selectedList}
        onSubmit={onSubmitDelete}
      />
    </>
  );
};

export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "#", width: "70%", align: "left" }];
