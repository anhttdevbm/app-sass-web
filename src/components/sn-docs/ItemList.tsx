"use client";

/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any

import {
  paginationItemClasses,
  Skeleton,
  Stack,
  TableCell,
  TableRow,
} from "@mui/material";
import Avatar from "components/Avatar";
import FixedLayout from "components/FixedLayout";
import Pagination from "components/Pagination";
import { CellProps, TableLayout } from "components/Table";
import { DocGroupByEnum } from "constant/enums";
import useBreakpoint from "hooks/useBreakpoint";
import { usePathname, useRouter } from "next-intl/client";
import { useSearchParams } from "next/navigation";
import { memo, useCallback, useMemo } from "react";
import { useGetDocsQuery } from "store/docs/api";
import { useAppDispatch, useAppSelector } from "store/hooks";
import { getPath } from "utils/index";
import BasicViewDocList from "./BasicViewDocList";
import { RowGroup } from "./ItemDoc";
import KanbanViewDocList from "./KanbanViewDocList";

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
  const typeViewDocStore = useAppSelector((state) => state.doc.typeViewDoc);
  const { isMdSmaller } = useBreakpoint();
  const pathname = usePathname();
  const { getDocsQueries: query } = useAppSelector((state) => state.doc);

  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetDocsQuery(query, {
    refetchOnMountOrArgChange: true,
  });
  const searchParams = useSearchParams();

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: "Document",
        width: "30%",
        align: "left",
      },
      {
        value: "Creator",
        width: "25%",
        align: "left",
      },
      {
        value: "Last edited",
        width: "25%",
        align: "left",
      },
      { value: "", width: "20%" },
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
        value: "Creator",
        width: "23.333%",
      },
      { value: "Last edited", width: "23.333%" },
      { value: "", width: "30%" },
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

  console.log(data);

  return (
    <>
      <FixedLayout>
        {typeViewDocStore === "basicViewListDoc" ? (
          !isGrouped ? (
            <BasicViewDocList data={data?.docs} />
          ) : (
            <TableLayout
              headerList={headerList}
              pending={isLoading}
              noData={data?.totalDocs === 0}
              px={{ xs: 0, md: 3 }}
              headerProps={{
                sx: { px: { xs: 0.5, md: 2 } },
              }}
              containerHeaderProps={{
                visibility: "hidden",
                mt: -4,
                zIndex: 0,
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
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
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
          )
        ) : (
          <KanbanViewDocList listData={data?.docs} />
        )}
        <Pagination
          totalItems={data?.totalDocs}
          totalPages={data?.totalPages}
          page={data?.page}
          pageSize={query.size ? +query.size : 10}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
          sx={{
            [`& .${paginationItemClasses.root}`]: {
              fontWeight: 600,
              bgcolor: "#D9F0FD",
              borderRadius: 3,
            },
            [`& .${paginationItemClasses.selected}`]: {
              bgcolor: "#14B9E5 !important",
              borderColor: "primary.main",
              color: "common.white",
              borderRadius: 2,
            },
          }}
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
