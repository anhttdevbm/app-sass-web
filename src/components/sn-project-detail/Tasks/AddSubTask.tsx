import { Dispatch, SetStateAction, memo, useMemo } from "react";
import { Stack, TextField } from "@mui/material";
import FormLayout from "components/FormLayout";
import { DialogLayoutProps } from "components/DialogLayout";
import { Text } from "components/shared";
import { useTasksOfProject } from "store/project/selectors";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useFormik, FormikErrors } from "formik";
import { useTranslations } from "next-intl";
import { getMessageErrorByAPI } from "utils/index";
import { useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { Status } from "constant/enums";

type MoveTaskListProps = {
  taskListId?: string;
  taskId?: string;
  setIsSubmitting?: Dispatch<SetStateAction<boolean>>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const AddTaskList = (props: MoveTaskListProps) => {
  const { taskListId, taskId, setIsSubmitting, ...rest } = props;

  const { onAddSnackbar } = useSnackbar();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);
  const { onCreateTask } = useTasksOfProject();

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .required(projectT("errors.form.add_sub_task.required")),
  });

  const onSubmit = async (values: typeof INITIAL_VALUES) => {
    if (!taskListId || !taskId) return;
    try {
      await onCreateTask(
        { name: values.name, status: Status.ACTIVE },
        taskListId,
        taskId,
      );
      props.onClose();
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
      }}
      label={projectT("taskDetail.addSubTasks")}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      {...rest}
    >
      <Stack width="100%" spacing={2} py={3}>
        <TextField
          placeholder={projectT("detailTasks.form.title.name")}
          value={formik.values?.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          fullWidth
          variant="filled"
          size="small"
          name="name"
          sx={{
            "& >div": {
              bgcolor: "transparent!important",
            },
            "& input": {
              fontSize: 15,
            },
          }}
        />
        {formik.errors.name && formik.touched.name && (
          <Text variant="caption" color="error">
            {formik.errors.name}
          </Text>
        )}
      </Stack>
    </FormLayout>
  );
};

export default memo(AddTaskList);
const INITIAL_VALUES = {
  name: "",
};
