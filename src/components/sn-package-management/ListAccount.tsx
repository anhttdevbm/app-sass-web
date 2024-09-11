import { Box, TableRow, useMediaQuery } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import SearchPackageManagement from "./components/Search";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import { getListAccounts } from "store/payment/actions";
import { Text } from "components/shared";

const ListAccount = () => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();

  const isMobile = useMediaQuery("(max-width:600px)");

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const {
    data: accounts,
    total,
    loading,
    error,
  } = useSelector((state: RootState) => state.payment.accounts);

  useEffect(() => {
    dispatch(getListAccounts({ page, size }));
  }, [dispatch, page, size]);

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
          />
          <TableLayout
            headerList={desktopHeaderList}
            headerProps={{
              style: {
                padding: "16px",
                backgroundColor: "#d9f0fd",
              },
            }}
            px={3}
            style={{ padding: 0 }}
          >
            {accounts.map((item, index) => (
              <TableRow key={index}>
                <BodyCell>{item.fullname}</BodyCell>
                <BodyCell>{item.email}</BodyCell>
                <BodyCell>{item.roles}</BodyCell>
                <BodyCell>{item.packageName ?? "0"}</BodyCell>
                <BodyCell>{item.expirationDate}</BodyCell>
              </TableRow>
            ))}
          </TableLayout>
        </>
      ) : (
        accounts.map((item, index) => (
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
              <Text>{item.expirationDate}</Text>
            </Box>
          </Box>
        ))
      )}
    </>
  );
};

export default memo(ListAccount);
