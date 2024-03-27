"use client";

import { TableRow } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import Pagination from "components/Pagination";
import { ActionsCell, CellProps, TableLayout } from "components/Table";
import { DataAction } from "constant/enums";
import { DEFAULT_PAGING, NS_COMMON, NS_COMPANY } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useQueryParams from "hooks/useQueryParams";
import DuplicateIcon from "icons/DuplicateIcon";
import EditIcon from "icons/EditIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ClientCompanyData } from "store/company/actions";
import { ClientCompany } from "store/company/reducer";
import { useClientCompanies } from "store/company/selectors";
import { getPath } from "utils/index";
import { DesktopCells, MobileContentCell } from "./components";
import DeleteConfirm from "./components/DeleteConfirm";
import DuplicateForm from "./components/DuplicateForm";

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
    onGetClientCompanies,
    onDeleteClientCompany,
    onCreateClientCompany,
  } = useClientCompanies();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();
  const actionCellRef = useRef<HTMLDivElement>(null);

  const [item, setItem] = useState<ClientCompany | undefined>();
  const [selected, setSelected] = useState<ClientCompany | undefined>(
    undefined,
  );
  const [action, setAction] = useState<DataAction | undefined>();

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
        item && setSelected(item);
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

  const onDuplicateClientCompany = async (data: ClientCompanyData) => {
    if (!item) return;
    return await onCreateClientCompany(data);
  };

  const onSubmitDelete = async () => {
    try {
      if (selected?.id) {
        return await onDeleteClientCompany(selected?.id);
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!isReady) return;
    onGetClientCompanies({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetClientCompanies]);

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
                  ref={actionCellRef}
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

      {action === DataAction.OTHER && item && (
        <DuplicateForm
          open
          onClose={onResetAction}
          type={DataAction.UPDATE}
          initialValues={item}
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

      <DeleteConfirm
        open={action === DataAction.DELETE}
        onClose={onResetAction}
        title={companyT("clientCompany.confirmRemove.title")}
        content={companyT("clientCompany.confirmRemove.content")}
        item={selected}
        onSubmit={onSubmitDelete}
      />
    </>
  );
};

export default memo(ItemList);
