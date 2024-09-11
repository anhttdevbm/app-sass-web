"use client";

import { Box, TableRow, useMediaQuery } from "@mui/material";
import { CellProps } from "components/NewTable";
import { BodyCell, TableLayout } from "components/Table";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
import SearchPackageManagement from "./components/Search";
import TransactionDetail from "./modals/TransactionDetail";
import { Text } from "components/shared";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import { useSelector } from "react-redux";
import { getAllTransaction } from "store/payment/actions";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const ListTransactionHistory = () => {
  const router = useRouter();

  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);

  const {
    data: transactions,
    total,
    loading,
    error,
  } = useSelector((state: RootState) => state.payment.transactions);
  console.log(transactions, "transactions");
  useEffect(() => {
    dispatch(getAllTransaction({ page, size }));
  }, [dispatch, page, size]);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: packageT("list.id"), width: "12.5%", align: "left" },
      { value: packageT("list.type"), width: "12.5%", align: "left" },
      { value: packageT("list.billingPlan"), width: "12.5%", align: "left" },
      { value: packageT("list.package"), width: "12.5%", align: "left" },
      { value: packageT("list.accountNumber"), width: "16.5%", align: "right" },
      { value: packageT("list.totalAmount"), width: "16.5%", align: "right" },
      { value: packageT("list.creationTime"), width: "16.5%", align: "left" },
    ],
    [packageT],
  );
  const items = [
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "Admin",
      package: "Standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "Admin",
      package: "Standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "admin",
      package: "standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "admin",
      package: "standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
    {
      name: "Thư Nguyễn",
      email: "email@gmail.com",
      role: "admin",
      package: "standard",
      expirationDate: "19/07/2024",
      totalAmount: "$12",
      accountNumber: "5",
    },
  ];

  const onClickTransactionDetail = () => {
    if (!isMobile) {
      setOpenModal(true);
    } else {
      router.push("/package-management/mobile/transaction-detail");
    }
  };

  return (
    <>
      <Text
        fontSize={{ xs: "16px", sm: "25px" }}
        fontWeight="600"
        padding={{ xs: "16px", sm: "0" }}
      >
        {packageT("head.transactionHistory")}{" "}
        <span style={{ color: "#0575e6" }}>({total ?? 0})</span>
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
            {transactions.map((item, index) => (
              <TableRow key={index}>
                <BodyCell
                  align="left"
                  onClick={() => onClickTransactionDetail()}
                >
                  <Text
                    sx={{
                      color: "#0575E6",
                      cursor: "pointer",
                    }}
                  >
                    {item.id}
                  </Text>
                </BodyCell>
                <BodyCell align="left">{item.type}</BodyCell>
                <BodyCell align="left">{item.billing_plan}</BodyCell>
                <BodyCell align="left">{item.packageName}</BodyCell>
                <BodyCell align="right">{item.total_amount}</BodyCell>
                <BodyCell align="right" sx={{ fontWeight: 600 }}>
                  {item.total_amount}
                </BodyCell>
                <BodyCell align="left">
                  {dayjs(item.created_time).format("YYYY/MM/DD HH:mm")}
                </BodyCell>
              </TableRow>
            ))}
          </TableLayout>
        </>
      ) : (
        transactions.map((item, index) => (
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
              <Text>{packageT("list.id")}</Text>
              <Text
                sx={{
                  color: "#0575E6",
                  cursor: "pointer",
                }}
                onClick={() => onClickTransactionDetail()}
              >
                {item.id}
              </Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.type")}</Text>
              <Text>{item.type}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.billingPlan")}</Text>
              <Text>{item.billing_plan}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.package")}</Text>
              <Text>{item.packageName ?? "0"}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.accountNumber")}</Text>
              <Text>{item.total_amount}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.totalAmount")}</Text>
              <Text>{item.total_amount}</Text>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Text>{packageT("list.creationTime")}</Text>
              <Text>{dayjs(item.created_time).format("YYYY/MM/DD HH:mm")}</Text>
            </Box>
          </Box>
        ))
      )}
      {!isMobile && (
        <TransactionDetail
          open={openModal}
          onClose={() => setOpenModal(false)}
        />
      )}
    </>
  );
};

export default memo(ListTransactionHistory);
