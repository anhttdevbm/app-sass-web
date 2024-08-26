/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  DialogContent,
  Stack,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import TextFieldSelect from "components/shared/TextFieldSelect";
import { NS_COMMON, NS_TIME_TRACKING } from "constant/index";
import dayjs from "dayjs";
import useTheme from "hooks/useTheme";
import _ from "lodash";
import moment from "moment";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useAuth, useSnackbar } from "store/app/selectors";
import { usePositions } from "store/company/selectors";
import { useProjects } from "store/project/selectors";
import { useGetMyTimeSheet } from "store/timeTracking/selectors";
import { getMessageErrorByAPI } from "utils/index";
import * as yup from "yup";
import { inter } from "../CalendarTracking/CalendarTracking.styles";
import MobileDatePickerComponent from "../components/MobileDatePicker";
import NumberInput from "../components/NumberInput";
import TimePicker from "../components/TimePicker";
import DefaultPopupLayout from "./DefaultPopupLayout";
import { timeCreateInputStyles } from "./timeTrackingModal.styles";
import { WorkType } from "store/timeTracking/reducer";
import Textarea from "components/Textarea";

interface IProps {
  type?: string;
  open: boolean;
  isEdit?: boolean;
  defaultValue?: TimeCreateValue;
  onClose(): void;
  filters?: any;
  currentScreen: "myTime" | "companyTime";
  dateClick?: string;
}

export interface TimeCreateValue {
  id?: string;
  project_id?: string;
  position?: string;
  start_time?: string;
  type?: WorkType;
  day?: string;
  duration?: number;
  note?: string;
}

interface IOptionStructure {
  label: string;
  value: string;
}

const formLabelStyles: SxProps = {
  display: "flex",
  fontSize: "13px",
  fontWeight: "700",
  paddingRight: "5px",
  color: "neutral.700",
  fontFamily: "unset",
  marginBottom: "12px",
};

const TimeCreate = ({
  open,
  onClose,
  filters,
  currentScreen,
  isEdit,
  defaultValue,
  dateClick,
}: IProps) => {
  const { items: projects, onGetProjects } = useProjects();
  const { items: positions, onGetPositions } = usePositions();
  const {
    params,
    onCreateTimeSheet,
    onUpdateTimeSheet,
    onDeleteTimeSheet,
    onGetMyTimeSheet,
    onGetCompanyTimeSheet,
  } = useGetMyTimeSheet();
  const { onAddSnackbar } = useSnackbar();
  const { user: userData } = useAuth();

  const [projectOptions, setProjectOptions] = useState<IOptionStructure[]>([]);
  const [positionOptions, setPositionOptions] = useState<IOptionStructure[]>(
    [],
  );
  const { isDarkMode } = useTheme();

  const schema = yup
    .object({
      project_id: yup.string().trim().notRequired(),
      position: yup.string().trim().required("Position is a required field"),
      start_time: yup
        .string()
        .trim()
        .required("Start time is a required field"),
      type: yup.string().trim().required("Type code is a required field"),
      day: yup.string().trim().required("Date is a required field"),
      duration: yup
        .number()
        .required("Duration is a required field")
        .positive("Duration must be greater than zero")
        .integer("Duration must be an integer")
        .moreThan(0, "Duration must be greater than zero"),
      note: yup.string().trim().notRequired(),
    })
    .required();
  type FormData = yup.InferType<typeof schema>;

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      project_id: "",
      position: "",
      start_time: "",
      type: "",
      day: "",
      duration: undefined,
      note: "",
    },
  });

  useEffect(() => {
    onGetProjects({ pageSize: -1, pageIndex: 0 });
    onGetPositions({ pageSize: -1, pageIndex: 0 });
  }, []);

  useEffect(() => {
    if (isEdit) {
      if (!defaultValue) return;
      const { project_id, day, duration, note, position, start_time, type } =
        defaultValue;

      const validResetData = {
        project_id: project_id || "",
        position: position || "",
        start_time: start_time || "",
        type: type || "",
        day: day || "",
        duration: duration || undefined,
        note,
      };
      reset(validResetData);
    } else {
      setValue("position", userData?.position?.id || "");
    }
  }, [open]);

  useEffect(() => {
    if (!_.isEmpty(projects)) {
      const resolveProjects = _.map(projects, (project) => {
        return {
          label: project?.name,
          value: project?.id,
        };
      });
      setProjectOptions(resolveProjects);
    }
  }, [projects]);

  useEffect(() => {
    if (!_.isEmpty(positions)) {
      const resolvePositions = _.map(positions, (position) => {
        return {
          label: position?.name,
          value: position?.id,
        };
      });
      setPositionOptions(resolvePositions);
    }
  }, [positions]);

  const commonT = useTranslations(NS_COMMON);
  const timeT = useTranslations(NS_TIME_TRACKING);

  const onSubmit = (data: FormData) => {
    const resolveData = {
      ...data,
      project_id: data.type !== "Break time" ? data.project_id : "No Project",
      day: dayjs(data?.day).format("YYYY-MM-DD"),
      start_time: dayjs(data?.start_time)
        .set("date", dayjs(data?.day).date())
        .format("YYYY-MM-DD HH:mm"),
    };

    if (defaultValue?.id) {
      onUpdateTimeSheet({
        ...resolveData,
        id: defaultValue.id,
        project_id: resolveData.project_id as string,
      })
        .then((res) => {
          if (currentScreen === "myTime") {
            onGetMyTimeSheet({ ...params });
          } else {
            onGetCompanyTimeSheet({ ...params });
          }
          onAddSnackbar("Update timesheet success", "success");
          onClose();
        })
        .catch((err) => {
          onAddSnackbar("Update timesheet failure", "error");
          onClose();
        });
    } else {
      onCreateTimeSheet({
        ...resolveData,
        project_id: resolveData.project_id as string,
      })
        .then(() => {
          onAddSnackbar("Create timesheet success", "success");
          onClose();

          if (currentScreen === "myTime") {
            onGetMyTimeSheet({ ...params });
          } else {
            onGetCompanyTimeSheet({ ...params });
          }
        })
        .catch((err) => {
          onAddSnackbar(getMessageErrorByAPI(err, commonT), "error");
        });
    }
  };

  const _renderMain = () => {
    return (
      <DialogContent
        sx={{
          padding: "32px",
          fontFamily: `${inter.style.fontFamily}`,
        }}
      >
        <Stack
          // direction="column"
          component="form"
          sx={{
            marginBottom: "40px",
            backgroundColor: isDarkMode ? "inherit" : "common.white",
          }}
          spacing="20px"
        >
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <div>
                <Typography
                  sx={{
                    ...formLabelStyles,
                  }}
                >
                  {timeT("modal.Type")}
                  <span
                    style={{
                      marginLeft: "2px",
                      color: "#FF2C56",
                    }}
                  >
                    {"*"}
                  </span>
                </Typography>

                <TextFieldSelect
                  options={[
                    { label: timeT("header.tab.workTime"), value: "Work time" },
                    {
                      label: timeT("header.tab.breakTime"),
                      value: "Break time",
                    },
                  ]}
                  sx={{
                    "& > .MuiBox-root": {
                      ...timeCreateInputStyles,
                      "& > div, & > div > .MuiInputBase-root": {
                        height: "100%",
                        background: "transparent",
                      },
                    },
                    "& .MuiSelect-select": {
                      height: "100%",
                    },
                  }}
                  error={Boolean(errors?.type?.message)}
                  helperText={errors?.type?.message}
                  renderValue={(selected) => {
                    return (
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            background:
                              selected === "Work time" ? "#3699FF" : "#F64E60",
                          }}
                        />
                        {selected as string}
                      </Box>
                    );
                  }}
                  {...(field as any)}
                />
              </div>
            )}
          />
          {watch("type") === "Work time" && (
            <Controller
              name="project_id"
              control={control}
              render={({ field }) => (
                <TextFieldSelect
                  options={projectOptions}
                  label={timeT("modal.Project")}
                  sx={{ flex: 1 }}
                  // required
                  error={Boolean(errors?.project_id?.message)}
                  helperText={errors?.project_id?.message}
                  {...(field as any)}
                />
              )}
            />
          )}
          {/* <Controller
            name="position"
            control={control}
            render={({ field }) => (
              <TextFieldSelect
                disabled
                options={positionOptions}
                label={timeT("modal.Position")}
                sx={{ flex: 1 }}
                required
                error={Boolean(errors?.position?.message)}
                helperText={errors?.position?.message}
                {...(field as any)}
              />
            )}
          /> */}
          <Stack
            direction="row"
            sx={{
              display: "flex",
              gap: "12px",
            }}
          >
            <div>
              <Typography
                sx={{
                  ...formLabelStyles,
                }}
              >
                {timeT("modal.Date")}{" "}
                <span
                  style={{
                    marginLeft: "2px",
                    color: "#FF2C56",
                  }}
                >
                  {"*"}
                </span>
              </Typography>
              <Controller
                name="day"
                control={control}
                render={({ field }) => (
                  <MobileDatePickerComponent
                    // label={timeT("modal.Date")}
                    sx={
                      {
                        "& > .MuiBox-root": {
                          ...timeCreateInputStyles,
                          padding: 0,
                          position: "relative",
                          "& > svg": {
                            position: "absolute",
                            top: "50%",
                            right: "20px",
                            transform: "translateY(-50%)",
                            cursor: "pointer",
                          },
                        },
                        "& div": {
                          height: "100%",
                          cursor: "pointer",
                          "& input": {
                            padding: "0 20px",
                          },
                        },
                      } as SxProps<Theme>
                    }
                    // required
                    error={Boolean(errors?.day?.message)}
                    helperText={errors?.day?.message}
                    {...field}
                  />
                )}
              />
            </div>
            <div>
              <Typography
                sx={{
                  ...formLabelStyles,
                }}
              >
                {timeT("modal.start_time")}
                <span
                  style={{
                    marginLeft: "2px",
                    color: "#FF2C56",
                  }}
                >
                  {"*"}
                </span>
              </Typography>

              <Controller
                name="start_time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    sx={
                      {
                        "& > .MuiBox-root": {
                          ...timeCreateInputStyles,
                        },
                        "& .MuiFormControl-root": {
                          cursor: "pointer",
                        },
                      } as SxProps<Theme>
                    }
                    error={Boolean(errors?.start_time?.message)}
                    helperText={errors?.start_time?.message}
                    {...field}
                  />
                )}
              />
            </div>
          </Stack>

          <div>
            <Typography
              sx={{
                ...formLabelStyles,
              }}
            >
              {timeT("modal.timeDuration")}
              <span
                style={{
                  marginLeft: "2px",
                  color: "#FF2C56",
                }}
              >
                {"*"}
              </span>
            </Typography>
            <Controller
              name="duration"
              control={control}
              render={({ field: { onChange, value } }) => {
                return (
                  <NumberInput
                    sx={
                      {
                        "& > .MuiBox-root": {
                          ...timeCreateInputStyles,
                          "& div": {
                            backgroundColor: "transparent",
                            height: "100%",
                          },
                        },
                        "& .MuiFormControl-root": {
                          padding: "4px 20px 4px 0",
                          width: "100%",
                        },
                        "& input": {
                          cursor: "text !important",
                          appearance: "textfield",
                          "&::-webkit-outer-spin-button": {
                            appearance: "none",
                          },
                          "&::-webkit-inner-spin-button": {
                            appearance: "none",
                          },
                        },
                      } as SxProps<Theme>
                    }
                    error={Boolean(errors?.duration?.message)}
                    helperText={errors?.duration?.message}
                    value={value}
                    onChange={onChange}
                  />
                );
              }}
            />
          </div>
          <div>
            <Typography
              sx={{
                ...formLabelStyles,
              }}
            >
              {timeT("modal.Note")}
            </Typography>
            <Controller
              name="note"
              control={control}
              render={({ field }) => (
                <Textarea
                  sx={{
                    flex: 1,
                  }}
                  {...field}
                />
              )}
            />
          </div>
        </Stack>
        <Stack direction="row" justifyContent="center">
          <Button
            variant="outlined"
            sx={{
              width: "168px",
              height: "40px",
              borderRadius: "100px",
              marginRight: "24px",
              paddingLeft: "10px",
              paddingRight: "10px",
              textTransform: "none",
              fontSize: "14px",
              fontFamily: "unset",
              fontWeight: "700",
              color: "#0575E6",
              border: "none",
              background: "transparent",
              "&:hover": {
                border: "none",
              },
              "&::before": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                borderRadius: "100px",
                padding: "1px",
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              },
            }}
            onClick={onClose}
          >
            {timeT("modal.Cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              textTransform: "none",
              width: "168px",
              height: "40px",
              borderRadius: "100px",
              marginRight: "24px",
              paddingLeft: "10px",
              paddingRight: "10px",
              fontSize: "14px",
              fontFamily: "unset",
              fontWeight: "700",
              background: "linear-gradient(90deg, #2af598, #009efd)",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "var(--mui-shadows-2)",
              },
            }}
            onClick={handleSubmit(onSubmit)}
          >
            {timeT("modal.Confirm")}
          </Button>
        </Stack>

        {isEdit && defaultValue?.id && (
          <Stack direction="row" justifyContent="center" sx={{ mt: 1 }}>
            <Button
              variant="outlined"
              sx={{
                width: "150px",
                marginRight: "24px",
                borderColor: "error.light",
                color: "error.main",
                "&:hover": {
                  borderColor: "error.main",
                  color: "error.main",
                },
              }}
              onClick={() => {
                defaultValue.id &&
                  onDeleteTimeSheet({ id: defaultValue.id })
                    .then(() => {
                      onAddSnackbar("Delete timesheet success", "success");
                      onClose();
                      onGetMyTimeSheet({ ...params });
                    })
                    .catch((err) => {
                      onAddSnackbar("Delete timesheet failed", "error");
                      onClose();
                    });
              }}
            >
              {timeT("modal.Delete")}
            </Button>
          </Stack>
        )}
      </DialogContent>
    );
  };
  return (
    <DefaultPopupLayout
      title={
        defaultValue?.id ? timeT("modal.edit_time") : timeT("modal.add_time")
      }
      content={_renderMain()}
      open={open}
      onClose={onClose}
      sx={{
        width: "500px",
        maxHeight: "100vh",
        overflow: "hidden",
        borderRadius: "24px",
      }}
    />
  );
};

export default TimeCreate;
