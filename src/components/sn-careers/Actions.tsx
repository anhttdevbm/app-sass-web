"use client";

import { memo, useMemo, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { Clear, Dropdown, Refresh, Search } from "components/Filters";
import { getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import useToggle from "hooks/useToggle";
import { DataAction } from "constant/enums";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { GetEmployeeListQueries } from "store/company/actions";
import { usePositionOptions } from "store/global/selectors";
import { NS_COMMON, NS_CAREER, ACCESS_TOKEN_STORAGE_KEY } from "constant/index";
import { useTranslations } from "next-intl";
import Form from "./components/Form";
import { TEXT_PAY_STATUS_CAREER } from "./helpers/helpers";
import { FeedbackStatus } from "store/feedback/actions";
import { useFeedback } from "store/feedback/selectors";
import { SearchStatus } from "store/career/action";
import { CareergDataForm } from "store/career/type";
import { useCareer } from "store/career/selectors";
import { clientStorage } from "utils/storage";

const Actions = () => {
  const careerT = useTranslations(NS_CAREER);
  const commonT = useTranslations(NS_COMMON);
  const [item, setItem] = useState<CareergDataForm>();
  const { filters, page, size, onCreateNewCareer, onGetCareer } = useCareer();
  const [isShow, onShow, onHide] = useToggle();
  // const { onCreateNewCategory } = useCategoryBlog();

  // const [isShow, onShow, onHide] = useToggle();

  const pathname = usePathname();
  const { push } = useRouter();

  const [queries, setQueries] = useState<Params>({});

  // Đã ngôn ngữ trạng thái
  const paymentOptions = useMemo(
    () =>
      PAYMENT_OPTIONS.map((item) => ({ ...item, label: careerT(item.label) })),
    [careerT],
  );

  //Cập nhật state trạng thái
  const onChangeQueries = (name, value) => {
    if (name === "status") {
      const addQueries = {
        isOpening: typeof value === "string" ? value : undefined,
        is_approve: typeof value === "number" ? value : undefined,
      };
      // Truyền trạng thái hiện tại (queries) vào hàm setQueries để có thể sử dụng nó trong lambda function
      // setQueries((prevQueries) => {
      //   console.log(prevQueries); // In ra trạng thái trước khi cập nhật
      //   return { ...prevQueries, ...addQueries };
      // });
      setQueries((prevQueries) => ({ ...prevQueries, ...addQueries }));
    } else {
      // Truyền trạng thái hiện tại (queries) vào hàm setQueries để có thể sử dụng nó trong lambda function
      // setQueries((prevQueries) => {
      //   console.log(prevQueries); // In ra trạng thái trước khi cập nhật
      //   return { ...prevQueries, [name]: value };
      // });
      setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
    }
  };

  // Tìm kiếm
  const onSearch = () => {
    const path = getPath(pathname, queries);
    push(path);

    onGetCareer({ ...queries, page, size });
  };

  useEffect(() => {
    // console.log(filters);
    setQueries(filters);
  }, [filters]);


  const onResponsedContent = async (data: CareergDataForm) => {
    const accessToken = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
    // return 200;
    return await onCreateNewCareer(data, accessToken);
  };

  // console.log(queries);

  return (
    <>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ md: "center" }}
        justifyContent="space-between"
        spacing={{ xs: 1, md: 3 }}
        px={{ xs: 0, md: 3 }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          spacing={{ xs: 2, md: 0 }}
          sx={{
            display: {md: "flex" },
            height: 32,
          }}
        >
          <Text
            variant="h4"
            display={{ md: "none" }}
            alignItems={{ md: "center" }}
            justifyContent="space-between"
            px={{ xs: 0, md: 3 }}
          >
            {careerT("career_title_view.title")}
          </Text>

          <Button
            onClick={onShow}
            startIcon={<PlusIcon />}
            size="extraSmall"
            variant="primary"
            sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
          >
            {commonT("createNew")}
          </Button>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={3}
          py={{ xs: 1.25, md: 0.5, lg: 1.25 }}
          px={{ md: 1, lg: 2 }}
          borderRadius={1}
          width={{ xs: "100%", md: undefined }}
          justifyContent={{ xs: "flex-start", md: "flex-end" }}
          maxWidth={{ xs: "100%", md: "fit-content" }}
          overflow="auto"
          minWidth={{ md: "fit-content" }}
        >
          {/* Trạng Thái */}
          <Dropdown
            placeholder={careerT("status")}
            options={paymentOptions}
            name="status"
            onChange={onChangeQueries}
            value={
              queries?.is_approve
                ? Number(queries?.is_approve)
                : queries?.isOpening
            }
          />

          {/* Tìm Kiếm */}
          <Search
            placeholder={careerT("actions.search")}
            name="searchKey"
            sx={{ width: 200, minWidth: 200 }}
            onChange={onChangeQueries}
            value={queries?.searchKey}
            rootSx={{ height: { xs: 32, md: 32 } }}
          />

          {/* Laptop */}
          <Button
            size="extraSmall"
            sx={{
              display: { xs: "none", md: "flex" },
              height: 32,
              px: ({ spacing }) => `${spacing(2)}!important`,
            }}
            onClick={onSearch}
            variant="secondary"
          >
            {careerT("actions.search")}
          </Button>
          {/* Mobile */}
          <Button
            size="extraSmall"
            sx={{
              display: { md: "none" },
              height: 32,
              px: ({ spacing }) => `${spacing(2)}!important`,
            }}
            onClick={onSearch}
            variant="secondary"
          >
            {careerT("actions.search")}
          </Button>
        </Stack>
      </Stack>
      {isShow && (
        <Form
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES as unknown as CareergDataForm}
          onSubmit={onResponsedContent}
        />
      )}
    </>
  );
};

export default memo(Actions);
const PAYMENT_OPTIONS = [
  {
    label: TEXT_PAY_STATUS_CAREER[SearchStatus.IS_OPENING],
    value: SearchStatus.IS_OPENING,
  },

  {
    label: TEXT_PAY_STATUS_CAREER[SearchStatus.IS_CLOSED],
    value: SearchStatus.IS_CLOSED,
  },
];

const INITIAL_VALUES = {
  title: "",
  description:"",
  location:"",
  start_time:"",
  end_time:"",
  numberOfHires:"",
  is_opening: "true",
  slug:"",
};
