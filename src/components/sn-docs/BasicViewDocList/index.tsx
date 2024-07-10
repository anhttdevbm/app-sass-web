import { CellProps, TableLayout } from "components/Table";
import useBreakpoint from "hooks/useBreakpoint";
import useQueryParams from "hooks/useQueryParams";

import { memo, useCallback, useEffect, useMemo } from "react";
import { DocGroupByEnum } from "constant/enums";
import { RowGroup } from "../ItemDoc";
import { Skeleton, Stack, TableCell, TableRow } from "@mui/material";
import Avatar from "components/Avatar";
import { IViewDocItem } from "../KanbanViewDocList";

export default function BasicViewDocList({
  data,
  isLoading,
  isGrouped,
}: {
  data: IViewDocItem[];
  isLoading?: boolean;
  isGrouped?: boolean;
}) {
  const { isMdSmaller } = useBreakpoint();
  const { query } = useQueryParams();
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

  return (
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
                      {`${item.groupInfo.name} #${item.groupInfo?.number || 0}`}
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
  );
}
