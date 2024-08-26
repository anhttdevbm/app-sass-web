"use client";
import { Stack } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import { Button } from "components/shared";
import TemplateOne from "components/sn-billing-detail/Invoice/TemplateOne";
import { INVOICE_EXPORT_PATH } from "constant/paths";
import ArrowExport from "icons/ArrowExport";
import DownloadIcon from "icons/DownloadIcon";
import { useParams } from "next/navigation";
import React, { memo, useEffect, useMemo } from "react";
import { useInvoices } from "store/invoice/selectors";
import { downloadFile, getPath } from "utils/index";

const ViewPdf = () => {
  const { item, onGetInvoiceDetail } = useInvoices();
  const printRef = React.useRef(null);
  const { id } = useParams();

  useEffect(() => {
    onGetInvoiceDetail(id as string);
  }, [onGetInvoiceDetail]);

  const openNewTab = () => {
    window.open(
      getPath(INVOICE_EXPORT_PATH, undefined, {
        id: id as string,
      }),
    );
  };

  const handleDownload = () => downloadFile(printRef);

  const listService = useMemo(() => {
    if (!item?.service_items) return;
    const dataService = [...item?.service_items];
    return dataService;
  }, [item]);

  return (
    <FixedLayout
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
          startIcon={<ArrowExport />}
          onClick={() => openNewTab()}
        >
          Open new tab
        </Button>
        <Button
          variant="secondary"
          startIcon={<DownloadIcon />}
          onClick={() => {
            handleDownload();
          }}
        >
          Download
        </Button>
      </Stack>
      <div
        ref={printRef}
        style={{
          width: "fit-content",
          margin: "auto",
          height: "70vh",
          overflowY: "auto",
        }}
      >
        <TemplateOne user={{}} isEdit={false} itemInvoice={item} />
      </div>
    </FixedLayout>
  );
};

export default memo(ViewPdf);
