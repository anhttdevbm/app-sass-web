import {
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Stack } from "@mui/material";
import FormLayout from "components/FormLayout";
import { DialogLayoutProps } from "components/DialogLayout";
import { Select } from "components/shared";
import { useTaskDetail, useTasksOfProject } from "store/project/selectors";
import { NS_COMMON, NS_PROJECT } from "constant/index";
import { useFormik, FormikErrors } from "formik";
import { useTranslations } from "next-intl";
import { getMessageErrorByAPI } from "utils/index";
import { useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { useParams } from "next/navigation";
import { Option } from "constant/types";
import SelectMoveTask from "components/shared/SelectMoveTask";
import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow";

type MoveTaskListProps = {
  oldTaskListIds: string[];
  taskIds: {
    [key: string]: string[];
  };
  setIsSubmitting?: Dispatch<SetStateAction<boolean>>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const MoveTaskList = (props: MoveTaskListProps) => {
  const { oldTaskListIds, taskIds, setIsSubmitting, ...rest } = props;

  const { onAddSnackbar } = useSnackbar();
  const { onMoveTask } = useTasksOfProject();
  const { items } = useTasksOfProject();
  const { onGetTaskList } = useTaskDetail();
  const projectT = useTranslations(NS_PROJECT);
  const commonT = useTranslations(NS_COMMON);

  const [options, setOptions] = useState<Option[]>([]);
  const [searchOptions, setSearchOptions] = useState<Option[]>([]);

  const onSubmit = async (values: typeof INITIAL_VALUES) => {
    try {
      setIsSubmitting && setIsSubmitting(true);
      for (const taskListId of oldTaskListIds) {
        const selected = options.find(
          (option) => option.value === values.task_move,
        );
        const destinationTaskListId = selected?.subText ?? values.task_move;
        await onMoveTask(
          taskListId,
          destinationTaskListId,
          taskIds[taskListId],
          selected?.subText ? values.task_move : undefined,
        );
        await onGetTaskList(taskListId);
        await onGetTaskList(destinationTaskListId);
      }

      onAddSnackbar(
        projectT("detailTasks.notification.moveSuccess"),
        "success",
      );
      props.onClose();
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    } finally {
      setIsSubmitting && setIsSubmitting(false);
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

  useEffect(() => {
    if (items && items.length > 0) {
      const newItems = items.filter((item) => item.id !== oldTaskListIds[0]);
      const itemOptions = newItems.map((item) => {
        const option: Option = {
          label: item.name,
          value: item.id,
        };
        return option;
      });

      setOptions([...itemOptions]);
      setSearchOptions([...itemOptions]);
    }
  }, [items]);

  const onChangeSearch = (name: string, value?: string | number) => {
    if (value) {
      const v = value.toString().trim();

      if (v.length === 0) {
        setSearchOptions([...options]);
      }

      const sOptions = options.filter((option) => option.label.includes(v));
      setSearchOptions([...sOptions]);
    } else {
      setSearchOptions([...options]);
    }
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
      }}
      label={projectT("detailTasks.newMove")}
      submitting={formik.isSubmitting}
      disabled={disabled}
      onSubmit={formik.handleSubmit}
      {...rest}
    >
      <Stack spacing={2} py={3}>
        <SelectMoveTask
          options={searchOptions}
          title={projectT("detailTasks.form.title.newTaskPlace")}
          name="task_move"
          required
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values?.task_move}
          error={commonT(touchedErrors?.task_move, {
            name: projectT("detailTasks.form.title.newTaskPlace"),
          })}
          rootSx={sxConfig.input}
          fullWidth
          showSubText={false}
          hasIcon
          searchProps={{
            value: "",
            placeholder: commonT("searchBy", { name: "list" }),
            name: "task_move",
          }}
          onChangeSearch={onChangeSearch}
          emitSearchWhenEnter={false}
        />
      </Stack>
    </FormLayout>
  );
};

export default memo(MoveTaskList);
const INITIAL_VALUES = {
  task_move: "",
};

const validationSchema = Yup.object().shape({
  task_move: Yup.string().trim().required("form.error.required"),
});

const sxConfig = {
  input: {
    height: 56,
    with: "100% !important",
  },
};
