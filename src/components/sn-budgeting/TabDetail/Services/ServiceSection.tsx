/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";
import { Button, IconButton } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { getMessageErrorByAPI, uuid } from "utils/index";
import { ServiceSectionRow } from "./ServiceSectionRow";
import { TErrors, TSectionForm } from "./ServiceUtil";
import { createRef, useEffect, useImperativeHandle, useState } from "react";
import {
  TBudgetServiceForm,
  useBudgetServiceAdd,
} from "queries/budgeting/service-add";
import { useParams } from "next/navigation";
import dayjs from "dayjs";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import { useSnackbar } from "store/app/selectors";
import { useTranslations } from "next-intl";
import ConfirmDialog from "components/ConfirmDialog";
import useToggle from "hooks/useToggle";
import TrashIcon from "icons/TrashIcon";
import { useBudgetSectionDelete } from "queries/budgeting/section-delete";
import _ from "lodash";
import moment from "moment";
import {
  TBudgetServiceUpdateForm,
  useBudgetServiceUpdate,
} from "queries/budgeting/service-update";
import {
  TBudgetSection,
  TBudgetService,
} from "components/sn-budgeting/BudgetDetail";
import { ScrollViewProvider } from "components/sn-sales-detail/hooks/useScrollErrorField";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

type Props = {
  sectionsList: TBudgetSection[];
  onCloseEdit?: () => void;
  refetch?: () => void;
};

export const serviceSectionRef = createRef<any>();

export const ServiceSection = ({
  onCloseEdit = () => {},
  sectionsList = [],
  refetch = () => {},
}: Props) => {
  const { id: budgetId } = useParams();
  const { onAddSnackbar } = useSnackbar();

  const commonT = useTranslations(NS_COMMON);
  const budgetT = useTranslations(NS_BUDGETING);

  const budgetServiceAdd = useBudgetServiceAdd();
  const budgetServiceUpdate = useBudgetServiceUpdate();
  const budgetSectionDelete = useBudgetSectionDelete();

  const [isOpenConfirm, openConfirm, closeConfirm] = useToggle();
  const [errors, setErrors] = useState<TErrors>({});
  const [deletedSections, setDeletedSections] = useState<string[]>([]);
  const [indexWaitDelete, setIndexWaitDelete] = useState<number | null>(null);
  const [deletedServices, setDeletedServices] = useState<any[]>([]);

  const { control, setValue, handleSubmit, getValues } =
    useForm<TSectionForm>();

  const { fields, append } = useFieldArray({
    name: "sections",
    control,
  });

  useEffect(() => {
    const sectionList = _.map(sectionsList, (section) => {
      return {
        id: uuid(),
        title: section.name,
        sectionId: section.id,
        data: section.services,
      };
    });

    setValue("sections", sectionList);
    refetch();
  }, [sectionsList]);

  useImperativeHandle(serviceSectionRef, () => ({
    setDeletedServices: (newDeletedServices) => {
      setDeletedServices(newDeletedServices);
    },
  }));

  const handleChangeValue = (index: number, data: TBudgetService[]) => {
    setValue(`sections.${index}.data`, data);
    clearTimeout(window["timeoutSubmitService"]);
    window["timeoutSubmitService"] = setTimeout(handleValidateServices, 500);
  };

  const handleSaveAllService = () => {
    handleSubmit(onSubmit)();
  };

  const handleValidateServices = () => {
    const sections = getValues("sections");

    const errValidate: TErrors = {};
    let hasError = false;

    sections.map((section, sectionIndex) => {
      if (!errValidate[sectionIndex]) {
        errValidate[sectionIndex] = [];
      }

      section.data.map((item, itemIndex) => {
        // validate item name
        const nameTrimed = item.name.trim();
        if (nameTrimed === "") {
          errValidate[sectionIndex].push({
            errorMgs: "Service name is required!",
            fieldName: "name",
            itemIndex,
          });
          hasError = true;
        }

        // validate item type
        if (item.type === "") {
          errValidate[sectionIndex].push({
            errorMgs: "Service type is required!",
            fieldName: "type",
            itemIndex,
          });
          hasError = true;
        }

        //validate item estimate
        if (item.estimate === "") {
          errValidate[sectionIndex].push({
            errorMgs: "Estimate is required!",
            fieldName: "estimate",
            itemIndex,
          });
          hasError = true;
        }
      });
    });
    setErrors(errValidate);

    return !hasError;
  };

  const onSubmit: SubmitHandler<TSectionForm> = async ({ sections }) => {
    if (!handleValidateServices()) {
      onAddSnackbar("Please insert required field", "error");
      return;
    }

    try {
      const updateSections: any = [];
      const newSections = _.filter(sections, (section) => {
        if (!section?.isNewSection) {
          updateSections.push(section);
        }
        return section?.isNewSection;
      });

      // update sections
      await handleUpdateSections(updateSections);

      // add sections
      if (newSections.length > 0) {
        await createSections(newSections);
      }

      // delete sections
      if (deletedSections.length > 0) {
        deletedSections.map(async (sectionId: string) => {
          await deleteSection(sectionId);
        });
      }

      // delete services
      if (deletedServices.length > 0) {
        deletedServices.map(async (serviceId: string) => {
          await deleteService(serviceId);
        });
      }

      onAddSnackbar("Update services successful!", "success");
      onCloseEdit();
    } catch (err) {
      onAddSnackbar("Update services failed!", "error");
    }
  };

  const openConfirmDelete = (index: number) => {
    setIndexWaitDelete(index);
    openConfirm();
  };

  const cancelConfirmDelete = () => {
    setIndexWaitDelete(null);
    closeConfirm();
  };

  const acceptDelete = () => {
    if (indexWaitDelete || indexWaitDelete === 0) {
      const selectedSection = fields[indexWaitDelete];
      setDeletedSections(
        _.concat(deletedSections, [selectedSection?.sectionId as string]),
      );
      const newSections = _.filter(
        fields,
        (section) => section.id !== selectedSection.id,
      );
      setValue("sections", newSections);
      setIndexWaitDelete(null);
      cancelConfirmDelete();
    }
  };

  const createSections = async (newSections) => {
    const form: TBudgetServiceForm = {
      budget_id: String(budgetId),
      start_date: dayjs().format("YYYY-MM-DD"),
      sections: [],
    };

    _.map(newSections, ({ title, data }) => {
      const service: any = [];

      _.map(data, (item) => {
        let estimate: string[] | number = item.estimate.split(":");
        estimate = parseInt(estimate[0]) * 60 + parseInt(estimate[1]);

        service.push({
          name: item.name,
          desc: "",
          serviceType: item.type,
          billType: item.billingType,
          unit: item.unit,
          estimate: estimate,
          qty: 0,
          price: 0,
          discount: 0,
          markUp: 0,
          tolBudget: 0,
        });
      });

      form.sections.push({ name: title, services: service });
    });

    budgetServiceAdd.mutateAsync(form, {
      onSuccess() {
        onAddSnackbar("Success", "success");
      },
      onError(error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      },
    });
  };

  const handleUpdateSections = async (updateSections) => {
    try {
      const oldServices = _.flattenDeep(
        _.map(sectionsList, (section) => _.get(section, "services", [])),
      );

      const sectionUpdateList: any[] = _.map(updateSections, (section) => {
        const oldSectionData = _.find(
          sectionsList,
          (oldSection) => oldSection.id === section.sectionId,
        );

        const services = _.map(_.get(section, "data", []), (service) => {
          const estimateTime: string[] | number = service?.estimate
            ? service?.estimate?.split(":")
            : [];

          if (service?.isNewService) {
            return {
              name: _.get(service, "name", ""),
              desc: "",
              serviceType: _.get(service, "type", ""),
              billType: _.get(service, "billingType", ""),
              unit: _.get(service, "unit", ""),
              estimate: service?.estimate
                ? parseInt(estimateTime[0]) * 60 + parseInt(estimateTime[1])
                : null,
              qty: 0,
              price: 0,
              discount: 0,
              markUp: 0,
              timeTracking: _.get(service, "timeTracking", false),
              bookingTracking: _.get(service, "bookingTracking", false),
              tolBudget: 0,
              sectionId: _.get(section, "sectionId", ""),
            };
          }

          const oldServiceData = _.find(
            oldServices,
            (oldService) => oldService.id === service?.serviceId,
          );

          return {
            id: _.get(oldServiceData, "id", ""),
            name: _.get(service, "name", ""),
            sectionId: _.get(section, "sectionId", ""),
            desc: _.get(oldServiceData, "desc", ""),
            serviceType: _.get(service, "type", ""),
            billType: _.get(service, "billingType", ""),
            unit: _.get(service, "unit", ""),
            estimate: service?.estimate
              ? parseInt(estimateTime[0]) * 60 + parseInt(estimateTime[1])
              : null,
            qty: _.get(oldServiceData, "qty", 0),
            price: _.get(oldServiceData, "price", 0),
            discount: _.get(oldServiceData, "discount", 0),
            markUp: _.get(oldServiceData, "markUp", 0),
            timeTracking: _.get(service, "timeTracking", false),
            bookingTracking: _.get(service, "bookingTracking", false),
            tolBudget: _.get(oldServiceData, "tolBudget", 0),
          };
        });

        return {
          services: _.compact(services),
          sections: [
            {
              id: _.get(section, "sectionId", ""),
              name: _.get(section, "title", ""),
              start_date: oldSectionData?.start_date
                ? moment(oldSectionData?.start_date).format("YYYY-MM-DD")
                : "",
            },
          ],
        };
      });

      _.forEach(
        sectionUpdateList,
        (sectionUpdate: TBudgetServiceUpdateForm) => {
          budgetServiceUpdate.mutateAsync(sectionUpdate, {});
        },
      );
    } catch (error) {
      onAddSnackbar("Success", "success");
    }
  };

  const deleteSection = async (sectionId: string) => {
    budgetSectionDelete.mutateAsync({
      budgetId: String(budgetId),
      sectionId: sectionId,
    });
  };

  const deleteService = async (serviceId: string) => {
    budgetSectionDelete.mutateAsync({
      budgetId: String(budgetId),
      serviceId: serviceId,
    });
  };

  const onDragEnd = () => {};

  const resetState = () => {
    setDeletedSections([]);
    setDeletedServices([]);
  };

  return (
    <>
      <ScrollViewProvider>
        <Stack direction="row" gap={2} justifyContent="end" p="15px">
          <Button
            sx={{ bgcolor: "primary.light", color: "grey.400" }}
            onClick={() => {
              resetState();
              onCloseEdit();
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSaveAllService}
            sx={{
              bgcolor: "primary.main",
              "&:hover": { bgcolor: "primary.light", color: "primary.main" },
            }}
          >
            Save changes
          </Button>
        </Stack>

        <Box>
          {fields.map((section, index) => (
            <Box key={section.id}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  component="h3"
                  fontSize={24}
                  fontWeight="bold"
                  px={2}
                  py={1}
                  sx={{ color: "grey.300" }}
                >
                  {section.title}
                </Typography>
                <IconButton onClick={() => openConfirmDelete(index)}>
                  <TrashIcon
                    fontSize="medium"
                    sx={{ color: "error.main", cursor: "pointer" }}
                  />
                </IconButton>
              </Stack>
              <Stack
                sx={{
                  height: "max-content",
                }}
              >
                {/* <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    type="section"
                    direction="vertical"
                    droppableId={`sectionList`}
                  >
                    {(provided) => (
                      <Box ref={provided.innerRef} {...provided.droppableProps}>
                        <ServiceSectionRow
                          fieldIndex={index}
                          updateValue={handleChangeValue}
                          errors={errors}
                          serviceData={section?.data || []}
                          sectionId={section.id}
                          deletedServices={deletedServices}
                        />
                      </Box>
                    )}
                  </Droppable>
                </DragDropContext> */}
                <Box>
                  <ServiceSectionRow
                    fieldIndex={index}
                    updateValue={handleChangeValue}
                    errors={errors}
                    serviceData={section?.data || []}
                    sectionId={section.id}
                    deletedServices={deletedServices}
                  />
                </Box>
              </Stack>
            </Box>
          ))}
        </Box>

        <Box>
          <Button
            startIcon={<PlusIcon />}
            size="small"
            sx={{ color: "secondary.main" }}
            onClick={() =>
              append({
                id: uuid(),
                title: "Section " + (fields.length + 1),
                isNewSection: true,
                data: [],
              } as any)
            }
          >
            {budgetT("tabService.section.addSection")}
          </Button>
        </Box>
      </ScrollViewProvider>
      <ConfirmDialog
        open={isOpenConfirm}
        onClose={cancelConfirmDelete}
        onSubmit={acceptDelete}
        title={budgetT("delete.titleConfirmDelete")}
        content={budgetT("delete.contentConfirmDelete")}
      />
    </>
  );
};
