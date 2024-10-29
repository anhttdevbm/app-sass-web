"use client";
import { Stack } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import Pagination from "components/Pagination";
import TableTicketAgent from "./components/TableTicketAgent";
import useGetListAgent from "queries/ticket-agent/useGetAgent/useGetListAgent";
import { setKeySearchTicketAgent } from "store/ticket-agent/actions";
import { selectSearchTicketAgent } from "store/ticket-agent/selectors";
// import useGetListAgent from "queries/ticket-agent/useGetAgent/useGetListAgent";

interface File {
  name: string;
  url: string;
}

interface Ticket {
  assign: string | null;
  assignUser: any | null;
  code: string;
  company: string;
  createTime: string;
  creator: string;
  description: string;
  id: string;
  idUpdateUser: string | null;
  lstFile: File[];
  priority: "Low" | "Medium" | "High";
  rate: number | null;
  rootCause: string | null;
  stage: "New" | "InProgress" | "Resolved" | "Closed";
  title: string;
  type: string | null;
  updateTime: string | null;
}

const TicketAgentList = () => {
  const dispatch = useAppDispatch();
  const { data: listAgent } = useGetListAgent();
  const dataFilter = useAppSelector(selectSearchTicketAgent);

  //Store của các key tìm kiếm gói ở đây //
  const handlePageChange = (newPage: number) => {
    // handleQueryChange({ page: newPage, limit });
    const payload = {
      ...dataFilter,
      page: newPage,
    };
    dispatch(setKeySearchTicketAgent(payload));
  };

  const handleSizeChange = (newPageSize: number) => {
    const payload = {
      ...dataFilter,
      page: 1,
      size: newPageSize,
    };
    dispatch(setKeySearchTicketAgent(payload));
  };

  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        spacing={{ xs: 1, md: 2 }}
        px={{ xs: 0, md: 3 }}
        py={1}
        zIndex={2}
      >
        <TableTicketAgent data={listAgent?.data?.data ?? []} />
        <Pagination
          totalItems={listAgent?.data?.count ?? 0}
          totalPages={listAgent?.data?.maxPage ?? 0}
          page={listAgent?.data?.page ?? 0}
          pageSize={dataFilter?.size ?? 5}
          onChangePage={handlePageChange}
          onChangeSize={handleSizeChange}
          containerProps={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row-reverse",
          }}
        />
      </Stack>
    </>
  );
};

export default memo(TicketAgentList);
