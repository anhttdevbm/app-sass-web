import { Box, TableRow, useMediaQuery } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState, useRef } from "react";
import SearchPackageManagement from "./components/Search";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import { getListAccounts } from "store/payment/actions";
import { Text } from "components/shared";
import dayjs from "dayjs";
import { AccountType } from "store/payment/reducer";

const ListAccount = () => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();

  const isMobile = useMediaQuery("(max-width:600px)");

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

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: packageT("list.name"), width: "20%", align: "center" },
      { value: packageT("list.email"), width: "20%", align: "center" },
      { value: packageT("list.role"), width: "20%", align: "center" },
      { value: packageT("list.package"), width: "20%", align: "center" },
      { value: packageT("list.expiration"), width: "20%", align: "center" },
    ],
    [packageT],
  );

  return (
    <>
      <Text
        fontSize={{ xs: "16px", sm: "25px" }}
        fontWeight="600"
        padding={{ xs: "16px", sm: "0" }}
      >
        {packageT("head.account")}{" "}
        <span style={{ color: "#0575e6" }}>({total})</span>
      </Text>
      {!isMobile ? (
        <>
          <SearchPackageManagement
            placeholder={packageT("placeholder.search")}
            onSearch={handleSearch}
          />
          <TableLayout
            ref={tableRef}
            headerList={desktopHeaderList}
            headerProps={{
              style: {
                padding: "16px",
                backgroundColor: "#d9f0fd",
              },
            }}
            px={3}
            style={{ padding: 0 }}
            height={300}
          >
            {accountList &&
              accountList.map((item, index) => (
                <TableRow key={index}>
                  <BodyCell>{item.fullname}</BodyCell>
                  <BodyCell>{item.email}</BodyCell>
                  <BodyCell>{item.roles}</BodyCell>
                  <BodyCell>{item.packageName ?? "0"}</BodyCell>
                  <BodyCell>
                    {dayjs(item.expiration_date).format("YYYY/MM/DD")}
                  </BodyCell>
                </TableRow>
              ))}
          </TableLayout>
          {loading && (
            <Box display="flex" justifyContent="center" padding={2}>
              <Text>Loading...</Text>
            </Box>
          )}
        </>
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
              <Text>{item.email}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.role")}</Text>
              <Text>{item.roles}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.package")}</Text>
              <Text>{item.packageName ?? "0"}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.expiration")}</Text>
              <Text>{dayjs(item.expiration_date).format("YYYY/MM/DD")}</Text>
            </Box>
          </Box>
        ))
      )}
    </>
  );
};

export default memo(ListAccount);
