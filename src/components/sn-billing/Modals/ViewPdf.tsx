"use client";
import { Stack } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import { Button } from "components/shared";
import TemplateFifth from "components/sn-billing-detail/Invoice/TemplateFifth";
import TemplateFour from "components/sn-billing-detail/Invoice/TemplateFour";
import TemplateOne from "components/sn-billing-detail/Invoice/TemplateOne";
import TemplateSixth from "components/sn-billing-detail/Invoice/TemplateSixth";
import TemplateThree from "components/sn-billing-detail/Invoice/TemplateThree";
import TemplateTwo from "components/sn-billing-detail/Invoice/TemplateTwo";
import { INVOICE_EXPORT_PATH } from "constant/paths";
import ArrowExport from "icons/ArrowExport";
import DownloadIcon from "icons/DownloadIcon";
import { useParams } from "next/navigation";
import React, { memo, useEffect, useState } from "react";
import { useInvoices } from "store/invoice/selectors";
import { downloadFile, getPath } from "utils/index";

const ViewPdf = () => {
  const { item, onGetInvoiceDetail } = useInvoices();
  const printRef = React.useRef(null);
  const { id } = useParams();
  const hash = window.location.hash;

  const listTemplate = [
    {
      key: "template-one",
      value: "Template 1",
      component: (
        <TemplateOne
          isEdit={false}
          itemInvoice={item}
          handleChange={() => {}}
          onDragEnd={() => {}}
        />
      ),
    },
    {
      key: "template-two",
      value: "Template 2",
      component: (
        <TemplateTwo
          isEdit={false}
          itemInvoice={item}
          handleChange={() => {}}
          onDragEnd={() => {}}
        />
      ),
    },
    {
      key: "template-three",
      value: "Template 3",
      component: (
        <TemplateThree
          isEdit={false}
          itemInvoice={item}
          handleChange={() => {}}
          onDragEnd={() => {}}
        />
      ),
    },
    {
      key: "template-four",
      value: "Template 4",
      component: (
        <TemplateFour
          isEdit={false}
          itemInvoice={item}
          handleChange={() => {}}
          onDragEnd={() => {}}
        />
      ),
    },
    {
      key: "template-fifth",
      value: "Template 5",
      component: (
        <TemplateFifth
          isEdit={false}
          itemInvoice={item}
          handleChange={() => {}}
          onDragEnd={() => {}}
        />
      ),
    },
    {
      key: "template-sixth",
      value: "Template 6",
      component: (
        <TemplateSixth
          isEdit={false}
          itemInvoice={item}
          handleChange={() => {}}
          onDragEnd={() => {}}
        />
      ),
    },
  ];

  const [selectedTemplate, setSelectedTemplate] = useState(listTemplate[0]);

  useEffect(() => {
    const selected =
      listTemplate.find((template) => hash.includes(template.key)) ??
      listTemplate[0];

    setSelectedTemplate(selected as any);
  }, [hash]);

  useEffect(() => {
    onGetInvoiceDetail(id as string);
  }, [onGetInvoiceDetail, hash]);

  const openNewTab = () => {
    window.open(
      getPath(INVOICE_EXPORT_PATH, undefined, {
        id: id as string,
      }),
    );
  };

  const handleDownload = () => downloadFile(printRef);

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
        {selectedTemplate?.component}
      </div>
    </FixedLayout>
  );
};

export default memo(ViewPdf);
