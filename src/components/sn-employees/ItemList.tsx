"use client";
import { Stack, TableRow } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import ConfirmDialog from "components/ConfirmDialog";
import FixedLayout from "components/FixedLayout";
import Pagination from "components/NewPagination";
import {
  ActionsCell,
  BodyCell,
  CellProps,
  TableLayout,
} from "components/NewTable";
import { Checkbox, IconButton } from "components/shared";
import { DataAction, EmployeeType, PayStatus, Permission } from "constant/enums";
import { DEFAULT_PAGING, NS_COMMON, NS_COMPANY } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useQueryParams from "hooks/useQueryParams";
// import useTheme from "hooks/useTheme";
import EditUnderlineIcon from "icons/EditUnderlineAltIcon";
import TrashIcon from "icons/TrashAltIcon";
import { useAuth } from "store/app/selectors";
import { Employee } from "store/company/reducer";
import { useEmployees } from "store/company/selectors";
import { getPath } from "utils/index";
import EmployeeCompanyForm from "./EmployeeCompanyForm";
import { DesktopCells, MobileContentCell } from "./components";
import DeleteConfirm from "./components/DeleteConfirm";

const ItemList = ({ employeeType }: { employeeType: EmployeeType }) => {
  const {
    items: employees,
    isFetching,
    isIdle,
    error,
    totalItems,
    pageSize,
    pageIndex,
    totalPages,
    onGetEmployees,
    onUpdateEmployee,
    onDeleteEmployees,
  } = useEmployees();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { isMdSmaller } = useBreakpoint();
  // const { isDarkMode } = useTheme();

  const [item, setItem] = useState<Employee | undefined>();
  const [selectedList, setSelectedList] = useState<Employee[]>([]);
  const [action, setAction] = useState<DataAction | undefined>();
  const { user } = useAuth();

  // const employees = useMemo(
  //   () => (employeeType === EmployeeType.EMPLOYEE ? items : clientEmployees),
  //   [employeeType, items, clientEmployees],
  // );

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
      { value: commonT("fullName"), width: "20%", align: "left" },
      { value: "Email", width: "15%", align: "left" },
      { value: commonT("roles"), width: "10.5%", align: "left" },
      { value: commonT("position"), width: "12%", align: "left" },
      { value: commonT("creationDate"), width: "12%", align: "left" },
      {
        value: companyT("employees.expirationDate"),
        width: "13%",
        align: "left",
      },
      { value: commonT("status"), width: "17%" },
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
    const newQueries = {
      typeEmployee: employeeType.toString(),
      ...query,
      ...queries,
    };
    const path = getPath(pathname, newQueries);
    window.history.pushState(
      { ...window.history.state, as: path, url: path },
      "",
      path,
    );

    onGetEmployees({ ...newQueries });
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  // const onUpdateEmployee = async (data: EmployeeData) => {
  //   if (!item) return;
  //   return await onUpdateEmployeeAction(item.id, data.position);
  // };

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
    onGetEmployees({
      ...DEFAULT_PAGING,
      typeEmployee: employeeType.toString(),
      ...initQuery,
    });
  }, [employeeType, initQuery, isReady, onGetEmployees]);

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
          // border="1px solid"
          // borderColor="grey.100"
          // borderBottom="none"
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
              // sx={{ mr: "auto" }}
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
          // headerList={headerList}
          // pending={isFetching}
          // error={error as string}
          // noData={!isIdle && totalItems === 0}
          // px={{ xs: 0, md: 3 }}
          // containerHeaderProps={{
          //   sx: {
          //     maxHeight: { xs: 0, md: undefined },
          //     minHeight: { xs: 0, md: HEADER_HEIGHT },
          //   },
          // }}
          // sx={{ bgcolor: { xs: "grey.50", md: "transparent" } }}
          headerList={headerList}
          pending={isFetching}
          error={error as string}
          noData={!isIdle && totalItems === 0}
          // mt={3}
          // px={{ xs: 0, md: 3 }}
          headerProps={{
            sx: {
              px: { xs: 0.5, md: 2 },
              wordBreak: "break-all",
              overflow: "auto",
              // py: "2px",
              // height:"50px",
              verticalAlign: "middle",
              background: "#D9F0FD",
              color: "#999999",
              h6:{fontSize:"13px"}
            }
          }}
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

                {(user?.roles.includes(Permission.AM) || user?.roles.includes(Permission.MN)) && (
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
                      item.status === PayStatus.PENDING
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
                )}
                
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
      {item && action === DataAction.UPDATE && (
        <EmployeeCompanyForm
          open
          onClose={onResetAction}
          type={DataAction.UPDATE}
          typeEmployee={employeeType}
          initialValues={{
            id: item.id,
            email: item.email,
            client: item.client_company,
            position: item.position?.id ?? "",
            permission: item.roles[0],
            roles: item.roles,
          }}
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
