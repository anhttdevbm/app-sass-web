/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, Stack, Typography } from "@mui/material";
import { Button, IconButton } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { getMessageErrorByAPI, uuid } from "utils/index";
import { ServiceSectionRow } from "./ServiceSectionRow";
import { TErrors, TSection } from "./ServiceUtil";
import {
  createRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
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
import { useBudgetServiceUpdate } from "queries/budgeting/service-update";
import {
  TBudgetSection,
  TBudgetService
} from "components/sn-budgeting/BudgetDetail";
import { ScrollViewProvider } from "components/sn-sales-detail/hooks/useScrollErrorField";
import useTheme from "hooks/useTheme";
import { BudgetServiceBillable, SERVICE_UNIT_OPTIONS } from "constant/enums";

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
  onCloseEdit = () => {},
  refetch = () => {},
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

  const { fields, append } = useFieldArray({
    name: "sections",
    control,
  });

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
  }, [JSON.stringify(sectionsList)]);

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
          isNewService: true
        } as TBudgetService,
      ],
    });
  };

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
      .then(() => {})
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
              sectionId: section?.sectionId
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

  return (
    <>
      <ScrollViewProvider>
        <Box
          sx={{
            position: "sticky !important",
            top: "13%",
            background: isDarkMode ? "#313130" : "white",
            py: 2,
            zIndex: 10,
          }}
        >
          <Stack direction="row" gap={2} justifyContent="end" p="15px">
            <Button
              sx={{ bgcolor: "primary.light", color: "grey.400" }}
              onClick={() => {
                onCloseEdit();
              }}
            >
              {budgetT("tabService.section.cancelBtnText")}
            </Button>
            <Button
              onClick={handleSaveAllService}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.light", color: "primary.main" },
              }}
            >
              {budgetT("tabService.section.saveBtnText")}
            </Button>
          </Stack>
        </Box>

        <ScrollViewProvider>
          <Stack
            sx={{
              height: "max-content",
            }}
          >
            {fields.map((section, index) => {
              return (
                <Stack
                  key={section.id}
                  sx={{
                    boxSizing: "border-box",
                    py: 2,
                    width: "100%",
                  }}
                >
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
                      {section?.name}
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
                    <ServiceSectionRow
                      fieldIndex={index}
                      updateValue={handleChangeValue}
                      errors={errors}
                      serviceData={_.get(section, "services", [])}
                      sectionId={section?.sectionId || ""}
                    />
                  </Stack>
                </Stack>
              );
            })}
          </Stack>
        </ScrollViewProvider>

        <Box>
          <Button
            startIcon={<PlusIcon />}
            size="small"
            sx={{ color: "secondary.main" }}
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
