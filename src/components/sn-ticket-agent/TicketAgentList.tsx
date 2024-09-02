"use client";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Button, Text } from "components/shared";
import { usePathname, useRouter } from "next-intl/client";
import { memo, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "store/hooks";
import Pagination from "components/Pagination";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import { setDataListTicket } from "store/ticket/actions";
import { selectSearchTicket } from "store/ticket/selectors";
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

  //Store của các key tìm kiếm gói ở đây ///

  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(2);

  const handlePageChange = (newPage: number) => {
    // handleQueryChange({ page: newPage, limit });
    setPage(newPage);

    const payload = {
      ...dataFilter,
      page: newPage,
    };
    dispatch(setKeySearchTicketAgent(payload));
  };

  const handleSizeChange = (newPageSize: number) => {
    // handleQueryChange({ page: 1, size: newPageSize });
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
        <TableTicketAgent data={listAgent?.data?.data} />
        <Pagination
          totalItems={totalItems}
          totalPages={listAgent?.data?.maxPage}
          page={page}
          pageSize={listAgent?.data?.maxPage}
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
