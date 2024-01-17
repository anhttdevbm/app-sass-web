import { Endpoint, client } from "api";
import { NS_COMMON, NS_SALES, SALE_API_URL } from "constant/index";
import FileSaver from "file-saver";
import { useTranslations } from "next-intl";
import React from "react";
import {
  EXPORT_ORIENTATION_OPTIONS,
  EXPORT_PAGE_SIZE_OPTIONS,
  EXPORT_TYPE_OPTIONS,
} from "../helpers";
import { useSnackbar } from "store/app/selectors";
import { useForm, useFormContext } from "react-hook-form";

const useExportDeal = () => {
  const salesT = useTranslations(NS_SALES);
  const [isFetching, setIsFetching] = React.useState(false);
  const { onAddSnackbar } = useSnackbar();

  const exportDeal = async ({
    format,
    orientation,
    pageSize,
  }) => {
    setIsFetching(true);
    await client
      .get(
        Endpoint.SALES_DEAL_EXPORT,
        {
          format,
          orientation,
          pageSize,
        },
        { responseType: "arraybuffer", baseURL: SALE_API_URL },
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });
        setIsFetching(false);
        FileSaver.saveAs(blob, `${salesT("list.title")}.${format}`);
      })
      .catch((error) => {
        console.log(error);
        onAddSnackbar(salesT("list.exportView.error"), "error");
        setIsFetching(false);
      });
  };
  return { exportDeal, isFetching };
};

export const useGetExportOption = () => {
  const salesT = useTranslations(NS_SALES);
  const commonT = useTranslations(NS_COMMON);

  const EXPORT_TYPE = Object.keys(EXPORT_TYPE_OPTIONS).map((key) => ({
    label: key,
    value: EXPORT_TYPE_OPTIONS[key],
  }));

  const ORIENTATION_TYPE = Object.keys(EXPORT_ORIENTATION_OPTIONS).map(
    (key) => ({
      label: salesT(`list.exportView.orientationOption.${EXPORT_ORIENTATION_OPTIONS[key]}`),
      value: EXPORT_ORIENTATION_OPTIONS[key],
    }),
  );

  const PAGE_SIZE_TYPE = Object.keys(EXPORT_PAGE_SIZE_OPTIONS).map((key) => ({
    label: key,
    value: EXPORT_PAGE_SIZE_OPTIONS[key],
  }));

  const INCLUDE_ATTACHMENT_TYPE = [
    {
      label: commonT("yes"),
      value: "yes",
    },
    {
      label: commonT("no"),
      value: "no",
    },
  ];

  return {
    EXPORT_TYPE,
    ORIENTATION_TYPE,
    PAGE_SIZE_TYPE,
    INCLUDE_ATTACHMENT_TYPE,
  };
};

export default useExportDeal;
