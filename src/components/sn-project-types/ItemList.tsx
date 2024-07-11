"use client";

import { TableRow } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import Pagination from "components/Pagination";
import { ActionsCell, CellProps, TableLayout } from "components/Table";
import { DataAction } from "constant/enums";
import { DEFAULT_PAGING, NS_COMMON, NS_COMPANY } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useQueryParams from "hooks/useQueryParams";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import { memo, useEffect, useMemo, useState } from "react";
import { ProjectTypeData } from "store/company/actions";
import { ProjectType } from "store/company/reducer";
import { useProjectTypes } from "store/company/selectors";
import { getDataFromKeys, getPath } from "utils/index";
import DesktopCells from "./DesktopCells";
import Form from "./Form";
import MobileContentCell from "./MobileContentCell";

const ItemList = () => {
  const {
    items,
    isFetching,
    isIdle,
    error,
    pageIndex,
    pageSize,
    totalItems,
    totalPages,
    onGetProjectTypes,
    onUpdateProjectType,
    onDeleteProjectType,
  } = useProjectTypes();

  const pathname = usePathname();
  const { push } = useRouter();
  const { initQuery, isReady, query } = useQueryParams();
  const { isMdSmaller } = useBreakpoint();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);

  const [item, setItem] = useState<ProjectType | undefined>();
  const [action, setAction] = useState<DataAction | undefined>();

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: "#", width: "10%", align: "center" },
      {
        value: commonT("name"),
        width: "30%",
        align: "left",
      },
      {
        value: commonT("creator"),
        width: "30%",
        align: "left",
      },
      { value: commonT("creationDate"), width: "20%" },
    ],
    [commonT],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: commonT("name"),
        width: "30%",
        align: "left",
      },
      {
        value: commonT("creator"),
        width: "30%",
        align: "left",
      },
      { value: commonT("creationDate"), width: "20%" },
    ],
    [commonT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;

    return [
      ...additionalHeaderList,
      { value: "", width: isMdSmaller ? "20%" : "10%" },
    ] as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  const onActionToItem = (action: DataAction, item?: ProjectType) => {
    return () => {
      item && setItem(item);
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

    onGetProjectTypes(newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  const onUpdate = async (data: ProjectTypeData) => {
    if (!item) return;
    return await onUpdateProjectType(item.id, data.name);
  };

  const onDelete = (id: string) => {
    return async () => {
      return await onDeleteProjectType(id);
    };
  };

  useEffect(() => {
    if (!isReady) return;
    onGetProjectTypes({ ...DEFAULT_PAGING, ...initQuery });
  }, [isReady, onGetProjectTypes, initQuery]);

  return (
    <>
      <FixedLayout>
        <TableLayout
          headerList={headerList}
          pending={isFetching}
          error={error as string}
          noData={!isIdle && items.length === 0}
          px={{ xs: 0, md: 3 }}
          // headerProps={{
          //   sx: { px: { xs: 0.5, md: 2 }, wordBreak: "break-all" },
          // }}
          headerProps={{
            sx: {
              // px: { xs: 2, md: 2 },
              overflow: "auto",
              py: "2px",
              height:"50px",
              verticalAlign: "middle",
              background: "#D9F0FD",
              color: "#999999",
              h6:{fontSize:"13px"}
            }
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
                  sx={{ pl: { xs: 0.5, md: 2 } }}
                  onEdit={onActionToItem(DataAction.UPDATE, item)}
                  onDelete={onDelete(item.id)}
                  iconProps={{
                    sx: {
                      p: { xs: "4px!important", md: 1 },
                    },
                  }}
                />
              </TableRow>
            );
          })}
        </TableLayout>

        <Pagination
          sx={{
            ".MuiPaginationItem-page.Mui-selected": {
              background: "#14B9E5!important",
              borderColor: "transparent",
              color: "white",
              borderRadius: "12px",
            },
            ".MuiPaginationItem-previousNext": {
              background: "#D9F0FD!important",
              borderColor: "transparent",
              color: "black",
              borderRadius: "12px",
            },
            ".MuiPaginationItem-page": {
              background: "#D9F0FD!important",
              borderColor: "transparent",
              color: "black",
              borderRadius: "12px",
            },
            
          }}
          totalItems={totalItems}
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>

      {action === DataAction.UPDATE && (
        <Form
          open
          onClose={onResetAction}
          type={DataAction.UPDATE}
          initialValues={getDataFromKeys(item, ["name"]) as ProjectTypeData}
          onSubmit={onUpdate}
        />
      )}
    </>
  );
};

export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "#", width: "75%", align: "left" }];
