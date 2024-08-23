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
import { useAppSelector } from "store/hooks";
import Pagination from "components/Pagination";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import { useDispatch } from "react-redux";
import { setCurrentPage, setDataListTicket } from "store/ticket/actions";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";
import TableTicketAgent from "./components/TableTicketAgent";
import useGetListTicket from "queries/ticket/useGetTicket/useGetListTicket";
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
  const dispatch = useDispatch();
  const { data } = useGetListTicket();

  //Store của các key tìm kiếm gói ở đây ///
  const keySearch = useSelector(selectSearchTicket);

  const [list, setList] = useState<any>([]);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(2);

  const getData = (response: any) => {
    const data = response?.data?.data;

    if (keySearch?.keySearch?.length > 0) {
      const filter = data?.filter((item: Ticket) => {
        const id = item?.code?.toString().toLowerCase();
        const searchKey = keySearch?.keySearch?.toLowerCase() ?? "";
        return id?.includes(searchKey);
      });
      setList(filter);
    } else {
      setList(data);
    }
  };

  useEffect(() => {
    if (data !== null) {
      getData(data);
    }
  }, [keySearch]);

  useEffect(() => {
    if (data !== null) {
      getData(data);
    }
  }, [data, page]);

  const typeViewDocStore = useAppSelector((state) => state.doc.typeViewDoc);

  const handlePageChange = (newPage: number) => {
    // handleQueryChange({ page: newPage, limit });
    setPage(newPage);

    const payload = {
      page: newPage,
      totalItems: 4,
    };
    dispatch(setCurrentPage(payload));
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
        <TableTicketAgent data={list} />
        <Pagination
          totalItems={totalItems}
          totalPages={data?.data?.maxPage}
          page={page}
          pageSize={data?.data?.maxPage}
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
