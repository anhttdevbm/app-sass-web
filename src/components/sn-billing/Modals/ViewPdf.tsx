"use client";
import { Textsms } from "@mui/icons-material";
import {
  Box,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Button, Text } from "components/shared";
import ArrowExport from "icons/ArrowExport";
import DownloadIcon from "icons/DownloadIcon";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Billing } from "store/billing/reducer";
import { Service } from "store/sales/reducer";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useParams } from "next/navigation";
import {
  useBillings,
  useBudgets,
  useServiceBudgets,
} from "store/billing/selectors";
import useQueryParams from "hooks/useQueryParams";
import dayjs from "dayjs";
import FixedLayout from "components/FixedLayout";
import { BILLING_EXPORT_PATH, BILLING_INFO_PATH } from "constant/paths";
import { getPath } from "utils/index";
import { useRouter } from "next-intl/client";

const ViewPdf = () => {
  const { push } = useRouter();
  // const { fileExport, dataExport } = useBillings();

  // const file = localStorage.getItem("file");

  const { item, onGetBilling, updateStatus } = useBillings();
  const { arrService, sumAmount, onGetServiceBudgets } = useServiceBudgets();
  const { budgets, onGetBudgets } = useBudgets();
  const { initQuery, isReady, query } = useQueryParams();
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const printRef = React.useRef(null);
  const param = useParams();

  const id = param?.id.toString();

  useEffect(() => {
    onGetBilling(id ?? "");
  }, [onGetBilling, updateStatus]);

  // useEffect(() => {
  //   if (!isReady) return;
  //   onGetBudgets({ ...initQuery });
  // }, [initQuery, isReady, onGetBudgets]);

  // useEffect(() => {
  //   if (budgets && budgets?.length > 0) {
  //     budgets?.forEach((item) => {
  //       onGetServiceBudgets(item.id ?? "");
  //     });
  //   }
  // }, [budgets]);

  const downloadFile = async () => {
    const element = printRef.current;

    const canvas = await html2canvas(element as unknown as HTMLElement, {
      scale: 2,
    });
    const data = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4",
    });

    const imgProperties = pdf.getImageProperties(data);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProperties.height * pdfWidth) / imgProperties.width;

    // pdf.addImage(data, "PNG", 10, 10, pdfWidth, pdfHeight);

    pdf.html(element ?? "", {
      callback: function (pdf) {
        pdf.save("print.pdf");
      },
      x: 10,
      y: 10,
    });

    // pdf.save("print.pdf");
    setIsDownload(false);
  };

  // const downloadFile = useCallback(() => {
  //   if (fileExport || file) {
  //     const link = document.createElement("a");
  //     link.href = fileExport ?? file ?? "";
  //     link.setAttribute("download", `${Date.now()}.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     localStorage.removeItem("file");
  //   }
  // }, [fileExport, file]);

  const openNewTab = () => {
    window.open(
      getPath(BILLING_EXPORT_PATH, undefined, {
        id: id ?? "",
      }),
    );
  };

  const onInsertComment = () => {
    push(
      getPath(BILLING_INFO_PATH, undefined, {
        id: id ?? "",
      }),
    );

    // window.open(getPath(BILLING_EXPORT_PATH, undefined, { id: id ?? "" }), "");
  };

  // useEffect(() => {
  //   const iframe = document.querySelector("iframe");
  //   if (iframe?.src) iframe.src = fileExport ?? "";
  // }, [fileExport]);
  const listService = useMemo(() => {
    if (!item?.budgetService) return;
    const dataService = [...item?.budgetService];
    return dataService;
  }, [item]);

  return (
    <FixedLayout
      // maxHeight={920}
      maxWidth={{
        xs: 1120,
        xl: 1450,
      }}
    >
      <Stack
        direction={"row"}
        gap={2}
        justifyContent={"end"}
        p={2}
        borderBottom={"1px solid #ECECF3"}
      >
        <Button
          variant="secondary"
          startIcon={<Textsms />}
          onClick={() => onInsertComment()}
        >
          Insert comment
        </Button>

        <Button
          variant="secondary"
          startIcon={<ArrowExport />}
          onClick={() => openNewTab()}
        >
          Open new tab
        </Button>
        <Button
          variant="secondary"
          startIcon={<DownloadIcon />}
          onClick={() => {
            downloadFile();
            setIsDownload(true);
          }}
        >
          Download
        </Button>
      </Stack>
      <Stack style={{ background: "#898989" }}>
        {/* <iframe
          src={fileExport ?? file ?? ""}
          width="100%"
          height="100%"
        ></iframe> */}

        <Stack gap={2} p={2} padding={8} alignItems={"center"}>
          <div
           //TODO: Comment this code to deploy, waiting for QUANGNV to fix the bug 
            // ref={printRef}
            style={{
              fontSize: 20,
              fontWeight: 600,
              width: "68%",
              background: "#fff",
              zIndex: 1,
              padding: 24,
              marginBottom: "12px",
              marginTop: "12px",
            }}
          >
            <Grid container spacing={2}>
              <Grid md={12} p={2}>
                <Text variant={"body1"}>{item?.company}</Text>
                <Text variant={"body1"}>VietNam</Text>
              </Grid>
              <Grid md={12} p={2}>
                <Text sx={{ color: "#154276", fontWeight: 600 }}>
                  Invoice {item?.invoiceNumber?.toString()}
                </Text>
              </Grid>
              <Grid md={12} p={2}>
                <Text sx={{ color: "#92a2be" }}>SUBJECT</Text>
                <Text>{item?.subject}</Text>
              </Grid>
              <Grid container md={12} p={2}>
                <Grid md={3}>
                  <Text sx={{ color: "#92a2be" }}>CLIENT</Text>
                  <Text></Text>
                </Grid>
                <Grid md={3}>
                  <Text sx={{ color: "#92a2be" }}>DATE</Text>
                  <Text>
                    {item?.date ? dayjs(item?.date).format("DD/MM/YYYY") : ""}{" "}
                  </Text>
                </Grid>
                <Grid md={3}>
                  <Text sx={{ color: "#92a2be" }}>DUE DATE</Text>
                  <Text>
                    {item?.dueDate
                      ? dayjs(item?.dueDate).format("DD/MM/YYYY")
                      : ""}
                  </Text>
                </Grid>

                <Grid md={3}>
                  <Text sx={{ color: "#92a2be", fontSize: 13 }}>
                    CREATED BY
                  </Text>
                  <Text>{item?.user ? item?.user[0]?.name ?? "" : []}</Text>
                </Grid>
              </Grid>
              <Grid md={12}>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          DESCRIPTION
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          UNIT
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          QTY
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          RATE
                        </TableCell>
                        <TableCell sx={{ color: "#92a2be", fontSize: 13 }}>
                          AMOUNT
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listService?.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell>{item.desc}</TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>{item.qty}</TableCell>
                            <TableCell>{item.discount}</TableCell>
                            <TableCell>{item.price}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid md={12} p={2} justifyContent={"end"} display={"flex"}>
                <Grid>
                  <Stack direction={"row"} gap={2}>
                    <Grid container>
                      <Text sx={{ color: "#92a2be", fontSize: 13 }}>
                        SUBTOTAL
                      </Text>
                    </Grid>

                    <Text>{item?.amount_unpaid}</Text>
                  </Stack>
                  <Stack direction={"row"} gap={2}>
                    <Grid container>
                      <Text sx={{ color: "#92a2be", fontSize: 13 }}>
                        VAT (10%)
                      </Text>
                    </Grid>

                    <Text>{item?.vat}</Text>
                  </Stack>
                  <Stack direction={"row"} gap={2}>
                    <Grid container>
                      <Text sx={{ color: "#92a2be", fontSize: 13 }}>
                        GRAND TOTAL
                      </Text>
                    </Grid>
                    <Text sx={{ color: "#154276", fontWeight: 600 }}>
                      {item?.amount}
                    </Text>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </Stack>
      </Stack>
    </FixedLayout>
  );
};

export default memo(ViewPdf);
