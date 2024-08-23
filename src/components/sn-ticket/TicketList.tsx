"use client";
import { Box, Paper, Stack, Typography } from "@mui/material";
import { Button, Text } from "components/shared";
import CanceledTicketIcon from "icons/CanceledTicketIcon";
import ClosedTicketIcon from "icons/ClosedTicketIcon";
import InProgressTicketIcon from "icons/InProgressTicketIcon";
import NewTicketIcon from "icons/NewTicketIcon";
import OnHoldTicketIcon from "icons/OnHoldTicketIcon";
import OpenTicketDetailIcon from "icons/OpenTicketDetailIcon";
import OpenTicketIcon from "icons/OpenTicketIcon";
import ResolveTicketIcon from "icons/ResolveTicketIcon";
import SendAllTicketIcon from "icons/SendAllTicketIcon";
import { usePathname, useRouter } from "next-intl/client";
import { memo, useEffect, useMemo, useState } from "react";
import CardTicket from "./components/CardTicket";
import { useAppSelector } from "store/hooks";
import Pagination from "components/Pagination";
import TableTicket from "./components/TableTicket";
import { useTranslations } from "next-intl";
import { NS_TICKET } from "constant/index";
import { useDispatch } from "react-redux";
import { setCurrentPage, setDataListTicket } from "store/ticket/actions";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";
import useGetListTicket from "queries/ticket/useGetTicket/useGetListTicket";

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

const TickketList = () => {
  const dispatch = useDispatch();
  const { data: listTicket } = useGetListTicket();

  console.log("check data api" , listTicket)

  //Store của các key tìm kiếm gói ở đây ///
  const keySearch = useSelector(selectSearchTicket);

  const [list, setList] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const defaultFilterTicket = [
    {
      id: 1,
      icon: SendAllTicketIcon,
      title: "All Ticket",
      count: 3,
      active: false,
    },
    {
      id: 2,
      icon: NewTicketIcon,
      title: "New",
      count: 1,
      active: false,
    },
    {
      id: 3,
      icon: OpenTicketIcon,
      title: "Open",
      count: 1,
      active: false,
    },
    {
      id: 4,
      icon: InProgressTicketIcon,
      title: "In-progress",
      count: 1,
      active: false,
    },
    {
      id: 5,
      icon: OnHoldTicketIcon,
      title: "On hold",
      count: 3,
      active: false,
    },
    {
      id: 6,
      icon: ResolveTicketIcon,
      title: "Resolved",
      count: 3,
      active: false,
    },
    {
      id: 7,
      icon: ClosedTicketIcon,
      title: "Closed",
      count: 0,
      active: false,
    },
    {
      id: 8,
      icon: CanceledTicketIcon,
      title: "Canceled",
      count: 0,
      active: false,
    },
  ];
  
  useEffect(() => {
    setTotalItems(listTicket?.data?.count)
  }, [listTicket]);


  const [listFilterTicket, setListFilterTicket] = useState(defaultFilterTicket);
  const typeViewDocStore = useAppSelector((state) => state.doc.typeViewDoc);

  const handleFilterTicket = (item) => {
    const _listFilterTicket = [...defaultFilterTicket];
    const idx = _listFilterTicket.findIndex((product) => product.id == item.id);
    _listFilterTicket[idx]["active"] = true;
    setListFilterTicket(_listFilterTicket);
  };

  const handlePageChange = (newPage: number) => {
    // handleQueryChange({ page: newPage, limit });
    setPage(newPage);
    const payload = {
      page: newPage ,
      totalItems: 4,
    };
    dispatch(setCurrentPage(payload));
  };

  const handleSizeChange = (newPageSize: number) => {
    // handleQueryChange({ page: 1, size: newPageSize });
  };

  useEffect(() => {
    handleFilterTicket(listFilterTicket[0]);
  }, []);

  return (
    <>
      <Stack
        direction="column"
        justifyContent="space-between"
        spacing={{ xs: 1, md: 2 }}
        px={{ xs: 0, md: 3 }}
        py={1}
        zIndex={2}
        // sx={{ overflowY: "auto", scrollbarWidth: "none" , height : 700 }}
      >
        {typeViewDocStore == "kanbanViewListDoc" && (
          <Stack>
            <Box
              bgcolor="background.default"
              borderRadius="2rem"
              overflow={{ xs: "auto" }}
              sx={{
                backgroundColor: "#fff",
                border: "1px solid #EFEFEF",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="flex-start"
                spacing={3}
                overflow="auto"
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="background.default"
                  borderRadius="2rem"
                  overflow={{ xs: "auto" }}
                  sx={{
                    // height: "56px",
                    backgroundColor: "#fff",
                    width: "100%",
                  }}
                >
                  {listFilterTicket.map((item, index) => (
                    <Box
                      key={index}
                      onClick={() => handleFilterTicket(item)}
                      borderRadius="2rem"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        // padding: 2,
                        backgroundColor: item.active ? "#D9F0FD" : "#fff",
                        padding: "10px 10px",
                      }}
                    >
                      {item.active ? (
                        <item.icon colorCustom="#045EB8" />
                      ) : (
                        <item.icon colorCustom="#B3B3B3" />
                      )}
                      <Text
                        sx={{
                          display: { xs: "none", md: "block", fontSize: 13 },
                        }}
                        color={item.active ? "#045EB8" : "#B3B3B3"}
                        fontWeight={item.active ? "700" : "400"}
                      >
                        {item.title}
                      </Text>
                      {item.count !== 0 && (
                        <Paper
                          elevation={3}
                          sx={{
                            borderRadius: "100%",
                            backgroundColor: item.active
                              ? "#045EB8"
                              : "#B3B3B3",
                            padding: 2,
                            width: 15,
                            height: 15,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            sx={{
                              display: {
                                xs: "none",
                                md: "block",
                                fontSize: 13,
                              },
                            }}
                            color="#fff"
                          >
                            {" "}
                            {item.count}
                          </Text>
                        </Paper>
                      )}
                    </Box>
                  ))}
                </Box>
              </Stack>
            </Box>
          </Stack>
        )}
        {typeViewDocStore == "kanbanViewListDoc" ? (
          <>
            {(listTicket?.data?.data || [])?.map(
              (item: Ticket, index: number) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <CardTicket data={item} />
                </Box>
              ),
            )}
          </>
        ) : (
          <>
            <TableTicket data={listTicket?.data?.data ?? []} />
          </>
        )}
        <Pagination
          totalItems={totalItems}
          totalPages={listTicket?.data?.maxPage}
          page={page}
          pageSize={5}
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

export default memo(TickketList);
