"use client";

import { Stack, TableRow } from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import FixedLayout from "components/FixedLayout";
import Pagination from "components/Pagination";
import { ActionsCell, CellProps, TableLayout } from "components/Table";
import { Checkbox, IconButton } from "components/shared";
import { DataAction, PayStatus } from "constant/enums";
import { DEFAULT_PAGING, NS_COMMON, NS_COMPANY } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useQueryParams from "hooks/useQueryParams";
import useTheme from "hooks/useTheme";
import EditIcon from "icons/EditIcon";
import DuplicateIcon from "icons/DuplicateIcon";
import DeleteDocs from "icons/DeleteDocs";

import TrashIcon from "icons/TrashIcon";
import { HEADER_HEIGHT } from "layouts/Header";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { EmployeeData, ClientCompanyData } from "store/company/actions";
import { ClientCompany } from "store/company/reducer";
import { useClientCompanies } from "store/company/selectors";
import { getPath } from "utils/index";
import CreateForm from "./components/CreateForm";
import DuplicateForm from "./components/DuplicateForm";
import { DesktopCells, MobileContentCell } from "./components";
import DeleteConfirm from "./components/DeleteConfirm";

const ItemList = () => {
  const {
    items,
    isFetching,
    isIdle,
    error,
    totalItems,
    pageSize,
    pageIndex,
    totalPages,
    onGetClientCompanies
  } = useClientCompanies();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();
  const { isDarkMode } = useTheme();

  const [item, setItem] = useState<ClientCompany | undefined>();
  const [selectedList, setSelectedList] = useState<ClientCompany[]>([]);
  const [action, setAction] = useState<DataAction | undefined>();

  const isCheckedAll = useMemo(
    () => Boolean(selectedList.length && selectedList.length === items.length),
    [selectedList.length, items.length],
  );
  const onChangeAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        setSelectedList(items);
      } else {
        setSelectedList([]);
      }
    },
    [items],
  );

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: "No", width: "5%", align: "center" },
      {
        value: commonT("name"),
        width: "25%",
        align: "left",
        sort: true,
      },
      {
        value: companyT("clientCompany.createBy"),
        width: "25%",
        align: "left",
        sort: true,
      },
      {
        value: companyT("clientCompany.createDate"),
        width: "25%",
        align: "center",
        sort: true,
      },
    ],
    [commonT, companyT],
  );

  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: commonT("name"),
        width: "25%",
        align: "left",
      },
      {
        value: commonT("creator"),
        width: "35%",
        align: "left",
      },
      { value: commonT("creationDate"), width: "25%" },
    ],
    [commonT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;

    return [
      ...additionalHeaderList,
      { value: "", width: isMdSmaller ? "20%" : "8%" },
    ] as CellProps[];
  }, [isMdSmaller, mobileHeaderList, desktopHeaderList]);

  const onActionToItem = (action: DataAction, item?: ClientCompany) => {
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
  const onChangeQueries = (queries: { [key: string]: number }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);
    push(path);

    onGetClientCompanies({ ...newQueries });
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  const onUpdateEmployee = async (data: EmployeeData) => {
    // if (!item) return;
    // return await onUpdateEmployeeAction(item.id, data.position);
  };

  const onDuplicateClientCompany = async (data: ClientCompanyData) => {
    // if (!item) return;
    // return await onUpdateEmployeeAction(item.id, data.position);
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
      // const idsResponse = await onDeleteEmployees(ids);
      // if (idsResponse.length) {
      //   setAction(undefined);
      //   setSelectedList([]);
      //   // setId(undefined);
      // }
      // return idsResponse;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!isReady) return;
    onGetClientCompanies({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetClientCompanies]);

  useEffect(() => {
    setSelectedList([]);
  }, [pageIndex]);

  return (
    <>
      <FixedLayout>
        <TableLayout
          headerList={headerList}
          pending={isFetching}
          error={error as string}
          noData={!isIdle && items.length === 0}
          px={{ xs: 0, md: 3 }}
          headerProps={{
            sx: { px: { xs: 0.5, md: 2 }, wordBreak: "break-all" },
          }}
        >
          {items.map((item, index) => {
            return (
              <TableRow key={item.id}>
                {isMdSmaller ? (
                  <MobileContentCell item={item} />
                ) : (
                  <DesktopCells
                    item={item}
                    order={(pageIndex - 1) * pageSize + (index + 1)}
                  />
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
                  options={[
                    {
                      content: commonT("edit"),
                      onClick: onActionToItem(DataAction.UPDATE, item),
                      icon: (
                        <EditIcon
                          sx={{ color: "grey.400" }}
                          fontSize="medium"
                        />
                      ),
                    },
                    {
                      content: companyT("clientCompany.duplicate"),
                      onClick: onActionToItem(DataAction.OTHER, item),
                      icon: (
                        <DuplicateIcon
                          sx={{ color: "grey.400" }}
                          fontSize="medium"
                        />
                      ),
                    },
                  ]}
                  onDelete={onActionToItem(DataAction.DELETE, item)}
                  hasPopup={false}
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
        <DuplicateForm
          open
          onClose={onResetAction}
          type={DataAction.UPDATE}
          initialValues={
            {
             address: item?.address
            } as ClientCompanyData
          }
          onSubmit={onDuplicateClientCompany}
        />
      )}

      {/* {action === DataAction.UPDATE && (
        <CreateForm
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
      )} */}

      {/*<DeleteConfirm*/}
      {/*  open={action === DataAction.DELETE}*/}
      {/*  onClose={onResetAction}*/}
      {/*  title={companyT("employees.confirmRemove.title")}*/}
      {/*  content={companyT("employees.confirmRemove.content", {*/}
      {/*    count: selectedList.length,*/}
      {/*  })}*/}
      {/*  items={selectedList}*/}
      {/*  onSubmit={onSubmitDelete}*/}
      {/*/>*/}
    </>
  );
};

export default memo(ItemList);
