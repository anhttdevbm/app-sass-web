/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack } from "@mui/material";
import ConfirmDialog from "components/ConfirmDialog";
import { Button, IconButton, Input, Text } from "components/shared";
import {
  TBudgetSection,
  TBudgetService,
} from "components/sn-budgeting/BudgetDetail";
import { ScrollViewProvider } from "components/sn-sales-detail/hooks/useScrollErrorField";
import { BudgetServiceBillable, SERVICE_UNIT_OPTIONS } from "constant/enums";
import { NS_BUDGETING, NS_COMMON } from "constant/index";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import useToggle from "hooks/useToggle";
import MoveDotIcon from "icons/MoveDotIcon";
import PlusIcon from "icons/PlusIcon";
import TrashIcon from "icons/TrashIcon";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useBudgetSectionDelete } from "queries/budgeting/section-delete";
import {
  TBudgetServiceForm,
  useBudgetServiceAdd,
} from "queries/budgeting/service-add";
import { useBudgetServiceUpdate } from "queries/budgeting/service-update";
import {
  createRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
  ResponderProvided,
} from "react-beautiful-dnd";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI, uuid } from "utils/index";
import ServiceSectionRow from "./ServiceSectionRow";
import { TErrors, TSection } from "./ServiceUtil";

type Props = {
  sectionsList: TBudgetSection[];
  onCloseEdit?: () => void;
  refetch?: () => void;
};

export type TSectionForm = {
  sections: (TSection & {
    services: (TBudgetService & { estimateTime?: string })[];
    sectionId?: string;
    isNewSection?: boolean;
    deletedServices?: string[];
    start_date?: string;
  })[];
  deletedSections?: string[];
};

const defaultValues: TSectionForm = {
  sections: [],
  deletedSections: [],
};

export const serviceSectionRef = createRef<any>();

export const ServiceSection = ({
  onCloseEdit = () => { },
  refetch = () => { },
  sectionsList = [],
}: Props) => {
  const { id: budgetId } = useParams();
  const { onAddSnackbar } = useSnackbar();
  const { isDarkMode } = useTheme();

  const commonT = useTranslations(NS_COMMON);
  const budgetT = useTranslations(NS_BUDGETING);

  const budgetServiceAdd = useBudgetServiceAdd();
  const budgetServiceUpdate = useBudgetServiceUpdate();
  const budgetSectionDelete = useBudgetSectionDelete();

  const [isOpenConfirm, openConfirm, closeConfirm] = useToggle();
  const [errors, setErrors] = useState<TErrors>({});
  const [indexWaitDelete, setIndexWaitDelete] = useState<number | null>(null);

  const { control, setValue, handleSubmit, getValues, watch, reset } =
    useForm<TSectionForm>({
      defaultValues,
    });

  const { fields, append, swap } = useFieldArray({
    name: "sections",
    control,
  });

  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);
  const sectionsRef = useRef(fields);
  
  useEffect(() => {
    const sectionList = _.map(sectionsList, (section: any) => {
      return {
        id: uuid(),
        name: section.name,
        sectionId: section.id,
        services: _.map(_.get(section, "services", []), (service) => {
          let estimate = 0;
          let hour = 0;
          let minute = 0;
          if (service?.estimateTime) {
            const split = service?.estimateTime?.split(":");
            hour = parseInt(split[0]);
            minute = parseInt(split[1]);
            estimate = hour * 60 + minute;
          } else {
            estimate = Number(service?.estimate) || 0;
            hour = Math.floor(estimate / 60);
            minute = estimate - hour * 60;
          }

          return {
            ...service,
            id: uuid(),
            serviceId: service?.id || "",
            estimate,
            estimateTime: dayjs().hour(hour).minute(minute).toString(),
            billType: _.get(
              service,
              "billType",
              BudgetServiceBillable.BILLABLE,
            ),
            sectionId: section?.id,
            isNewService: _.get(service, "isNewService", false),
          };
        }),
        start_date: section.start_date,
        isNewSection: false,
        deletedServices: [],
      } as any;
    });

    setValue("sections", sectionList);
    sectionsRef.current = sectionList;
  }, [sectionsList, setValue]);

  useImperativeHandle(serviceSectionRef, () => ({
    setDeletedServices: (deletedService = "", sectionIndex: number) => {
      const deletedServiceList =
        watch(`sections.${sectionIndex}.deletedServices`) || [];

      setValue(
        `sections.${sectionIndex}.deletedServices`,
        _.concat(deletedServiceList, [deletedService]),
      );

      setValue(
        `sections.${sectionIndex}.services`,
        _.filter(
          watch("sections")[sectionIndex]?.services || [],
          (service: any) => {
            if (service.serviceId) {
              return service.serviceId !== deletedService;
            }

            return service.id !== deletedService;
          },
        ),
      );
    },
    getDeletedServices: (sectionIndex: number) => {
      return watch(`sections.${sectionIndex}.deletedServices`);
    },
  }));

  const debounceValidation = useCallback(
    _.debounce(() => {
      handleValidateServices();
    }, 500),
    [],
  );

  const onAddSection = () => {
    append({
      id: uuid(),
      name: "Section " + (fields.length + 1),
      isNewSection: true,
      services: [
        {
          id: uuid(),
          name: "",
          desc: "",
          serviceType: null,
          billType: BudgetServiceBillable.BILLABLE,
          unit: SERVICE_UNIT_OPTIONS.HOUR,
          estimate: 0,
          qty: 0,
          price: 0,
          discount: 0,
          markUp: 0,
          timeTracking: false,
          bookingTracking: false,
          tolBudget: 0,
          sectionId: "",
          isNewService: true,
        } as TBudgetService,
      ],
    });
  };



  const handleSectionNameChange = useCallback((index: number, newName: string) => {
    sectionsRef.current[index].name = newName;
    setValue("sections", sectionsRef.current, { shouldDirty: true });
  }, [setValue]);
  
  const handleSectionClick = useCallback((index: number) => {
    setEditingSectionIndex(index);
  }, []);
  
  const handleSectionNameBlur = useCallback(() => {
    setEditingSectionIndex(null);
  }, []);

  const handleChangeValue = (index: number, services: TBudgetService[]) => {
    setValue(`sections.${index}.services`, services);
    debounceValidation();
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

      _.map(_.get(section, "services", []), (item, itemIndex) => {
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
        if (item.serviceType === "") {
          errValidate[sectionIndex].push({
            errorMgs: "Service type is required!",
            fieldName: "serviceType",
            itemIndex,
          });
          hasError = true;
        }

        //validate item estimate
        if (item.estimate === null) {
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

  const onSubmit: SubmitHandler<TSectionForm> = async ({
    sections,
    deletedSections,
  }: TSectionForm) => {
    if (!handleValidateServices()) {
      onAddSnackbar("Please insert required field", "error");
      return;
    }

    const updateSections: (TBudgetSection & { sectionId: string })[] = [];
    let deletedServices: string[] = [];
    const newSections = _.filter(sections, (section) => {
      if (!section?.isNewSection) {
        updateSections.push(section as TBudgetSection & { sectionId: string });
        deletedServices = _.concat(
          deletedServices,
          _.get(section, "deletedServices", []),
        );
      }

      return section?.isNewSection;
    });

    // delete sections
    Promise.all(
      _.map(deletedSections || [], (sectionId: string) => {
        deleteSection(sectionId);
      }),
    )
      .then(() => {
        // delete services
        Promise.all(
          _.map(deletedServices, (serviceId: string) => {
            deleteService(serviceId);
          }),
        );
      })
      .then(() => {
        // add sections
        if (newSections.length > 0) {
          new Promise((resolver) => {
            createSections(newSections);

            return resolver(true);
          });
        }
      })
      .then(() => {
        // update sections
        if (updateSections.length > 0) {
          new Promise((resolver) => {
            handleUpdateSections(updateSections);
            return resolver(true);
          });
        }
      })
      .then(() => { })
      .catch((err) => {
        onAddSnackbar("Update services failed!", "error");
      });
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
      const newSections = _.filter(
        fields,
        (section) => section.id !== selectedSection.id,
      );
      const deletedSections =
        (getValues("deletedSections") as Array<string>) || [];

      setValue("sections", newSections);

      if (!selectedSection.isNewSection) {
        setValue(
          "deletedSections",
          _.concat(deletedSections, [sectionsList[indexWaitDelete]?.id]),
        );
      }

      setIndexWaitDelete(null);
    }
    cancelConfirmDelete();
  };

  const createSections = async (newSections) => {
    const form: TBudgetServiceForm = {
      budget_id: String(budgetId),
      start_date: dayjs().format("YYYY-MM-DD"),
      sections: _.flattenDeep(
        _.map(newSections || [], (section: TBudgetSection) => {
          return {
            name: section.name,
            services: _.map(_.get(section, "services", []), (service: any) => {
              const newService = _.cloneDeep(service);

              delete newService["id"];
              delete newService["serviceId"];
              delete newService["sectionId"];
              delete newService["isNewService"];
              delete newService["estimateTime"];

              return newService;
            }),
          };
        }),
      ) as any,
    };

    budgetServiceAdd.mutateAsync(form, {
      onError(error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      },
    });
  };

  const handleUpdateSections = async (
    updateSections: (TBudgetSection & { sectionId: string })[],
  ) => {
    try {
      const sectionUpdateList: any[] = [];
      const serviceUpdateList: any[] = [];

      _.map(updateSections, (section) => {
        sectionUpdateList.push({
          id: _.get(section, "sectionId", ""),
          name: _.get(section, "name", ""),
          start_date: _.get(section, "start_date", ""),
        });

        _.forEach(_.get(section, "services", []), (service) => {
          let serviceParams: any = {};

          if (service?.isNewService) {
            serviceParams = _.cloneDeep(service);
            delete serviceParams["id"];
          } else {
            serviceParams = {
              ...service,
              id: service?.serviceId,
              sectionId: section?.sectionId,
            };
          }

          delete serviceParams["estimateTime"];
          delete serviceParams["isNewService"];
          delete serviceParams["section"];
          delete serviceParams["_id"];
          delete serviceParams["__v"];

          serviceUpdateList.push(serviceParams);
        });
      });

      budgetServiceUpdate.mutateAsync(
        {
          services: serviceUpdateList,
          sections: sectionUpdateList,
        },
        {
          onSuccess: () => {
            onAddSnackbar("Update services successful!", "success");
            reset(defaultValues);
            onCloseEdit();
          },
        },
      );
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
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

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { destination, source, draggableId } = result;

    const sectionList = [...getValues("sections")];

    if (!destination) return;

    // Swap section
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

    // Swap items in section
    if (desSectionId === sourceSectionId) {
      const section = sectionList[desSectionIndex];
      const tmp = section.services[source.index];
      section.services[source.index] = section.services[destination.index];
      section.services[destination.index] = tmp;
      setValue("sections", sectionList, { shouldDirty: true });
      return;
    }

    // Swap items to another section
    const desSection = sectionList[desSectionIndex];
    const sourceSection = sectionList[sourceSectionIndex];
    const draggable = sourceSection.services[source.index];
    sourceSection.services.splice(source.index, 1);
    desSection.services.splice(destination.index, 0, draggable);
    setValue("sections", sectionList, { shouldDirty: true });
  };

  return (
    <>
      <ScrollViewProvider>
        {/* Edit top actions: Cancel - Save */}
        <Box
          sx={{
            position: "sticky !important",
            top: "0%",
            background: isDarkMode ? "#313130" : "white",
            zIndex: 20,
            padding: "6px 0"
          }}
        >
          <Stack direction="row" gap={2} justifyContent="end" height={40}>
            <Button
              variant="primaryOutlined"
              sx={{
                ...defaultSx.button,
                borderRadius: "100px",
                "&:hover": {
                  borderColor: "#3699FF",
                },
              }}
              size="small"
              onClick={() => {
                onCloseEdit();
              }}
            >
              <Text fontSize={12} fontWeight={700} color="#0575E6">{budgetT("tabService.section.cancelBtnText")} </Text>
            </Button>
            <Button
              variant="primary"
              onClick={handleSaveAllService}
              size="small"
              sx={{
                ...defaultSx.button,
                bgcolor: "primary.main",
                borderRadius: "100px",
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                "&:hover": {
                  background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                },
              }}
            >
              <Text fontSize={12} fontWeight={700} color="#fff">{budgetT("tabService.section.saveBtnText")}</Text>
            </Button>
          </Stack>
        </Box>

        {/* List editable section */}
        <ScrollViewProvider>
          <Stack
            sx={{
              height: "max-content",
              px: 2,
              backgroundColor: "common.white",
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
                    {fields.map((section, index) => {
                      return (
                        <Draggable
                          draggableId={section.id}
                          key={section.id}
                          index={index}
                          isDragDisabled={false}
                        >
                          {(providedInner) => (
                            <Stack
                              sx={{
                                boxSizing: "border-box",
                                width: "100%",
                                backgroundColor: "common.white",
                                // mt: 2,
                              }}
                              ref={providedInner.innerRef}
                              {...providedInner.draggableProps}
                            >
                              <Stack
                                direction="column"
                                spacing={2}
                                {...providedInner.dragHandleProps}
                              >
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  alignItems="center"
                                >
                                  <Stack
                                    direction={{
                                      xs: "column",
                                      sm: "row",
                                    }}
                                    alignItems="center"
                                    // py={1}
                                  >
                                    <IconButton noPadding>
                                      <MoveDotIcon />
                                    </IconButton>
                                    {/* <Typography
                                      component="h3"
                                      fontSize={20}
                                      fontWeight="bold"
                                      px={2}
                                      sx={{ color: "grey.300" }}
                                    >
                                      {section?.name}
                                    </Typography> */}
                                    {editingSectionIndex === index ? (
                                      <Input
                                        value={section.name}
                                        onChange={(e) => handleSectionNameChange(index, e.target.value)}
                                        onBlur={handleSectionNameBlur}
                                        variant="outlined"
                                        size="small"
                                        autoFocus
                                        sx={{ mx: 2, width: "200px" }}
                                      />
                                    ) : (
                                      <Text
                                        component="h3"
                                        fontSize={20}
                                        fontWeight="bold"
                                        px={2}
                                        sx={{ color: "grey.300", cursor: "pointer" }}
                                        onClick={() => handleSectionClick(index)}
                                      >
                                        {section.name || `Section ${index + 1}`}
                                      </Text>
                                  )}

                                    <IconButton
                                      onClick={() => openConfirmDelete(index)}
                                    >
                                      <TrashIcon
                                        fontSize="medium"
                                        sx={{
                                          color: "error.main",
                                          cursor: "pointer",
                                        }}
                                      />
                                    </IconButton>

                                  </Stack>

                                </Stack>
                                <Stack
                                  sx={{
                                    height: "max-content",
                                  }}
                                >
                                  <ServiceSectionRow
                                    fieldIndex={index}
                                    updateValue={handleChangeValue}
                                    errors={errors}
                                    serviceData={_.get(section, "services", [])}
                                    sectionId={section?.sectionId || ""}
                                  />
                                </Stack>
                              </Stack>
                            </Stack>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
        </ScrollViewProvider>

        <Box>
          <Button
            startIcon={<PlusIcon />}
            size="small"
            sx={{
              borderRadius: "100px",
              background: "#D9F0FD",
              "&:hover": {
                background: "#D9F0FD",
              },
              color: "#0575E6",
              fontWeight: "700",
            }}
            onClick={onAddSection}
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

const defaultSx = {
  root: {
    minWidth: { xs: "calc(100vw - 24px)", sm: 850 },
    zIndex: 50,
  },
  bottom: {
    pt: 3,
    pb: 0,
    px: 3,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    borderBottom: "1px solid",
    borderColor: "grey.100",
    pb: 3,

    "& > button": {
      top: 0,
      transform: "unset",
    },
  },
  button: {
    minWidth: 120,
    height: "40px",
    // width : "120px" ,
    // // minHeight: 40

  },
};
