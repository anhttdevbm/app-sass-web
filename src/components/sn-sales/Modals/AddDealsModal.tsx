import { Stack, Grid } from "@mui/material";
import React, { memo } from "react";
import FormLayout from "components/FormLayout";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { NS_COMMON, NS_SALES } from "constant/index";
import { useTranslations } from "next-intl";
import { yupResolver } from "@hookform/resolvers/yup";
import { Input, Select } from "components/shared";
import SelectMultiple from "../components/SelectMultiple";
import { CURRENCY_SYMBOL } from "../helpers";
import useGetEmployeeOptions from "../hooks/useGetEmployeeOptions";
import { useSales } from "store/sales/selectors";
import useGetProjectTypeOptions from "../hooks/useGetProjectTypeOptions";
import { useTagOptions, useTags } from "store/tags/selector";
import { Tag } from "store/tags/reducer";
import { TagData } from "store/tags/actions";

interface IProps {
  open: boolean;
  onClose(): void;
}

const salesFormTranslatePrefix = "list.newDealForm";

export const UNIT_OPTIONS = Object.keys(CURRENCY_SYMBOL).map((key) => ({
  label: `${key}(${CURRENCY_SYMBOL[key]})`,
  value: key,
}));

const AddDealModal = ({ open, onClose }: IProps) => {
  const {
    employeeOptions,
    employeeIsFetching,
    onEndReachedEmployeeOptions,
    onGetEmployeeOptions,
  } = useGetEmployeeOptions();
  const {
    projectTypeIsFetching,
    projectTypeOptions,
    onEndReachedProjectTypeOptions,
  } = useGetProjectTypeOptions();

  const { onCreateDeal } = useSales();
  const { tagsOptions, isTagLoading, onSearchTags } = useTagOptions();
  const { onCreateTags } = useTags();
  //create form
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);

  const schema = yup.object().shape({
    dealName: yup.string().required(
      commonT("form.error.required", {
        name: salesT(`${salesFormTranslatePrefix}.dealName`),
      }),
    ),
    currency: yup
      .string()
      .oneOf(
        Object.keys(CURRENCY_SYMBOL),
        commonT("form.error.invalid", {
          name: salesT(`${salesFormTranslatePrefix}.currency`),
        }),
      )
      .required(
        commonT("form.error.required", {
          name: `${salesFormTranslatePrefix}.currency`,
        }),
      ),
    owner: yup.string().required(
      commonT("form.error.required", {
        name: salesT(`${salesFormTranslatePrefix}.owner`),
      }),
    ),
    members: yup
      .array()
      .of(yup.string())
      .min(
        1,
        commonT("form.error.required", {
          name: salesT(`${salesFormTranslatePrefix}.dealMember`),
        }),
      ),
    tags: yup.array().of(yup.string()),
  });

  const { handleSubmit, control, reset, getValues, setValue } = useForm({
    defaultValues: {
      dealName: "",
      currency: UNIT_OPTIONS[0].value,
      owner: "",
      members: [],
      tags: [],
    },
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    onClose();
    onCreateDeal(data);
    reset();
  };

  const onSearchMember = (name: string, value = "") => {
    onGetEmployeeOptions({
      pageIndex: 1,
      pageSize: 20,
      email: (value as string) || "",
    });
  };
  const newInput = {
    // height: "65px",
    ".MuiInputBase-root": {
      background:
        " linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)!important",
      padding: "7px!important",
      borderRadius: "100px!important",
      border: "none!important",
      mt: 3,
      fontSize: "16px!important",
      // height:"38px",
      ".MuiInputBase-input": { p: "0 10px!important" },
      svg: {
        borderRadius: "50px",
        border: "0.2px solid #5C5C5C",
        fontSize: "16px",
        color: "black",
        "&:hover": { color: "black" },
      },
      ".MuiChip-root": {
        color: "#0575e6",
        padding: "5px",
        svg: {
          border: "0.2px solid transparent",
          color: "white",
          background: " #0575e6",
        },
      },
    },
    "label.MuiInputLabel-root": {
      left: 0,
      fontSize: "13px",
      transform: "translate(0, 16px) scale(1)",
    },
  };
  return (
    <FormLayout
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", lg: 500 },
        maxWidth: { xs: "calc(100vw - 24px)", sm: 500 },
        minHeight: "auto",
        ".MuiDialogTitle-root": { border: "none" },
        ".MuiDialogActions-root": {
          border: "none", ".MuiButtonBase-root": {
            "&:last-child": {
              background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)", color: "white", borderRadius: "100px"
            },
            "&:first-child": {
              background: "white", color: "#14B9E5", border: "1px solid #14B9E5", borderRadius: "100px"
            }
          }
        }

      }}
      open={open}
      label={salesT(`${salesFormTranslatePrefix}.title`)}
      submitText={salesT(`${salesFormTranslatePrefix}.submit`)}
      cancelText={commonT("form.cancel")}
      onClose={onClose}
      onSubmit={handleSubmit(onSubmit)}
    >
      <Stack gap={2} direction="column" sx={{ mb: 4 }}>
        <Controller
          control={control}
          name="dealName"
          render={({ field, fieldState: { error } }) => (
            <Input
              sx={newInput}
              fullWidth
              error={error?.message}
              {...field}
              title={salesT(`${salesFormTranslatePrefix}.dealName`)}
            />
          )}
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Controller
              control={control}
              name="owner"
              render={({ field, fieldState: { error } }) => (
                <Select
                  onChangeSearch={(_, newValue) =>
                    onSearchMember(field.name, newValue as string)
                  }

                  sx={newInput}
                  error={error?.message}
                  fullWidth
                  options={employeeOptions}
                  onEndReached={onEndReachedEmployeeOptions}
                  pending={employeeIsFetching}
                  {...field}
                  title={salesT(`${salesFormTranslatePrefix}.owner`)}
                />
              )}
            />
          </Grid>
          <Grid item xs>
            <Controller
              control={control}
              name="currency"
              render={({ field, fieldState: { error } }) => (
                <Select
                  sx={newInput}
                  error={error?.message}
                  options={UNIT_OPTIONS}
                  fullWidth
                  {...field}
                  title={salesT(`${salesFormTranslatePrefix}.unit`)}
                />
              )}
            />
          </Grid>
        </Grid>
        <Controller
          control={control}
          name="members"
          render={({ field, fieldState: { error } }) => {
            const { onChange, ...props } = field;
            const onSelect = (e, data) => {
              const mappingData = data.map((item) => item.value);
              onChange(mappingData);
            };
            const filteredOption = employeeOptions.filter(
              (item) => item.value !== getValues("owner"),
            );
            return (
              <SelectMultiple
                sx={newInput}
                options={filteredOption}
                onSelect={onSelect}
                onOpen={() => onSearchMember(field.name, "")}
                error={error?.message}
                onEndReached={onEndReachedEmployeeOptions}
                loading={employeeIsFetching}
                label={salesT(`${salesFormTranslatePrefix}.dealMember`)}
              />
            );
          }}
        />
        <Controller
          control={control}
          name="tags"
          render={({ field, fieldState: { error } }) => {
            const { onChange, ...props } = field;
            const onSelect = (e, data) => {
              const mappingData = data.map((item) => item.value);
              onChange(mappingData);
              // onSearchTags("");
            };
            const onEnter = async (value: string | undefined) => {
              if (!value) return;
              const tags = getValues("tags") ?? [];
              const isExisted = tagsOptions.find(
                (item) => item.label === value,
              );
              const convertedTags = tags.map((item) => {
                return {
                  label: item,
                  value: item,
                };
              });
              if (isExisted) {
                onSelect(null, [
                  ...convertedTags,
                  {
                    label: value,
                    value: isExisted.value,
                  },
                ]);
                return;
              }
              await onCreateTags({
                name: value,
              }).then((res: TagData) => {
                onSelect(null, [
                  ...convertedTags,
                  {
                    label: value,
                    value: res?.id,
                  },
                ]);
              });
            };
            return (
              <SelectMultiple
                sx={newInput}
                options={tagsOptions}
                onSelect={onSelect}
                error={error?.message}
                noOptionText={salesT(`list.noOptionText`)}
                onInputChange={(value) => onSearchTags(value)}
                onEndReached={onEndReachedProjectTypeOptions}
                loading={isTagLoading}
                onEnter={onEnter}
                label={salesT(`${salesFormTranslatePrefix}.tags`)}
              />
            );
          }}
        />
      </Stack>
    </FormLayout>
  );
};

export default memo(AddDealModal);
