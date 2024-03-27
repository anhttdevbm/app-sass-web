import {
  CardContent,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DialogLayoutProps } from "components/DialogLayout";
import FormLayout from "components/FormLayout";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { AN_ERROR_TRY_AGAIN, NS_COMMON, NS_CAREER } from "constant/index";
import { FormikErrors, useFormik } from "formik";
import React, { memo, useEffect, useMemo } from "react";
import { useSnackbar } from "store/app/selectors";
import * as Yup from "yup";
import { getMessageErrorByAPI } from "utils/index";
import { DataAction } from "constant/enums";
import { useTranslations } from "next-intl";
import { CareerData } from "store/career/action";
import { CareergDataForm } from "store/career/type";

type FormProps = {
  initialValues: CareergDataForm;
  type: DataAction;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSubmit: (values: CareergDataForm) => Promise<any>;
} & Omit<DialogLayoutProps, "children" | "onSubmit">;

const Form = (props: FormProps) => {
  const { initialValues, type, onSubmit: onSubmitProps, ...rest } = props;
  const { onAddSnackbar } = useSnackbar();
  const careerT = useTranslations(NS_CAREER);
  const commonT = useTranslations(NS_COMMON);

  //ngày tháng năm
  const [value_start_time, setValue_Start_Time] = React.useState<Dayjs | null>(
    dayjs(initialValues.start_time),
  );
  const [value_end_time, setValue_End_Time] = React.useState<Dayjs | null>(
    dayjs(initialValues.end_time),
  );

  const label = useMemo(() => {
    switch (type) {
      case DataAction.CREATE:
        return commonT("createNew");
      case DataAction.UPDATE:
        // console.log(initialValues);
        // console.log("Đã vào đây");
        // console.log(value_start_time);
        // console.log(value_end_time);
        return commonT("update");
      default:
        return "";
    }
  }, [commonT, type]);

  const onSubmit = async (values: CareergDataForm) => {
    try {
      const newItem = await onSubmitProps(values);
      if (newItem) {
        onAddSnackbar(
          careerT("career_success.notification.success_responsed", { label }),
          "success",
        );
        props.onClose();
      } else {
        throw AN_ERROR_TRY_AGAIN;
      }
    } catch (error) {
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: true,
    onSubmit,
  });

  const touchedErrors = useMemo(() => {
    return Object.entries(formik.errors).reduce(
      (out: FormikErrors<CareerData>, [key, error]) => {
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

  //tạo slug
  const createSlugFromName = (name) => {
    const slug = name.toLowerCase().replace(/ /g, "-");
    return slug;
  };
  //lắng nghe thay đổi title rồi sinh slug
  const handleChangeName = (event) => {
    const nameValue = event.target.value;
    // Thực hiện logic để tạo slug từ nameValue
    const slugValue = createSlugFromName(nameValue);
    // Cập nhật giá trị của name và slug trong formik
    formik.setFieldValue("title", nameValue);
    formik.setFieldValue("slug", slugValue);
  };

  //định dạng ngày
  const chuyen_dinh_dang_ngay = (dateString) => {
    const dateObject = new Date(dateString);

    // Lấy thông tin ngày, tháng, năm
    const year = dateObject.getFullYear();
    const month = dateObject.getMonth() + 1;
    const day = dateObject.getDate();

    // Tạo chuỗi mới với định dạng yyyy/mm/dd
    const formattedDate = `${year}/${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}`;
    return formattedDate;
  };

  //lắng nghe thay đổi ngày tháng
  const handleChangeDate = (types, event) => {
    switch (types) {
      case 1:
        const selectedStartDate = chuyen_dinh_dang_ngay(event);
        const selected = chuyen_dinh_dang_ngay(new Date());
        switch (type) {
          case DataAction.CREATE:
            if (
              selectedStartDate >= selected &&
              String(DataAction.CREATE) === "2"
            ) {
              formik.setFieldValue("start_time", selectedStartDate);
            } else {
              setValue_Start_Time(dayjs(new Date()));
              formik.setFieldValue("start_time", dayjs(new Date()));
              onAddSnackbar("Snackbar message here", "error");
            }
            break;
          case DataAction.UPDATE:
            if (
              selectedStartDate >=
                chuyen_dinh_dang_ngay(initialValues.start_time) &&
              String(DataAction.UPDATE) === "3"
            ) {
              formik.setFieldValue("start_time", selectedStartDate);
            } else {
              setValue_Start_Time(dayjs(initialValues.start_time));
              formik.setFieldValue("start_time", initialValues.start_time);
              onAddSnackbar("Snackbar message here", "error");
            }
            break;
          default:
        }
        break;
      case 2:
        const selectedEndDate = chuyen_dinh_dang_ngay(event);
        const selectedStartDates = formik.values.start_time;
        switch (type) {
          case DataAction.CREATE:
            if (
              selectedEndDate >= selectedStartDates &&
              String(DataAction.CREATE) === "2"
            ) {
              formik.setFieldValue("end_time", selectedEndDate);
            } else {
              setValue_End_Time(dayjs(new Date()));
              formik.setFieldValue("end_time", dayjs(new Date()));
              onAddSnackbar("Snackbar message here", "error");
            }
            break;
          case DataAction.UPDATE:
            if (
              selectedEndDate >=
                chuyen_dinh_dang_ngay(initialValues.end_time) &&
              String(DataAction.DETAIL) === "3"
            ) {
              formik.setFieldValue("start_time", selectedEndDate);
            } else {
              setValue_Start_Time(dayjs(initialValues.end_time));
              formik.setFieldValue("start_time", initialValues.end_time);
              onAddSnackbar("Snackbar message here", "error");
            }
            break;
          default:
        }
        break;
      default:
    }
  };

  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 800 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 1200 },
        minHeight: "auto",
        color: "black",
        // overflow: "hidden",
      }}
      label={`${label} ${careerT("title_form")}`}
      onSubmit={formik.handleSubmit}
      disabled={disabled}
      submitting={formik.isSubmitting}
      {...rest}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}></Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label={careerT("form_career.title")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="title"
            onChange={(e) => {
              handleChangeName(e);
              formik.handleChange(e); // Đảm bảo formik cũng nhận được sự thay đổi
            }}
            onBlur={formik.handleBlur}
            value={formik.values?.title}
            error={
              !!commonT(touchedErrors?.title, {
                name: "title",
              })
            }
            helperText={commonT(touchedErrors?.title, {
              name: careerT("form_career.title"),
            })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label={careerT("form_career.slug")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="slug"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.slug}
            error={
              !!commonT(touchedErrors?.slug, {
                name: "responsed_content",
              })
            }
            helperText={commonT(touchedErrors?.slug, {
              name: careerT("form_career.slug"),
            })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={careerT("form_career.start_time")}
              format="DD/MM/YYYY"
              value={value_start_time}
              onChange={(newValue) => {
                handleChangeDate(1, newValue);
              }}
              sx={{
                width: "100%",
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#29c9c1",
                  borderColor: "#29c9c1",
                },
                "& .MuiInputLabel-root": {
                  // Quy tắc cho MuiInputLabel khi không focus
                  color: "#29c9c1",
                  borderColor: "#29c9c1",
                },
                "& .MuiOutlinedInput-root": {
                  "&:hover > fieldset": {
                    borderColor: "#29c9c1",
                  },
                  "& fieldset": {
                    borderColor: "#29c9c1",
                  },
                  height: "45px",
                  borderRadius: "6px",
                  borderColor: "#29c9c1", // Quy tắc cho borderColor khi không hover
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label={careerT("form_career.end_time")}
              format="DD/MM/YYYY"
              value={value_end_time}
              onChange={(newValue) => {
                handleChangeDate(2, newValue);
              }}
              sx={{
                width: "100%",
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#29c9c1",
                  borderColor: "#29c9c1",
                },
                "& .MuiInputLabel-root": {
                  // Quy tắc cho MuiInputLabel khi không focus
                  color: "#29c9c1",
                  borderColor: "#29c9c1",
                },
                "& .MuiOutlinedInput-root": {
                  "&:hover > fieldset": {
                    borderColor: "#29c9c1",
                  },
                  "& fieldset": {
                    borderColor: "#29c9c1",
                  },
                  height: "45px",
                  borderRadius: "6px",
                  borderColor: "#29c9c1", // Quy tắc cho borderColor khi không hover
                },
              }}
            />
          </LocalizationProvider>
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            required
            id="outlined-required"
            label={careerT("form_career.location")}
            fullWidth
            size="small"
            focused
            color="secondary"
            name="location"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.location}
            error={
              !!commonT(touchedErrors?.location, {
                name: "responsed_content",
              })
            }
            helperText={commonT(touchedErrors?.slug, {
              name: careerT("form_career.location"),
            })}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            id="outlined-number"
            label={careerT("form_career.numberOfHires")}
            type="number"
            InputLabelProps={{
              shrink: true,
            }}
            focused
            fullWidth
            size="small"
            color="secondary"
            name="numberOfHires"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.numberOfHires}
            error={
              !!commonT(touchedErrors?.numberOfHires, {
                name: "responsed_content",
              })
            }
            helperText={commonT(touchedErrors?.numberOfHires, {
              name: careerT("form_career.numberOfHires"),
            })}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <TextField
            id="outlined-multiline-static"
            label={careerT("form_career.description")}
            multiline
            focused
            color="secondary"
            required
            name="description"
            rows={4}
            fullWidth
            size="small"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.description}
            error={
              !!commonT(touchedErrors?.description, {
                name: "description",
              })
            }
            helperText={commonT(touchedErrors?.description, {
              name: careerT("form_career.description"),
            })}
          />
        </Grid>
        <Grid item xs={12} md={12}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="is_opening"
            defaultValue={initialValues.is_opening}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values?.is_opening}
          >
            <FormControlLabel
              value="true"
              control={<Radio />}
              label={careerT("form_career.opening")}
            />
            <FormControlLabel
              value="false"
              control={<Radio />}
              label={careerT("form_career.closed")}
            />
          </RadioGroup>
        </Grid>
        <Grid item xs={12} md={12}></Grid>
      </Grid>
    </FormLayout>
  );
};

export default memo(Form);

export const validationSchema = Yup.object().shape({
  title: Yup.string().trim().required("form.error.required"),
  slug: Yup.string().trim().required("form.error.required"),
  location: Yup.string().trim().required("form.error.required"),
  description: Yup.string().trim().required("form.error.required"),
  numberOfHires: Yup.string().trim().required("form.error.required"),
});
