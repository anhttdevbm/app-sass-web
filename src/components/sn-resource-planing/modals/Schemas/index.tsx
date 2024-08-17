import { NS_COMMON, NS_RESOURCE_PLANNING } from "constant/index";
import { useTranslations } from "next-intl";
import * as yup from "yup";

export const useGetSchemas = () => {
  const resourceT = useTranslations(NS_RESOURCE_PLANNING);
  const commonT = useTranslations(NS_COMMON);

  const schemaProject = yup
    .object({
      project_id: yup
        .string()
        .trim()
        .required(
          commonT("form.error.required", { name: resourceT("form.project") }),
        ),
      service_id: yup
        .string()
        .trim()
        .required(
          commonT("form.error.required", { name: resourceT("form.services") }),
        ),
      dateRange: yup
        .object()
        .shape({
          startDate: yup.date().required(
            commonT("form.error.required", {
              name: commonT("form.title.startDate"),
            }),
          ),
          endDate: yup
            .date()
            .required(
              commonT("form.error.required", {
                name: commonT("form.title.endDate"),
              }),
            )
            .min(
              yup.ref("startDate"),
              commonT("form.error.minDate", {
                name: commonT("form.title.endDate"),
                min: commonT("form.title.gte", {
                  name1: commonT("form.title.endDate"),
                  name2: commonT("form.title.startDate"),
                }),
              }),
            ),
        })
        .required(
          commonT("form.error.required", { name: resourceT("form.dateRange") }),
        ),
      allocation: yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .min(
          1,
          commonT("form.error.gte", {
            name: resourceT("form.allocation"),
            name2: 1,
          }),
        )
        .notRequired(),
      allocation_type: yup.string().notRequired(),
      user_id: yup
        .string()
        .required(
          commonT("form.error.required", { name: resourceT("form.user") }),
        ),
      note: yup.string().trim().notRequired(),
      role: yup
        .string()
        .trim()
        .required(
          commonT("form.error.required", { name: resourceT("form.role") }),
        ),
      budget_id: yup.string(),
    })
    .required();

  const schemaTimeOff = yup
    .object({
      categoryTimeOff: yup
        .string()
        .trim()
        .required(
          commonT("form.error.required", {
            name: resourceT("form.timeOffCategory"),
          }),
        ),
      dateRange: yup
        .object()
        .shape({
          startDate: yup.date().required(
            commonT("form.error.required", {
              name: commonT("form.title.startDate"),
            }),
          ),
          endDate: yup
            .date()
            .required(
              commonT("form.error.required", {
                name: commonT("form.title.endDate"),
              }),
            )
            .min(
              yup.ref("startDate"),
              commonT("form.error.minDate", {
                name: commonT("form.title.endDate"),
                min: commonT("form.title.gte", {
                  name1: commonT("form.title.endDate"),
                  name2: commonT("form.title.startDate"),
                }),
              }),
            ),
        })
        .required(
          commonT("form.error.required", {
            name: resourceT("form.dateRange"),
          }),
        ),
      // workingTime: yup
      //   .string()
      //   .required("Thời gian làm việc không được bỏ trống"),
      user_id: yup.string(),
      allocation: yup
        .number()
        .transform((value) => (isNaN(value) ? 0 : value))
        .min(
          1,
          commonT("form.error.gte", {
            name: resourceT("form.allocation"),
            name2: 1,
          }),
        )
        .notRequired(),
      allocation_type: yup.string().notRequired(),
      note: yup.string().trim().notRequired(),
    })
    .required();

  return {
    schemaProject,
    schemaTimeOff,
  };
};
