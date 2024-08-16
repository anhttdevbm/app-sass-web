import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  CircularProgress,
  Collapse,
  FormHelperText,
  SelectChangeEvent,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import SelectController from "components/SelectController";
import { Button, Tooltip } from "components/shared";
import TextFieldInput from "components/shared/TextFieldInput";
import TextFieldSelect from "components/shared/TextFieldSelect";
import { TBudgetService } from "components/sn-budgeting/BudgetDetail";
import CustomDateRangePicker from "components/sn-resource-planing/components/CustomDateRangePicker";
import { useCalculateDetail } from "components/sn-resource-planing/hooks/useCalculateDetail";
import useGetOptions from "components/sn-resource-planing/hooks/useGetOptions";
import Textarea from "components/sn-time-tracking/Component/Textarea";
import TextStatus from "components/TextStatus";
import { RESOURCE_ALLOCATION_TYPE, RESOURCE_EVENT_TYPE } from "constant/enums";
import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import dayjs from "dayjs";
import ArrowDownIcon from "icons/ArrowDownIcon";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Control, Controller, useForm } from "react-hook-form";
import { usePositions } from "store/company/selectors";
import { TBudget } from "store/project/budget/action";
import { useMembersOfProject } from "store/project/selectors";
import { BookingData } from "store/resourcePlanning/action";
import {
  useBookingAll,
  useGetServiceBudget,
} from "store/resourcePlanning/selector";
import { debounce, formatNumber } from "utils/index";
import { useGetSchemas } from "../Schemas";

interface IProps {
  open: boolean;
  onClose(): void;
  resourceId: string;
  selectedDateRange?: Date[];
  userId?: string;
}

const ProjectTab = ({
  open,
  onClose,
  resourceId,
  userId,
  selectedDateRange,
}: IProps) => {
  const [isShowDetail, setIsShowDetail] = useState(false);
  const [isFocusAllocation, setIsFocusAllocation] = useState(false);
  const [isShowTooltip, setIsShowTooltip] = useState(false);
  const [listBudgets, setListBudgets] = useState<TBudget[] | []>([]);
  const [listServices, setListServices] = useState<
    { value: string; label: string }[] | []
  >([]);

  const { palette } = useTheme();
  const { projectOptions, timeOptions } = useGetOptions();
  const { createBooking, loading } = useBookingAll();
  const { schemaProject } = useGetSchemas();
  const commonT = useTranslations(NS_COMMON);
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const {
    control: controlProject,
    handleSubmit: handleSubmitProject,
    watch: watchProject,
    reset: resetProject,
    formState: { errors: errorsProject },
  } = useForm({
    resolver: yupResolver(schemaProject),
    defaultValues: {
      project_id: "",
      service_id: "",
      dateRange: {
        startDate: selectedDateRange?.[0] || undefined,
        endDate: selectedDateRange?.[1] || undefined,
      },
      allocation: 1,
      allocation_type: RESOURCE_ALLOCATION_TYPE.HOUR,
      note: "",
      role: "",
    },
    mode: "all",
  });
  const { workedTime, estimate, leftToSchedule, scheduledTime } =
    useCalculateDetail(
      watchProject("service_id"),
      watchProject("project_id"),
      resourceId,
    );
  const {
    setProjectId,
    queries,
    setQueries,
    serviceBudgetOptions,
    getBudgetsByIdProject,
    getServiceByBudgetQueries,
  } = useGetServiceBudget();

  const { items } = usePositions();

  const { items: currListMember, onGetMembersOfProject } =
    useMembersOfProject();

  const listRoles = useMemo(() => {
    return items?.map((item) => ({ value: item.id, label: item.name }));
  }, [items]);

  const listMembers = useMemo(() => {
    return currListMember?.map((item) => ({
      value: item.id,
      label: item.fullname,
    }));
  }, [currListMember]);

  const onSubmitProject = async (data) => {
    const cleanData: BookingData = {
      ...data,
      user_id: data?.user_id,
      start_date: dayjs(data.dateRange.startDate).format("YYYY-MM-DD"),
      end_date: dayjs(data.dateRange.endDate).format("YYYY-MM-DD"),
      booking_type: RESOURCE_EVENT_TYPE.PROJECT_BOOKING,
    };
    await createBooking(cleanData).then(() => {
      onClose();
      resetProject();
    });
  };

  useEffect(() => {
    if (!watchProject("service_id")) {
      setIsShowDetail(false);
    }
  }, [watchProject("service_id"), isShowDetail]);

  const handleChangeProjectId = async () => {
    if (watchProject("project_id")) {
      setProjectId(watchProject("project_id"));
      onGetMembersOfProject(watchProject("project_id"), {});
      const res = await getBudgetsByIdProject(watchProject("project_id"));

      if (res.status === 200) {
        const convertValue = res.data?.map((item: TBudgetService) => ({
          value: item.id,
          label: item.name,
        }));
        setListBudgets(convertValue);
      }
    }
  };

  const handleChangeBudget = async (
    event: SelectChangeEvent<string | number>,
  ) => {
    if (event.target.value) {
      const res = await getServiceByBudgetQueries(
        event.target.value.toString(),
      );
      const convertValue = res.data?.map((item: TBudgetService) => ({
        value: item.id,
        label: item.name,
      }));
      if (res.status === 200) {
        setListServices(convertValue);
      }
    }
  };

  useEffect(() => {
    handleChangeProjectId();
  }, [watchProject("project_id")]);

  const onScroll = debounce((e: any) => {
    const { scrollTop, clientHeight, scrollHeight } = e.target;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setQueries({
        ...queries,
        pageIndex: (queries.pageIndex ?? 0) + 1,
      });
    }
  }, 250);

  return (
    <Grid2 container spacing={2} sx={{ mt: 1 }}>
      <Grid2 xs={12}>
        <SelectController
          name="project_id"
          control={controlProject as unknown as Control}
          listOptions={projectOptions}
          label={resourceT("form.project")}
          required
          sx={{
            borderRadius: "100px",
            background:
              "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#EFEFEF",
            },
          }}
          MenuProps={{
            sx: {
              maxHeight: "400px",
            },
          }}
        />
      </Grid2>
      <Grid2 xs={12}>
        <SelectController
          control={controlProject as unknown as Control}
          name={"budget_id"}
          label={resourceT("form.budget")}
          handleChange={handleChangeBudget}
          listOptions={listBudgets}
          sx={{
            borderRadius: "100px",
            background:
              "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#EFEFEF",
            },
          }}
        />
      </Grid2>

      <Grid2 xs={12}>
        <SelectController
          name="service_id"
          control={controlProject as unknown as Control}
          listOptions={listServices}
          disabled={!watchProject("project_id")}
          label={resourceT("form.services")}
          required
          sx={{
            borderRadius: "100px",
            background:
              "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#EFEFEF",
            },
          }}
          MenuProps={{
            PaperProps: {
              onScroll: onScroll,
            },
            sx: {
              maxHeight: "400px",
            },
          }}
        />
      </Grid2>
      <Grid2 xs={12}>
        <SelectController
          control={controlProject as unknown as Control}
          name={"user_id"}
          label={resourceT("form.user")}
          listOptions={listMembers || []}
          required
          sx={{
            borderRadius: "100px",
            background:
              "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#EFEFEF",
            },
          }}
        />
      </Grid2>
      <Grid2 xs={12}>
        <SelectController
          control={controlProject as unknown as Control}
          name={"role"}
          label={resourceT("form.role")}
          listOptions={listRoles || []}
          required
          sx={{
            borderRadius: "100px",
            background:
              "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: "#EFEFEF",
            },
          }}
        />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <Controller
          name="dateRange"
          control={controlProject}
          render={({ field }) => (
            <div>
              <Typography
                color={"#4D4D4D"}
                fontSize={13}
                pb={2}
                fontWeight={700}
              >
                {resourceT("form.dateRange")}
                <span style={{ color: "#FF2C56", paddingLeft: 4 }}>*</span>
              </Typography>
              <CustomDateRangePicker
                value={field.value}
                onChange={(value) => {
                  field.onChange(value);
                }}
                // label={resourceT("form.dateRange")}
                placeholder=""
                errorMessage={
                  errorsProject.dateRange?.startDate?.message ||
                  errorsProject.dateRange?.endDate?.message
                }
                sx={{
                  width: "100%",

                  ".MuiBox-root": {
                    borderColor: "#EFEFEF",
                    borderRadius: "100px",
                    height: 56,
                    display: "block",
                    padding: "16px 12px",
                    background:
                      "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
                  },
                  ".MuiSvgIcon-root": {
                    color: "#B3B3B3",
                  },
                }}
              />
            </div>
          )}
        />
      </Grid2>
      <Grid2 xs={12} md={6}>
        <Grid2 xs={12} md={6}>
          <Typography color={"#4D4D4D"} fontSize={13} pb={2} fontWeight={700}>
            {resourceT("form.allocation")}
            <span style={{ color: "#FF2C56", paddingLeft: 4 }}>*</span>
          </Typography>
          <Stack
            direction="row"
            sx={{
              ".text-field-input-container, .text-field-select-container": {
                border: `1px solid transparent`,
                transition: "border-color 0.3s ease",
              },
              border: `1px solid ${
                isFocusAllocation ? palette.primary.main : "#EFEFEF"
              }`,
              "&:focus-within": {
                borderColor: palette.primary.main,
              },
              background:
                "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
              borderRadius: "100px",
              justifyContent: "space-between",
            }}
          >
            <Controller
              name="allocation"
              control={controlProject}
              render={({ field }) => (
                <TextFieldInput
                  placeholder="8h"
                  sx={{
                    "& > .MuiBox-root": {
                      background: "transparent",
                    },
                    flex: "1 1 0%",
                    ".MuiInputBase-input": {
                      height: 32,
                    },
                  }}
                  type="number"
                  error={!!errorsProject.allocation?.message}
                  {...field}
                />
              )}
            />

            <Controller
              name="allocation_type"
              control={controlProject}
              render={({ field }) => (
                <TextFieldSelect
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(event.target.value);
                  }}
                  sx={{
                    "& > .MuiBox-root": {
                      background: "transparent",
                      borderColor: "transparent",
                    },
                    "& .MuiInputBase-root": {
                      background: "transparent",
                      color: "#00000080",
                    },
                  }}
                  options={timeOptions}
                  onFocus={() => setIsFocusAllocation(true)}
                  onBlur={() => setIsFocusAllocation(false)}
                />
              )}
            />
          </Stack>
          {errorsProject.allocation?.message && (
            <FormHelperText
              sx={{ color: "rgba(246, 78, 96, 1)", marginLeft: "18px" }}
            >
              {errorsProject.allocation?.message}
            </FormHelperText>
          )}
        </Grid2>
      </Grid2>
      <Grid2 xs={12}>
        <Typography color={"#4D4D4D"} fontSize={13} pb={2} fontWeight={700}>
          {resourceT("form.note")}
        </Typography>
        <Controller
          name="note"
          control={controlProject}
          render={({ field }) => {
            return (
              <Textarea
                {...field}
                sx={{
                  ".MuiFormControl-root, .MuiFormLabel-root": {
                    background:
                      "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
                  },
                  ".MuiInputBase-input, .MuiInputBase-root": {
                    background: "transparent",
                  },
                }}
              />
            );
          }}
        />
      </Grid2>

      <Grid2 xs={12}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setIsShowDetail(!isShowDetail)}
        >
          <TextStatus
            sx={{
              p: "4px 10px",
              fontSize: 12,
              fontWeight: 600,
              lineHeight: "18px",
              width: "max-content",
            }}
            text=""
            color={leftToSchedule > 0 ? "success" : "error"}
          >
            {watchProject("service_id")
              ? formatNumber(leftToSchedule, { numberOfFixed: 0 }) || 0
              : 0}
            h {resourceT("form.leftToSchedule").toLowerCase()}
          </TextStatus>
          <Tooltip
            title="Service is not selected"
            placement="top"
            arrow
            open={isShowTooltip}
            onClose={() => setIsShowTooltip(false)}
            onOpen={() => {
              if (!watchProject("service_id")) {
                setIsShowTooltip(true);
              }
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
              <Typography
                sx={{
                  color: "#666666",
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: "18px",
                  width: "max-content",
                }}
              >
                {resourceT("form.detail")}
              </Typography>
              <ArrowDownIcon
                sx={{
                  transform: isShowDetail ? "rotate(-90deg)" : "rotate(0deg)",
                  transition: "transform 0.3s ease",
                  width: 16,
                  height: 16,
                  color: "#666666",
                }}
              />
            </Box>
          </Tooltip>
        </Box>
        <Collapse
          in={isShowDetail}
          sx={{
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
              mt: 2,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: "22px",
                fontWeight: 400,
                color: "#666666",
                display: "block",
              }}
            >
              {resourceT("form.estimate")}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: "18px",
                fontWeight: 600,
                color: "#212121",
                display: "block",
              }}
            >
              {formatNumber(estimate, { numberOfFixed: 0 })}h
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: "22px",
                fontWeight: 400,
                color: "#666666",
                display: "block",
              }}
            >
              {resourceT("form.work")}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: "18px",
                fontWeight: 600,
                color: "#212121",
                display: "block",
              }}
            >
              {formatNumber(workedTime, { numberOfFixed: 0 })}h
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: "22px",
                fontWeight: 400,
                color: "#666666",
                display: "block",
              }}
            >
              {resourceT("form.schedule")}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: "18px",
                fontWeight: 600,
                color: "#212121",
                display: "block",
              }}
            >
              {formatNumber(scheduledTime, { numberOfFixed: 0 })}h
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: "22px",
                fontWeight: 400,
                color: "#666666",
              }}
            >
              {resourceT("form.leftToSchedule")}
            </Typography>
            <Typography
              sx={{
                fontSize: 14,
                lineHeight: "18px",
                fontWeight: 600,
                color: leftToSchedule > 0 ? "green" : "#F64E60",
              }}
            >
              {formatNumber(leftToSchedule, { numberOfFixed: 0 })}h
            </Typography>
          </Box>
        </Collapse>
      </Grid2>
      <Grid2
        xs={12}
        sx={{
          position: "sticky",
          bottom: 0,
          pb: 2,
          pt: 1,
          backgroundColor: "background.paper",
        }}
      >
        <Stack direction="row" justifyContent="center" gap={3}>
          <Button
            variant="primaryOutlined"
            size="medium"
            onClick={onClose}
            sx={{
              width: 150,
              height: 40,
              borderRadius: 100,
              color: "#0575E6",
              border: "3px solid",
              "border-image-source":
                "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
            }}
          >
            {commonT("form.cancel")}
          </Button>
          <Button
            sx={{
              width: 160,
              height: 40,
              color: "white",
              borderRadius: 100,
              "&.MuiButton-root": {
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
              },
            }}
            variant="contained"
            onClick={handleSubmitProject(onSubmitProject)}
          >
            {loading ? (
              <CircularProgress color="inherit" size={24} />
            ) : (
              resourceT("form.createBooking")
            )}
          </Button>
        </Stack>
      </Grid2>
    </Grid2>
  );
};

export default ProjectTab;
