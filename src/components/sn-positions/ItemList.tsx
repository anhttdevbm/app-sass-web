"use client";

import { memo, useEffect, useMemo, useState } from "react";
import { TableRow } from "@mui/material";
import { TableLayout, CellProps, ActionsCell } from "components/Table";
import useQueryParams from "hooks/useQueryParams";
import { usePathname, useRouter } from "next-intl/client";
import useBreakpoint from "hooks/useBreakpoint";
import { DataAction } from "constant/enums";
import MobileContentCell from "./MobileContentCell";
import DesktopCells from "./DesktopCells";
import { Position } from "store/company/reducer";
import { usePositions } from "store/company/selectors";
import { PositionData } from "store/company/actions";
import Form from "./Form";
import { getDataFromKeys, getPath } from "utils/index";
import { DEFAULT_PAGING, NS_COMMON, NS_COMPANY } from "constant/index";
import Pagination from "components/Pagination";
import { useTranslations } from "next-intl";
import { useAuth } from "store/app/selectors";
import FixedLayout from "components/FixedLayout";

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
    onGetPositions,
    onUpdatePosition,
    onDeletePosition,
  } = usePositions();
  const commonT = useTranslations(NS_COMMON);
  const companyT = useTranslations(NS_COMPANY);

  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();
  const { onGetProfile, user } = useAuth();

  const pathname = usePathname();
  const { initQuery, isReady, query } = useQueryParams();

  const [item, setItem] = useState<Position | undefined>();
  const [action, setAction] = useState<DataAction | undefined>();

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: "#", width: "5%", align: "center" },
      {
        value: commonT("name"),
        width: "20%",
        align: "left",
        sort: true
      },
      {
        value: commonT("creator"),
        width: "25%",
        align: "left",
        sort: true
      },
        
      { value: commonT("creationDate"), width: "20%", align: "center",  sort: true  },
      { value: companyT("positions.numberOfEmployees"), align: "center", width: "20%", sort: true },
      { value: "", width: "5%" },
    ],
    [commonT, companyT],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: commonT("name"),
        width: "20%",
        align: "left",
      },
      {
        value: commonT("creator"),
        width: "25%",
        align: "left",
      },
      { value: commonT("creationDate"), width: "18%" },
      { value: companyT("positions.numberOfEmployees"), width: "22%" },
    ],
    [commonT, companyT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;

    return [
      ...additionalHeaderList,
      // { value: "", width: isMdSmaller ? "15%" : "10%" },
    ] as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  const onActionToItem = (action: DataAction, item?: Position) => {
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
    onGetPositions(newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  const onUpdate = async (data: PositionData) => {
    if (!item) return;
    const result = await onUpdatePosition(item.id, data.name);
    if (result && item.id === user?.position?.id) {
      onGetProfile();
    }
    return result;
  };

  const onDelete = (id: string) => {
    return async () => {
      return await onDeletePosition(id);
    };
  };

  useEffect(() => {
    if (!isReady) return;
    onGetPositions({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetPositions]);

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
                  onEdit={onActionToItem(DataAction.UPDATE, item)}
                  onDelete={onDelete(item.id)}
                  sx={{ px: { xs: 0.5, md: 2 } }}
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
          initialValues={getDataFromKeys(item, ["name"]) as PositionData}
          onSubmit={onUpdate}
        />
      )}
    </>
  );
};

export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "#", width: "75%", align: "left" }];
