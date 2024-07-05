"use client";

import { memo, useEffect, useMemo } from "react";
import { TableRow } from "@mui/material";
import { TableLayout, CellProps } from "components/Table";
import { useMembersOfProject } from "store/project/selectors";
import { DEFAULT_PAGING, NS_COMMON, NS_PROJECT } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import Pagination from "components/Pagination";
import { usePathname, useRouter } from "next-intl/client";
import { getPath } from "utils/index";
import useBreakpoint from "hooks/useBreakpoint";
import MobileContentCell from "./MobileContentCell";
import DesktopCells from "./DesktopCells";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import FixedLayout from "components/FixedLayout";
import { HEADER_HEIGHT } from "layouts/Header";

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
    id,
    onGetMembersOfProject,
  } = useMembersOfProject();

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const params = useParams();

  const projectId = useMemo(() => params.id, [params.id]) as string;

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: "#", width: "5%", align: "center" },
      {
        value: projectT("detailMembers.member"),
        width: "30%",
        align: "left",
      },
      {
        value: "Email",
        width: "16%",
        align: "left",
      },
      { value: commonT("position"), width: "15%" },
      { value: projectT("detailMembers.hoursWorked"), width: "12.5%" },
      { value: projectT("detailMembers.dateAddedProject"), width: "15%" },
      { value: "", width: "10%" },
    ],
    [commonT, projectT],
  );

  const headerList = useMemo(() => {
    return isMdSmaller ? MOBILE_HEADER_LIST : desktopHeaderList;
  }, [desktopHeaderList, isMdSmaller]) as CellProps[];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (queries: { [key: string]: any }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries, { id: projectId });
    push(path);

    onGetMembersOfProject(projectId, newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  useEffect(() => {
    if (!isReady || !projectId) return;
    onGetMembersOfProject(projectId, { ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetMembersOfProject, projectId]);

  return (
    <>
      <FixedLayout>
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
    </>
  );
};

export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "#", width: "75%", align: "left" }];
