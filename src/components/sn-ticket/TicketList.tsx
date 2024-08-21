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
import { setDataListTicket } from "store/ticket/actions";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";

const TickketList = () => {
  const dispatch = useDispatch();


  //Store của các key tìm kiếm gói ở đây ///
  const keySearch = useSelector(selectSearchTicket)
  console.log("key serach sorte" , keySearch)
  ///////////////////////////////////////////

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

  const dataTicketLocal = [
    {
      id: "2024-CS123",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
    {
      id: "2024-CS345",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
    {
      id: "2024-CS567",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
    {
      id: "2024-CS567",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
    {
      id: "2024-CS567",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
    {
      id: "2024-CS567",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
    {
      id: "2024-CS567",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
    {
      id: "2024-CS567",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
    {
      id: "2024-CS567",
      status: "In-progcess",
      title: "Login error",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      prority: "Hight prority",
      username: "Thu Nguyen",
      avatar: "",
      created: "Hoang Phan",
      lastRespond: "hoang phan",
      day: "04/05/2024",
      time: "12:45",
    },
  ];

  const [list , setList] = useState<any>(null)

  const getData = () => {
    if (keySearch?.keySearch?.length > 0) {
      const filter = dataTicketLocal.filter((item) => {
        const id = item?.id?.toString().toLowerCase();
        const searchKey = keySearch?.keySearch?.toLowerCase() ?? '';
        return id?.includes(searchKey);
      })
      setList(filter)
    } else {
      setList(dataTicketLocal)
    }
  }


  useEffect(() => {
    getData()
  }, [keySearch])




  const [listFilterTicket, setListFilterTicket] = useState(defaultFilterTicket);
  const typeViewDocStore = useAppSelector((state) => state.doc.typeViewDoc);
  console.log("check", typeViewDocStore);

  const handleFilterTicket = (item) => {
    const _listFilterTicket = [...defaultFilterTicket];
    const idx = _listFilterTicket.findIndex((product) => product.id == item.id);
    console.log("check idx", idx);
    _listFilterTicket[idx]["active"] = true;
    setListFilterTicket(_listFilterTicket);
  };

  const handlePageChange = (newPage: number) => {
    // handleQueryChange({ page: newPage, limit });
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
        {typeViewDocStore == "basicViewListDoc" && (
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
        {typeViewDocStore == "basicViewListDoc" ? (
          <>
            {list?.map((item, index) => (
              <Box key={index} sx={{ mb: 2 }}>
                <CardTicket data={item} />
              </Box>
            ))}
          </>
        ) : (
          <>
            <TableTicket data={list} />
          </>
        )}
        <Pagination
          totalItems={2}
          totalPages={10}
          page={1}
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
