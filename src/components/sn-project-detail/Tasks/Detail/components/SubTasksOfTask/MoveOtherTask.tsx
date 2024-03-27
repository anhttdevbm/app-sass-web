import { memo, useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import FormLayout from "components/FormLayout";
import { DialogLayoutProps } from "components/DialogLayout";
import { Select } from "components/shared";
import { useTaskDetail, useTasksOfProject } from "store/project/selectors";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_PROJECT } from "constant/index";
import { useFormik, FormikErrors } from "formik";
import { useTranslations } from "next-intl";
import { getMessageErrorByAPI } from "utils/index";
import { useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import { Option } from "constant/types";

type MoveOtherTaskProps = {
  subId: string;
  onAfterSubmit?: () => void;
  taskListIdProps?: string;
  taskIdProps?: string;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const MoveOtherTask = (props: MoveOtherTaskProps) => {
  const { subId, taskIdProps, taskListIdProps, ...rest } = props;

  const { onAddSnackbar } = useSnackbar();
  const { items } = useTasksOfProject();
  const {
    task,
    taskListId: taskListIdHook,
    taskId: taskIdHook,
    onChangeParentTask,
    onGetTaskList,
  } = useTaskDetail();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);

  const [taskListId, setTaskListId] = useState<string | undefined>(undefined);
  const [taskId, setTaskId] = useState<string | undefined>(undefined);

  const params = useParams();

  useEffect(() => {
    if (taskIdHook) {
      setTaskId(taskIdHook);
    } else {
      setTaskId(taskIdProps);
    }
    if (taskListIdHook) {
      setTaskListId(taskListIdHook);
    } else {
      setTaskListId(taskListIdProps);
    }
  }, [taskListIdProps, taskIdProps, taskIdHook, taskListIdHook]);

  const options = useMemo(() => {
    if (!taskListId || !taskId) return [];
    return items.reduce((out: Option[], item) => {
      item.tasks.forEach((task) => {
        if (task.id !== taskId) {
          out.push({
            label: task.name,
            value: task.id,
            subText: item.id, // AS TASK LIST ID NEW
          });
        }
      });
      return out;
    }, []);
  }, [items, taskId, taskListId]);

  const onSubmit = async (values: typeof INITIAL_VALUES) => {
    if (!taskListId || !taskId) return;

    const newTaskListId = options.find(
      (item) => item.value === values.task_change,
    )?.subText;
    if (!newTaskListId) {
      throw AN_ERROR_TRY_AGAIN;
    }
    try {
      await onChangeParentTask({
        task_list_current: taskListId,
        task_current: taskId,
        sub_task: subId,
        task_list_change: newTaskListId,
        task_change: values.task_change,
      });
      onAddSnackbar(
        projectT("detailTasks.notification.moveSuccess"),
        "success",
      );
      props.onClose();
      await onGetTaskList(newTaskListId);
      props.onAfterSubmit && props.onAfterSubmit();
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const formik = useFormik({
    initialValues: INITIAL_VALUES,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<typeof INITIAL_VALUES>, [key, error]) => {
        if (formik.touched[key]) {
          out[key] = error;
        }
        return out;
      },
      {},
    );
  }, [formik.touched, formik.errors]);

  const disabled = useMemo(
    () => !!Object.values(touchedErrors)?.length || formik.isSubmitting,
    [touchedErrors, formik.isSubmitting],
  );

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
        zIndex: 1201,
      }}
      label={projectT("taskDetail.changeParentTask")}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      {...rest}
    >
      <Stack spacing={2} py={3}>
        <Select
          options={options}
          title={projectT("taskDetail.form.title.newTask")}
          name="task_change"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.task_change}
          error={commonT(touchedErrors?.task_change, {
            name: projectT("taskDetail.form.title.newTask"),
          })}
          rootSx={sxConfig.input}
          showSubText={false}
          fullWidth
        />
      </Stack>
    </FormLayout>
  );
};

export default memo(MoveOtherTask);
const INITIAL_VALUES = {
  task_change: "",
};

const validationSchema = Yup.object().shape({
  task_change: Yup.string().trim().required("form.error.required"),
});

const sxConfig = {
  input: {
    height: 56,
  },
};
