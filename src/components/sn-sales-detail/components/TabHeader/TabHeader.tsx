import { Stack } from "@mui/material";
import { ArrowLeftIcon } from "@mui/x-date-pickers";
import { formErrorCode } from "api/formErrorCode";
import Avatar from "components/Avatar";
import { Dropdown } from "components/Filters";
import Link from "components/Link";
import { Button, Input, Text } from "components/shared";
import { useGetStageOptions } from "components/sn-sales-detail/hooks/useGetDealDetail";
import LabelStatusCell from "components/sn-sales/components/LabelStatusCell";
import {
  CURRENCY_SYMBOL,
  mappingStatusOptions,
} from "components/sn-sales/helpers";
import { CURRENCY_CODE } from "constant/enums";
import { NS_COMMON, NS_SALES } from "constant/index";
import { SALES_LIST_PATH } from "constant/paths";
import { ErrorResponse, Option } from "constant/types";
import { Data } from "emoji-mart";
import CoinIcon from "icons/CoinIcon";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSnackbar } from "store/app/selectors";
import { useSaleDetail, useSales } from "store/sales/selectors";
import {
  cleanObject,
  formatNumber,
  getMessageErrorByAPI,
  getPath,
} from "utils/index";

const TabHeader = () => {
  const { saleDetail } = useSaleDetail();
  const { onUpdateDeal } = useSales();
  const { stageOptions, stageStatusOptions } = useGetStageOptions();
  const { saleRevenue } = useSaleDetail();
  const { salesFilters, pageIndex, pageSize } = useSales();
  const { push } = useRouter();
  const { onAddSnackbar } = useSnackbar();
  const [isEditProb, setIsEditProb] = React.useState(false);
  const commonT = useTranslations(NS_COMMON);
  const salesT = useTranslations(NS_SALES);

  const { control, handleSubmit, getValues, watch } = useFormContext();

  const onSubmit = async (name, value) => {
    try {
      await onUpdateDeal({
        id: saleDetail?.id,
        [name]: value,
      }).catch((e) => {
        throw e;
      });
    } catch (error) {
      console.log(error);
      onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
      throw error;
    }
  };

  const mappingProbabilityOptions: Option[] = useMemo(
    () =>
      Array.from(new Array(11), (value, index) => ({
        label: `${salesT("list.table.probability")} - ${index * 10}%`,
        value: index * 10 + 1,
      })),
    [],
  );

  // const saleRevenueCal = useMemo(() => {
  //   const sectionsList = getValues("sectionsList");
  //   const total = sectionsList?.reduce((prev, section) => {
  //     const total = section?.service?.reduce((prev, service) => {
  //       return prev + (service?.totalBuget || 0);
  //     }, 0);
  //     return prev + total;
  //   }, 0);
  //   return total;
  // }, [getValues("sectionsList")]);

  const prevListPath = getPath(SALES_LIST_PATH, {
    ...cleanObject(salesFilters),
    pageIndex,
    pageSize,
  });

  return (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing={2}
      padding={{
        xs: 0,
        sm: "0.5rem 1rem",
      }}
      minHeight={{
        xs: "64px",
        sm: "140px",
        md: "64px",
      }}
      justifyContent="space-between"
      alignItems={{
        xs: "flex-start",
        md: "center",
      }}
      overflow="hidden"
    >
      <Link
        sx={{
          maxWidth: "50%",
          textDecoration: "none",
        }}
        href={prevListPath}
        textAlign="center"
      >
        <Stack direction="row" spacing={1} alignItems={"center"}>
          <ArrowLeftIcon
            sx={{ color: "common.black" }}
            height={24}
            width={24}
            color="inherit"
          />
          <Avatar size={32} src={saleDetail?.owner?.avatar?.link} />
          <Text
            variant="h5"
            sx={{
              width: "100%",
              textAlign: "left",
              WebkitLineClamp: 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
          >
            {saleDetail?.name}
          </Text>
        </Stack>
      </Link>
      <Stack
        direction="row"
        justifyContent={{
          xs: "space-between",
          sm: "flex-end",
        }}
        sx={{
          flex: 1,
        }}
        spacing={2}
        flexWrap={{ xs: "wrap", sm: "nowrap" }}
      >
        <Controller
          control={control}
          name="status"
          render={({ field }) => {
            const { onChange, ...rest } = field;
            const onSelect = (name: string, value: string) => {
              onChange(value);
              onSubmit(name, value);
            };
            return (
              <Dropdown
                hasAll={false}
                options={stageOptions}
                {...rest}
                onChange={onSelect}
              />
            );
          }}
        />
        {/* <Controller
          control={control}
          name="probability"
          defaultValue={(saleDetail?.probability || 0) + 1}
          render={({ field }) => {
            const { onChange, value, ...rest } = field;
            const onSelect = async (name: string, value: number) => {
              await onSubmit(name, value - 1).then(() => {
                onChange(value - 1);
              });
            };
            return (
              <Dropdown
                hasAll={false}
                options={mappingProbabilityOptions}
                {...rest}
                value={value + 1}
                onChange={onSelect}
              />
            );
          }}
        /> */}

        {!isEditProb ? (
          <Text
            fontSize={14}
            color="gray.400"
            onClick={(e) => {
              e.stopPropagation();
              setIsEditProb(true);
            }}
            sx={{
              padding: "6px 8px",
            }}
          >
            {`${salesT("list.table.probability")} - ${watch("probability")}`}%
          </Text>
        ) : (
          <Controller
            control={control}
            name="probability"
            defaultValue={saleDetail?.probability || 0}
            render={({ field }) => {
              const { onChange, value, ...rest } = field;
              const onSelect = async (name: string, value: number) => {
                await onSubmit(name, value)
                  .then(() => {
                    onChange(value);
                  })
                  .catch((e) => {
                    onChange(saleDetail?.probability || 0);
                    throw e;
                  });
              };
              return (
                <Stack direction="row">
                  <Text
                    fontSize={14}
                    color="gray.400"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsEditProb(true);
                    }}
                    sx={{
                      padding: "6px 8px",
                    }}
                  >
                    {`${salesT("list.table.probability")} - `}
                  </Text>
                  <Input
                    {...rest}
                    value={value}
                    onBlur={() => {
                      if (value !== saleDetail?.probability)
                        onSelect("probability", value);
                      setIsEditProb(false);
                    }}
                    type="number"
                    autoFocus={isEditProb}
                    focused={isEditProb}
                    rootSx={{
                      width: "50px",
                      alignContent: "right",
                      padding: "4px!important",
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter") {
                        onSelect("probability", Number.parseFloat(value));
                        setIsEditProb(false);
                      }
                    }}
                    onChange={onChange}
                  />
                </Stack>
              );
            }}
          />
        )}
        {/* <Dropdown
          hasAll={false}
          value={saleDetail?.probability || 0 + 1}
          onChange={() => console.log("change here")}
          options={mappingProbabilityOptions}
          name="probability"
        /> */}
        <Stack
          direction="row"
          justifyContent={"center"}
          alignItems="center"
          spacing={1}
          sx={{
            maxWidth: "200px",
            height: "fit-content",
            py: "6px",
          }}
        >
          {/* Add coin icon here */}
          <CoinIcon />
          <Text
            variant="body2"
            sx={{
              maxWidth: "100%",
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
          >
            Revenue:{" "}
            {formatNumber(saleDetail?.total.revenue || saleRevenue || 0, {
              numberOfFixed: 2,
              prefix:
                CURRENCY_SYMBOL[saleDetail?.currency || CURRENCY_CODE.USD],
            })}
          </Text>
        </Stack>
      </Stack>
      <Controller
        control={control}
        name="stage"
        defaultValue={saleDetail?.stage || 0}
        render={({ field }) => {
          const { onChange, ...rest } = field;
          const onSelect = (name: string, value: string) => {
            onChange(value);
            onSubmit(name, value);
          };
          return (
            <Stack
              sx={{
                width: "100px",
                maxWidth: "100px",
                height: "66px",
              }}
            >
              <LabelStatusCell
                {...rest}
                fullWidth
                options={mappingStatusOptions}
                onChange={(e) => {
                  onSelect("stage", e.target.value);
                }}
                sx={{
                  w: "100px",
                }}
                menuListSx={{
                  maxWidth: "200px",
                  "& .MuiTableCell-root": {
                    height: "fit-content",
                  },
                }}
                defaultValue={mappingStatusOptions[0].value as string}
              ></LabelStatusCell>
            </Stack>
          );
        }}
      />
    </Stack>
  );
};

export default TabHeader;
