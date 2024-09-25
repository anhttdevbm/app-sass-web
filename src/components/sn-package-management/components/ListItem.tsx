"use client";

import { Box, TableRow, useMediaQuery } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import SearchPackageManagement from "./Search";
import { Text } from "components/shared";
import { AccountType } from "store/payment/reducer";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import { getListAccounts } from "store/payment/actions";
import { useDispatch } from "react-redux";

type Props = {};
const ListItem = (props: Props) => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const isMobile = useMediaQuery("(max-width:600px)");
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [query, setQuery] = useState();

  const { loading, total, totalPage } = useSelector(
    (state: RootState) => state.payment.accounts,
  );
  const [accountList, setAccountList] = useState<AccountType[]>([]);

  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      const result = await dispatch(getListAccounts({ page, size, query }));
      setAccountList((prev) => [...prev, ...result.payload.data]);
    };

    fetchAccounts();
  }, [dispatch, page, size, query]);

  const handleSearch = (value) => {
    setQuery(value);
    setPage(1);
    setAccountList([]);
  };

  const handleTableScroll = () => {
    if (tableRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableRef.current;
      if (
        scrollTop + clientHeight >= scrollHeight - 50 &&
        !loading &&
        page < totalPage
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    const currentTable = tableRef.current;
    if (currentTable) {
      currentTable.addEventListener("scroll", handleTableScroll);
    }

    return () => {
      if (currentTable) {
        currentTable.removeEventListener("scroll", handleTableScroll);
      }
    };
  }, [loading]);

  const headerList: CellProps[] = useMemo(
    () => [
      { value: packageT("list.name"), width: "30%", align: "left" },
      { value: packageT("list.role"), width: "15%", align: "left" },
      { value: packageT("list.package"), width: "15%", align: "left" },
      { value: packageT("list.renewalDate"), width: "20%", align: "left" },
      { value: packageT("list.expiration"), width: "20%", align: "left" },
    ],
    [packageT],
  );

  return (
    <>
      <SearchPackageManagement
        placeholder={packageT("placeholder.search")}
        onSearch={handleSearch}
      />
      {!isMobile ? (
        <TableLayout
          ref={tableRef}
          headerList={headerList}
          headerProps={{
            style: {
              padding: "16px",
              backgroundColor: "#d9f0fd",
            },
          }}
          px={3}
          style={{ padding: 0 }}
          maxHeight={300}
          overflow="auto"
        >
          {accountList &&
            accountList.length > 0 &&
            accountList.map((item, index) => (
              <TableRow key={index}>
                <BodyCell align="left">{item.fullname}</BodyCell>
                <BodyCell align="left">{item.roles}</BodyCell>
                <BodyCell align="left">{item.packageName}</BodyCell>
                <BodyCell align="left">
                  {dayjs(item?.renewal_date).format("D MMMM, YYYY") ?? "-"}
                </BodyCell>
                <BodyCell align="left">
                  {" "}
                  {dayjs(item?.expiration_date).format("D MMMM, YYYY") ?? "-"}
                </BodyCell>
              </TableRow>
            ))}
        </TableLayout>
      ) : (
        accountList &&
        accountList.length > 0 &&
        accountList.map((item, index) => (
          <Box
            key={index}
            width="100%"
            sx={{
              padding: "16px",
              background: "#F9F8F8",
              borderRadius: "12px",
              marginBottom: "12px",
            }}
          >
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.name")}</Text>
              <Text>{item.fullname}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.email")}</Text>
              <Text>{item.roles}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.role")}</Text>
              <Text>{item.packageName}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.package")}</Text>
              {dayjs(item?.renewal_date).format("D MMMM, YYYY") ?? "-"}
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.expiration")}</Text>
              <Text>
                {" "}
                {dayjs(item?.expiration_date).format("D MMMM, YYYY") ?? "-"}
              </Text>
            </Box>
          </Box>
        ))
      )}
    </>
  );
};

export default memo(ListItem);
