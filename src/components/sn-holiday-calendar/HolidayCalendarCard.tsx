"use client";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import { styled, SxProps, Theme } from "@mui/material/styles";
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { FieldArray, Formik, FormikValues, useFormikContext } from "formik";
import * as Yup from "yup";

import { NS_HOLIDAY_CALENDAR, NS_COMMON } from "constant/index";
import { DataStatus } from "constant/enums";
import { Option } from "constant/types";
import { NewButton as Button, IconButton, Text } from "components/shared";
import { useAdditionalFormikUtils } from "hooks/useFormik";
import useToggle from "hooks/useToggle";
import AddCircleGradientIcon from "icons/AddCircleGradientIcon";
import AddCircleIcon from "icons/AddCircleIcon";
import CalendarIcon from "icons/NewCalendarIcon";
import EditUnderlineIcon from "icons/EditUnderlineAltIcon";
import GreenTickIcon from "icons/GreenTickIcon";
import SearchIcon from "icons/SearchIcon";
import TrashIcon from "icons/TrashAltIcon";
import { useSnackbar } from "store/app/selectors";
import { HolidayCalendar, HolidayItem } from "store/holidayCalendar/reducer";
import { useHolidayCalendar } from "store/holidayCalendar/selectors";
import { getMessageErrorByAPI } from "utils/index";
import TitleInput from "./components/TitleInput";
import Select from "./components/Select";
import Input from "./components/Input";

type HolidayCalendarCardProps = {
  isNew?: boolean;
  holidayCalendar: HolidayCalendar;
  handleOpenModal: (id: string) => void;
  hideNewHolidayCalendar: () => void;
};

// MAIN COMPONENT
const HolidayCalendarCard = ({
  isNew = false,
  holidayCalendar,
  handleOpenModal,
  hideNewHolidayCalendar,
}: HolidayCalendarCardProps) => {
  const commonT = useTranslations(NS_COMMON);
  const holidayCalendarT = useTranslations(NS_HOLIDAY_CALENDAR);
  const { onAddSnackbar } = useSnackbar();

  const {
    handleAddHolidayCalendar,
    handleUpdateHolidayCalendar,
    handleUpdateHolidayList,
    handleAddHolidayItem,
    handleDeleteHolidayItem,
    selectHolidayList,
  } = useHolidayCalendar();

  const [selectedHolidayListId, setSelectedHolidayListId] = useState("");

  useEffect(() => {
    if (!selectedHolidayListId) {
      const sortedHolidayList = [
        ...holidayCalendar.list
          .filter((l) => +l.year >= new Date().getFullYear())
          .sort((l1, l2) => +l1.year - +l2.year),
        ...holidayCalendar.list
          .filter((l) => +l.year < new Date().getFullYear())
          .sort((l1, l2) => +l1.year - +l2.year),
      ];
      if (sortedHolidayList.length > 0) {
        setSelectedHolidayListId(sortedHolidayList[0].id);
      } else {
        setSelectedHolidayListId("");
      }
    }
  }, [holidayCalendar, selectedHolidayListId]);

  const initialValues = useMemo(
    () => ({
      id: holidayCalendar.id,
      name: holidayCalendar.name,
      country: holidayCalendar.country,
      items:
        selectHolidayList(
          holidayCalendar.id,
          selectedHolidayListId,
        )?.items.filter(() => true) ?? [],
    }),
    [
      holidayCalendar.country,
      holidayCalendar.id,
      holidayCalendar.name,
      selectHolidayList,
      selectedHolidayListId,
    ],
  );

  const validationSchema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(
          commonT("form.error.required", {
            name: holidayCalendarT("form.name"),
          }),
        ),
        country: Yup.string().required(
          commonT("form.error.required", {
            name: holidayCalendarT("form.country"),
          }),
        ),
        items: Yup.array(
          Yup.object().shape({
            name: Yup.string().required(),
            date: Yup.mixed()
              .required()
              .test(
                "date-same-year",
                "Date should be within selected year",
                async (value) => {
                  const selectedHolidayList = selectHolidayList(
                    holidayCalendar.id,
                    selectedHolidayListId,
                  );
                  if (!selectedHolidayList) {
                    return true;
                  }
                  return (
                    dayjs(value as string | Date).year() ===
                    +selectedHolidayList.year
                  );
                },
              ),
          }),
        ),
      }),
    [
      commonT,
      holidayCalendar.id,
      holidayCalendarT,
      selectHolidayList,
      selectedHolidayListId,
    ],
  );

  const onSubmit = useCallback(
    async (values: typeof initialValues, { resetForm }) => {
      try {
        if (isNew) {
          const { name, country } = values;
          await handleAddHolidayCalendar({ name, country, province: "" });
          resetForm();
          hideNewHolidayCalendar();
        } else {
          const { id, name, country } = values;
          await handleUpdateHolidayCalendar({
            id,
            name,
            country,
            province: "",
          });
          const [existingItems, newItems] = values.items
            .map((item) => ({
              ...item,
              date: dayjs(item.date).format("YYYY-MM-DD"),
            }))
            .reduce(
              (acc, item) => {
                if (item.id.startsWith("new")) {
                  return [[...acc[0]], [...acc[1], item]];
                } else {
                  return [[...acc[0], item], [...acc[1]]];
                }
              },
              [[], []] as HolidayItem[][],
            );
          await handleUpdateHolidayList({
            id: selectedHolidayListId,
            items: existingItems,
          });
          await Promise.all(
            newItems.map((item) =>
              handleAddHolidayItem({
                name: item.name,
                date: item.date,
                holidayListId: selectedHolidayListId,
              }),
            ),
          );
          const deletedItems = initialValues.items.filter(
            (initialItem) =>
              !values.items.map((item) => item.id).includes(initialItem.id),
          );
          await Promise.all(
            deletedItems.map((item) =>
              handleDeleteHolidayItem({
                holidayListId: selectedHolidayListId,
                id: item.id,
              }),
            ),
          );
        }
        onAddSnackbar(
          commonT("notification.success", {
            label: commonT("form.save"),
          }),
          "success",
        );
      } catch (error) {
        onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        resetForm();
      }
    },
    [
      isNew,
      handleUpdateHolidayList,
      selectedHolidayListId,
      initialValues.items,
      handleAddHolidayCalendar,
      hideNewHolidayCalendar,
      handleUpdateHolidayCalendar,
      handleAddHolidayItem,
      handleDeleteHolidayItem,
      onAddSnackbar,
      commonT,
    ],
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
      enableReinitialize={true}
    >
      {() => (
        <HolidayCalendarCardForm<typeof initialValues>
          isNew={isNew}
          holidayCalendar={holidayCalendar}
          handleOpenModal={handleOpenModal}
          hideNewHolidayCalendar={hideNewHolidayCalendar}
          selectedHolidayListId={selectedHolidayListId}
          setSelectedHolidayListId={setSelectedHolidayListId}
        />
      )}
    </Formik>
  );
};

export default HolidayCalendarCard;

// MAIN RENDERING COMPONENT
function HolidayCalendarCardForm<Values extends FormikValues = FormikValues>({
  isNew,
  holidayCalendar,
  handleOpenModal,
  hideNewHolidayCalendar,
  selectedHolidayListId,
  setSelectedHolidayListId,
}: HolidayCalendarCardProps & {
  selectedHolidayListId: string;
  setSelectedHolidayListId: Dispatch<SetStateAction<string>>;
}) {
  const commonT = useTranslations(NS_COMMON);
  const holidayCalendarT = useTranslations(NS_HOLIDAY_CALENDAR);
  const { onAddSnackbar } = useSnackbar();

  const formik = useFormikContext<Values>();
  const {
    values,
    touched,
    resetForm,
    handleChange,
    setFieldValue,
    handleBlur,
    isSubmitting,
    submitForm,
    validateForm,
  } = formik;
  const { isSubmitDisabled, touchedError } = useAdditionalFormikUtils(formik);

  const { status, handleDeleteHolidayCalendar } = useHolidayCalendar();

  const listYears = useMemo(
    () =>
      holidayCalendar.list
        .map((l) => ({
          label: `${l.year}`,
          value: l.id,
        }))
        .sort((l1, l2) => +l1.label - +l2.label),
    [holidayCalendar],
  );

  const [isEdit, setEditOn, setEditOff] = useToggle(false);
  const [shouldReset, setShouldResetOn, setShouldResetOff] = useToggle(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const toggleEdit = useCallback(async () => {
    if (isEdit) {
      validateForm();
      if (!isSubmitDisabled) {
        try {
          await submitForm();
          setEditOff();
        } catch (error) {
          onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        }
      }
    } else {
      setEditOn();
    }
  }, [
    isEdit,
    validateForm,
    isSubmitDisabled,
    submitForm,
    setEditOff,
    onAddSnackbar,
    commonT,
    setEditOn,
  ]);

  useEffect(() => {
    if (isEdit) {
      if (titleRef.current) {
        titleRef.current.focus();
      }
    }
  }, [isEdit]);

  useEffect(() => {
    if (isEdit) {
      setShouldResetOn();
    } else if (!isEdit && shouldReset) {
      resetForm();
      setShouldResetOff();
    }
  }, [isEdit, shouldReset, setShouldResetOn, setShouldResetOff, resetForm]);

  const [countrySearch, setCountrySearch] = useState("");
  const countryList = useMemo(
    () =>
      (countrySearch === ""
        ? initialCountryList
        : initialCountryList.filter((option) =>
            option.label.toLowerCase().includes(countrySearch.toLowerCase()),
          )) as Option[],
    [countrySearch],
  );

  return (
    <Stack
      direction="column"
      sx={{
        mt: 3,
        pt: 3,
        pr: 6,
        pb: 6,
        pl: 4,
        backgroundColor: "white",
        borderRadius: "24px",
      }}
    >
      <Box component="form" noValidate>
        <Stack direction="row" alignItems="center" mb={1}>
          <TitleInput
            name="name"
            isEdit={isEdit}
            disabled={!isEdit}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values.name}
            placeholder={holidayCalendarT("placeholder.holidayCalendarName")}
            error={!!touchedError("name")}
            inputRef={titleRef}
          />
          <IconButtonContainer>
            <IconButton size="small" onClick={toggleEdit}>
              {isEdit ? (
                <GreenTickIcon />
              ) : (
                <EditUnderlineIcon sx={{ color: "#333333" }} />
              )}
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: "#FF4141" }}
              disabled={status === DataStatus.LOADING}
              onClick={async () => {
                try {
                  if (isNew) {
                    resetForm();
                    hideNewHolidayCalendar();
                  } else {
                    await handleDeleteHolidayCalendar(holidayCalendar.id);
                    // setShouldFetchOn();
                  }
                } catch (error) {
                  onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
                }
              }}
            >
              <TrashIcon />
            </IconButton>
          </IconButtonContainer>
        </Stack>

        <Grid
          container
          mb={2}
          columnSpacing={3}
          rowSpacing={{
            xs: 2,
            sm: 3,
          }}
        >
          <Grid item xs={12} sm={4}>
            <StyledLabel>
              <span>{holidayCalendarT("form.country")}</span>
              <Select
                options={countryList}
                title={holidayCalendarT("form.country")}
                name="country"
                rootSx={{ width: "100%" }}
                disabled={!isEdit}
                onChange={(_, newVal) => {
                  setFieldValue("country", newVal);
                }}
                onBlur={handleBlur}
                value={values.country}
                endAdornment={isEdit ? undefined : <></>}
                topItem={
                  <Box px={2}>
                    <Input
                      name="country-search"
                      placeholder={holidayCalendarT(
                        "placeholder.countrySearch",
                      )}
                      value={countrySearch}
                      onChange={(e) => {
                        setCountrySearch(e.target.value);
                      }}
                      sx={{
                        fontSize: "13px",
                        fontWeight: 600,
                      }}
                      startAdornment={
                        <SearchIcon
                          sx={{ marginLeft: "6px", color: "#172B4D" }}
                        />
                      }
                    />
                  </Box>
                }
                // error={commonT(touchedError("country"), {
                //   name: costRateT("empty.form.country"),
                // })}
              />
            </StyledLabel>
          </Grid>

          <Grid item xs={12} sm={4}>
            <StyledLabel>
              <span>{holidayCalendarT("form.year")}</span>
              <Select
                options={listYears}
                title={holidayCalendarT("form.year")}
                name="year"
                rootSx={{ width: "100%" }}
                optionSx={{ px: "12px" }}
                disabled={!isEdit}
                onChange={(_, newVal) => {
                  if (Object.values(touched).length > 0) {
                    submitForm();
                  }
                  setSelectedHolidayListId(newVal as string);
                }}
                value={selectedHolidayListId}
                endAdornment={isEdit ? undefined : <></>}
                bottomItem={
                  !isNew ? (
                    <Stack direction="row" justifyContent="center">
                      <Button
                        disabled={isSubmitDisabled}
                        pending={isSubmitting}
                        sx={{
                          mx: 2,
                          "&.MuiButton-sizeMedium": {
                            px: 3,
                            py: 0.75,
                          },
                          "& .MuiButton-startIcon": {
                            display: "flex",
                            alignItems: "center",
                          },
                        }}
                        variant="primary"
                        type="button"
                        startIcon={<AddCircleIcon />}
                        onClick={() => {
                          handleOpenModal(holidayCalendar.id);
                        }}
                      >
                        {holidayCalendarT("form.addHolidayList")}
                      </Button>
                    </Stack>
                  ) : undefined
                }
                // error={commonT(touchedError("listId"), {
                //   name: costRateT("empty.form.year"),
                // })}
              />
            </StyledLabel>
          </Grid>
        </Grid>
      </Box>

      <FieldArray name="items">
        {(arrayHelpers) => (
          <Box>
            {values.items.map((item, idx) => (
              <Stack key={item.id} direction="row" flexWrap="wrap">
                <Input
                  name={`items[${idx}].name`}
                  disabled={!isEdit}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.items[idx].name}
                  rootSx={{
                    ...holidayItemInputSx,
                    flexBasis: { xs: "100%", sm: "calc(100% * 4 / 12)" },
                  }}
                />
                <Stack
                  direction="row"
                  sx={{
                    flexBasis: {
                      xs: "100%",
                      sm: "calc(100% * 5 / 12)",
                    },
                    "& > .react-datepicker-wrapper": {
                      "& > .react-datepicker__input-container": {
                        display: "inline-flex",
                      },
                    },
                  }}
                >
                  <DatePicker
                    name={`items[${idx}].date`}
                    disabled={!isEdit}
                    onChange={(date) => {
                      setFieldValue(`items[${idx}].date`, date ? date : null);
                    }}
                    onBlur={handleBlur}
                    selected={
                      values.items[idx].date
                        ? new Date(values.items[idx].date)
                        : null
                    }
                    fixedHeight
                    dateFormat="dd/MM/yyyy"
                    customInput={
                      <Input
                        rootSx={{ ...holidayItemInputSx }}
                        endAdornment={isEdit ? <CalendarIcon /> : undefined}
                      />
                    }
                    // error={commonT(touchedError(`items[${idx}].date`), {
                    //   name: costRateT("empty.form.endDate"),
                    // })}
                  />
                  {isEdit ? (
                    <IconButton
                      sx={{ color: "#FF4141" }}
                      disabled={status === DataStatus.LOADING}
                      onClick={() => {
                        arrayHelpers.remove(idx);
                      }}
                    >
                      <TrashIcon />
                    </IconButton>
                  ) : (
                    <></>
                  )}
                </Stack>
              </Stack>
            ))}

            {isEdit &&
            selectedHolidayListId &&
            selectedHolidayListId.length > 0 ? (
              <Stack
                direction="row"
                mt={2}
                justifyContent={{ xs: "start", sm: "end" }}
              >
                <Stack
                  direction="row"
                  sx={{ cursor: "pointer" }}
                  onClick={() => {
                    if (!(status === DataStatus.LOADING || !isEdit)) {
                      arrayHelpers.push({
                        id: `new-${values.items.length + 1}`,
                        name: "",
                        date: "",
                      });
                    }
                  }}
                >
                  <AddCircleGradientIcon />
                  <Text ml={1.5} color="#0575E6" fontWeight={700}>
                    {holidayCalendarT("form.addHolidayItem")}
                  </Text>
                </Stack>
              </Stack>
            ) : (
              <></>
            )}
          </Box>
        )}
      </FieldArray>
    </Stack>
  );
}

const StyledLabel = styled("label")(({ theme }) => ({
  fontFamily: theme.typography.fontFamily,
  fontSize: "13px",
  fontWeight: 500,
  color: "#4D4D4D",
  // textTransform: "capitalize",
  display: "flex",
  flexDirection: "column",
  "& > span:first-of-type": {
    marginBottom: "12px",
  },
}));

const IconButtonContainer = styled(Stack)({
  flexDirection: "row",
  "& > *:not(.\\9)": {
    padding: "4px 8px",
    borderTop: "1px solid #D5D5D5",
    borderBottom: "1px solid #D5D5D5",
    borderLeft: "1px solid #D5D5D5",
    borderRadius: 0,
  },
  "& > :last-of-type:not(.\\9)": {
    borderRight: "1px solid #D5D5D5",
    borderTopRightRadius: "8px",
    borderBottomRightRadius: "8px",
  },
  "& > :first-of-type:not(.\\9)": {
    borderTopLeftRadius: "8px",
    borderBottomLeftRadius: "8px",
  },
});

const holidayItemInputSx: SxProps<Theme> = {
  border: "none",
  outline: "none",
};

const initialCountryList = [
  { label: "Viet Nam", value: "vietnam" },
  { label: "Japan", value: "japan" },
  { label: "Singapore", value: "singapore" },
  { label: "Thailand", value: "thailand" },
  { label: "China", value: "china" },
];
