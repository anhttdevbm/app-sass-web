import { useCallback, useContext, useState } from "react";
import { EditContext } from "../components/sn-service/context/EditContext";
import { useFormContext } from "react-hook-form";
import { useSaleDetail, useSalesService } from "store/sales/selectors";
import { reset } from "linkifyjs";
import { ServiceSection, setColumn } from "store/sales/reducer";
import { useSnackbar } from "store/app/selectors";
import { useTranslations } from "next-intl";
import { NS_COMMON, NS_SALES } from "constant/index";
import { SectionData } from "store/sales/actions";
// import useScrollErrorField from "./useScrollErrorField";

const useServiceHeader = () => {
  const { setEdit } = useContext(EditContext);
  const {
    serviceSectionList,
    onDeleteSection,
    onGetService,
    onCreateSection,
    onUpdateSection,
  } = useSalesService();
  const { onGetSaleDetail } = useSaleDetail();
  const { onAddSnackbar } = useSnackbar();
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);
  const { sectionColumns, onSetColumns } = useSalesService();
  const {
    getValues,
    formState: { dirtyFields },
    reset,
  } = useFormContext();

  const isChanged = dirtyFields?.sectionsList;

  const onSaveChange = useCallback(
    async (data) => {
      setEdit && setEdit(false);
      const { sectionsList } = data;
      if (!isChanged) return;

      const createdList: SectionData[] = data.sectionsList?.reduce(
        (prev, section) => {
          const isExisted = serviceSectionList.find(
            (item) => item.id === section.id,
          );

          if (!isExisted) {
            prev.push(section);
          }
          return prev;
        },
        [],
      );

      const createSection = new Promise((resolve) => {
        if (createdList?.length === 0) {
          return resolve(true);
        }
        onCreateSection({
          dealId: data.id,
          data: createdList,
          start_date: data.start_date,
        });
        return resolve(true);
      });

      const updatedList = sectionsList.reduce((prev, section) => {
        const isExisted = serviceSectionList.find(
          (item) => item.id === section.id,
        );
        if (isExisted) {
          prev.push(
            new Promise((resolve) => {
              {
                const { service } = section;
                onUpdateSection({
                  sectionId: section.id,
                  data: {
                    services: [...service],
                    start_date: getValues("start_date"),
                  },
                });
              }
              resolve(true);
            }),
          );
        }
        return prev;
      }, []);

      const deletedList =
        data.deletedSections?.reduce((prev, sectionId) => {
          const isExisted = serviceSectionList.find((item) =>
            item.id.includes(sectionId),
          );
          if (isExisted) {
            prev.push(
              new Promise((resolve) => {
                {
                  onDeleteSection(sectionId);
                }
                resolve(true);
              }),
            );
          }
          return prev;
        }, []) || [];

      const isSuccessful = await Promise.all([
        ...updatedList,
        ...deletedList,
        createSection,
      ]).then(async () => {
        // await onGetService(getValues("id"));
        await onGetSaleDetail(getValues("id"));
        return true;
      });

      if (isSuccessful) {
        reset({
          ...data,
          deletedSections: [],
        });
        onAddSnackbar(
          commonT("notification.success", {
            label: `${commonT("update")} ${salesT(
              "detail.service.title",
            ).toLowerCase()}`,
          }),
          "success",
        );
      }
    },
    [isChanged],
  );

  const onCancel = useCallback(() => {
    const oldColumns = [...sectionColumns];

    setEdit && setEdit(false);
    reset({
      ...getValues(),
      sectionsList: serviceSectionList,
    });

    oldColumns.forEach((item, index) => {
      onSetColumns(index, item.columns);
    });
  }, [serviceSectionList]);

  return {
    onCancel,
    onSaveChange,
  };
};

export default useServiceHeader;
