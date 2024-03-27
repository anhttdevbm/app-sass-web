"use client";

/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any

import { Skeleton, Stack, TableCell, TableRow } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import Pagination from "components/Pagination";
import { CellProps, TableLayout } from "components/Table";
import { DocGroupByEnum } from "constant/enums";
import { DEFAULT_PAGING } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useQueryParams from "hooks/useQueryParams";
import { usePathname, useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { memo, useCallback, useEffect, useMemo } from "react";
import { useDocs } from "store/docs/selectors";
import { getPath } from "utils/index";
import DesktopCells from "./DesktopCells";
import { RowGroup } from "./ItemDoc";
import MobileContentCell from "./MobileContentCell";
import { useGetDocsQuery } from "store/docs/api";
import Avatar from "components/Avatar";
import { MenuButton } from "@mui/base";

export declare type TDocumentGroup = {
  _id: string;
  name: string;
  documents: Array<{ [key: string]: any }>;
};

export declare type TItemListParams = {
  isGrouped?: boolean;
};

const ItemList = ({ isGrouped }: TItemListParams) => {
  const { push } = useRouter();

  const { isMdSmaller } = useBreakpoint();
  const pathname = usePathname();
  const { query } = useQueryParams();
  const { data, isLoading } = useGetDocsQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const searchParams = useSearchParams()!;

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: "Document",
        width: "30%",
        align: "left",
      },
      {
        value: "Created at",
        width: "23.333%",
      },
      {
        value: "Last edited",
        width: "23.333%",
      },
      { value: "Creator", width: "23.333%" },
    ],
    [],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: "Document",
        width: "23.333%",
        align: "left",
      },
      {
        value: "Created at",
        width: "23.333%",
      },
      { value: "Last edited", width: "23.333%" },
      { value: "Creator", width: "30%" },
    ],
    [],
  );
  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? mobileHeaderList
      : desktopHeaderList;

    return [...additionalHeaderList] as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  const onChangeQueries = (queries) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);
    push(path);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ page: newPage, size: query.size });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ page: 1, size: newPageSize });
  };

  const onChangeSort = (sort: any) => {
    onChangeQueries(sort);
  };

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(
        searchParams as unknown as typeof URLSearchParams.prototype,
      );
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const createParamString = useCallback(
    (obj: Record<string, string>) => {
      const params = new URLSearchParams(
        searchParams as unknown as typeof URLSearchParams.prototype,
      );
      Object.entries(obj).forEach(([key, value]) => {
        params.set(key, value);
      });
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    if (!searchParams.get("group_by")) {
      push(
        pathname +
          "?" +
          createParamString({
            group_by: DocGroupByEnum.PROJECT_ID,
            size: "50",
          }),
      );
    }
  }, [searchParams.get("group_by")]);

  return (
    <>
      <FixedLayout>
        <TableLayout
          headerList={headerList}
          pending={isLoading}
          noData={data?.totalDocs === 0}
          px={{ xs: 0, md: 3 }}
          headerProps={{
            sx: { px: { xs: 0.5, md: 2 } },
          }}
        >
          {query?.group_by == DocGroupByEnum.CREATED_BY &&
            Array.isArray(data?.docs) &&
            data?.docs.map((item) => {
              return (
                <RowGroup
                  key={item?._id}
                  title={item.groupInfo?.fullname || "Unknown"}
                  items={item.docs}
                />
              );
            })}
          {query?.group_by === DocGroupByEnum.PROJECT_ID &&
            Array.isArray(data?.docs) &&
            data?.docs.map((item) => {
              return (
                <RowGroup
                  isGrouped={isGrouped}
                  key={item?._id}
                  title={
                    item.groupInfo ? (
                      <>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar
                            size={32}
                            alt={item.groupInfo.name}
                            src={item.groupInfo.avatar.link}
                            style={{ marginRight: "8px" }}
                          />
                          {`${item.groupInfo.name} #${
                            item.groupInfo?.number || 0
                          }`}
                        </Stack>
                      </>
                    ) : (
                      "No project"
                    )
                  }
                  items={item.docs}
                />
              );
            })}
        </TableLayout>

        <Pagination
          totalItems={data?.totalDocs}
          totalPages={data?.totalPages}
          page={data?.page}
          pageSize={+query.size}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>
    </>
  );
};

const TablePending = ({ prepareRows = 5, prepareCols }) => {
  // eslint-disable-next-line prefer-spread
  const preRenderCells = Array.apply(null, Array(prepareCols)).map((_, i) => i);
  // eslint-disable-next-line prefer-spread
  const preRenderRows = Array.apply(null, Array(prepareRows)).map((_, j) => j);
  return preRenderRows.map((_, i) => (
    <TableRow key={i}>
      {preRenderCells.map((_, j) => (
        <TableCell key={j}>
          <Skeleton height={100} width="100%" />
        </TableCell>
      ))}
    </TableRow>
  ));
};

export default memo(ItemList);
