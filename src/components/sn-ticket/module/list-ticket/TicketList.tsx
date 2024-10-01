"use client";
import { Box, Stack } from "@mui/material";
import React, { memo, useEffect } from "react";
import CardTicket from "../../components/CardTicket";
import { useAppDispatch, useAppSelector } from "store/hooks";
import Pagination from "components/Pagination";
import TableTicket from "../../components/TableTicket";
import { setKeySearchTicket } from "store/ticket/actions";
import { useSelector } from "react-redux";
import { selectSearchTicket } from "store/ticket/selectors";
import useGetListTicket from "queries/ticket/useGetTicket/useGetListTicket";
import { ITicket, TypeViewList } from "../../@type";
import FilterTicket from "./filter-header/filter-ticket";
import useNotification from "hooks/useNotification/useNotification";


const TicketList = () => {
  const dispatch = useAppDispatch();
  const { data: listTicket } = useGetListTicket();
  const dataFilter = useSelector(selectSearchTicket);
  const typeViewDocStore = useAppSelector((state) => state.doc.typeViewDoc);

  // const checktoken = useNotification()
  // console.log("🚀 ~ TicketList ~ checktoken:", checktoken)




  const handlePageChange = (newPage: number) => { 
    const payload = {
      ...dataFilter,
      page: newPage,
    };
    dispatch(setKeySearchTicket(payload));
  };


  const handleSizeChange = (newPageSize: number) => {
    const payload = {
      ...dataFilter,
      page: 1,
      size: newPageSize,
    };
    dispatch(setKeySearchTicket(payload));
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
        {typeViewDocStore === TypeViewList.LIST ? (
          <>
            <FilterTicket />
            {(listTicket?.data?.data || [])?.map(
              (item: ITicket, index: number) => (
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
          totalItems={listTicket?.data?.count ?? 0}
          totalPages={listTicket?.data?.maxPage ?? 0}
          page={dataFilter?.page ?? 0}
          pageSize={dataFilter.size ?? 5}
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

export default memo(TicketList);
