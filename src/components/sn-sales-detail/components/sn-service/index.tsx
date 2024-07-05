"use client";
import { Stack } from "@mui/material";
import React, { memo, useCallback, useContext } from "react";
import ServiceTable from "./ServiceTable";
import ServiceHeader from "./ServiceHeader/ServiceHeaderDesktop";
import { EditContext } from "./context/EditContext";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import useBreakpoint from "hooks/useBreakpoint";
import ServiceHeaderMobile from "./ServiceHeader/ServiceHeaderMobile";
import { FieldValue, useFieldArray, useFormContext } from "react-hook-form";
import PlusIcon from "icons/PlusIcon";
import { NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import { ServiceSection } from "store/sales/reducer";
import { useSalesService } from "store/sales/selectors";
import { Button } from "components/shared";
import useGetOptions, {
  useFetchOptions,
} from "components/sn-resource-planing/hooks/useGetOptions";
import { ScrollViewProvider } from "components/sn-sales-detail/hooks/useScrollErrorField";
import { uuid } from "utils/index";
import { SALE_BILL_TYPE, SERVICE_UNIT_OPTIONS } from "constant/enums";
import { defaultShowColumns } from "components/sn-sales-detail/hooks/useGetHeaderColumn";

const SaleService = () => {
  const { isMdSmaller } = useBreakpoint();
  const { setEdit } = useContext(EditContext);
  const { serviceSectionList } = useSalesService();
  const salesT = useTranslations(NS_SALES);
  const { isEdit } = useContext(EditContext);
  const { control, setValue, getValues } = useFormContext();
  const { positionOptions } = useGetOptions();
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "sectionsList",
  });

  // const sectionsList = getValues("sectionsList");
  const onDragEnd = (result, provided) => {
    const { destination, source, draggableId } = result;
    const sectionList = [...getValues("sectionsList")];

    //if descId == sourceId => change position of draggableId
    // if descId != sourceId => move draggableId to descId at the position index of descId
    if (!destination) return;
    if (destination.droppableId === "sectionList") {
      swap(source.index, destination.index);
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
    const desSectionIndex = destination.droppableId.split(".")[2];
    const sourceSectionIndex = source.droppableId.split(".")[2];
    const desSectionId = destination.droppableId.split(".")[1];
    const sourceSectionId = source.droppableId.split(".")[1];

    if (desSectionId === sourceSectionId) {
      const section = sectionList[desSectionIndex];
      const tmp = section.service[source.index];
      section.service[source.index] = section.service[destination.index];
      section.service[destination.index] = tmp;
      setValue("sectionsList", sectionList, { shouldDirty: true });
      return;
    }
    const desSection = sectionList[desSectionIndex];
    const sourceSection = sectionList[sourceSectionIndex];
    const draggable = sourceSection.service[source.index];
    sourceSection.service.splice(source.index, 1);
    desSection.service.splice(destination.index, 0, draggable);
    setValue("sectionsList", sectionList, { shouldDirty: true });
  };

  const onAddSection = () => {
    append({
      id: uuid(),
      name: `Section ${fields.length + 1}`,
      service: [
        {
          id: uuid(),
          name: "",
          desc: "",
          serviceType: positionOptions[0]?.value,
          price: 0,
          billType: SALE_BILL_TYPE.FIX,
          qty: 0,
          discount: 0,
          unit: SERVICE_UNIT_OPTIONS.DAY,
          tolBudget: 0,
          rate: 0,
          estimate: 0,
        },
      ],
    });
    setEdit(true);
  };

  const onRemoveSection = useCallback(
    (index) => {
      const deletedSections =
        (getValues("deletedSections") as Array<string>) || [];
      setValue("deletedSections", [
        ...deletedSections,
        serviceSectionList[index]?.id,
      ]);
      remove(index);
    },
    [JSON.stringify(serviceSectionList)],
  );
  useFetchOptions();

  return (
    <Stack spacing={2} position="relative">
      <Stack spacing={2}>
        <Stack
          sx={{
            position: isEdit ? "sticky" : "relative",
            top: 0,
            zIndex: 20,
            padding: "20px 0px",
            backgroundColor: "background.paper",
          }}
          direction="row"
          justifyContent={fields.length === 0 ? "space-between" : "flex-end"}
        >
          {(isEdit || fields.length === 0) && (
            <Button
              onClick={onAddSection}
              variant="contained"
              size="medium"
              // TouchRippleProps={{
              //   style: {
              //     display: "none",
              //   },
              // }}
              sx={{
                // display: "block",
                // "&.MuiButton-text:hover": {
                //   color: "secondary.main",
                //   textAlign: "center",
                // },
                [`&.MuiButtonBase-root`]: {
                  px: "10px!important",
                  py: "8px!important",
                },
                width: "fit-content",
              }}
              // color="primary"
              startIcon={
                <PlusIcon
                  sx={{
                    width: 18,
                    height: 18,
                  }}
                />
              }
            >
              {!isEdit
                ? salesT("detail.service.addService")
                : salesT("detail.service.addSection")}
            </Button>
          )}
          <ServiceHeader />
        </Stack>
        <ScrollViewProvider>
          <Stack
            sx={{
              height: "max-content",
            }}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable
                type="section"
                direction="vertical"
                droppableId={`sectionList`}
              >
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {fields?.map((section, index) => (
                      <ServiceTable
                        key={section.id}
                        index={index}
                        onRemoveSection={() => onRemoveSection(index)}
                        onAddSection={onAddSection}
                        section={section as ServiceSection}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
        </ScrollViewProvider>
      </Stack>
      {isMdSmaller && <ServiceHeaderMobile />}
    </Stack>
  );
};

export default SaleService;
