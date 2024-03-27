"use client";

import { memo, useMemo, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { Clear, Dropdown, Refresh, Search } from "components/Filters";
import { getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import useToggle from "hooks/useToggle";
import { DataAction} from "constant/enums";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { GetEmployeeListQueries } from "store/company/actions";
import { usePositionOptions } from "store/global/selectors";
import { NS_COMMON, NS_FEEDBACK } from "constant/index";
import { useTranslations } from "next-intl";
import Form from "./components/Form";

import { TEXT_PAY_STATUS_FEEDBACK } from "./helpers/helpers";
import { FeedbackStatus } from "store/feedback/actions";
import { useFeedback } from "store/feedback/selectors";

const Actions = () => {
  const feedbackT = useTranslations(NS_FEEDBACK);
  const {filters, page, size, onGetFeedback} = useFeedback();
  // const { onCreateNewCategory } = useCategoryBlog();

  // const [isShow, onShow, onHide] = useToggle();

  const pathname = usePathname();
  const { push } = useRouter();

  const [queries, setQueries] = useState<Params>({});

  // Đã ngôn ngữ trạng thái
  const paymentOptions = useMemo(
    () =>
      PAYMENT_OPTIONS.map((item) => ({ ...item, label: feedbackT(item.label) })),
    [feedbackT],
  );

  //Cập nhật state trạng thái
  const onChangeQueries = (name, value) => {
    if (name === "status") {
      const addQueries = {
        status: typeof value === "string" ? value : undefined,
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

    onGetFeedback({ ...queries, page, size });
  };

  useEffect(() => {
    // console.log(filters);
    setQueries(filters);
  }, [filters]);


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
        >
          <Text
            variant="h4"
            display={{ md: "none" }}
            alignItems={{ md: "center" }}
            justifyContent="space-between"
            px={{ xs: 0, md: 3 }}
          >
            {feedbackT("Feedback_title_view.title")}
          </Text>
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
            placeholder={feedbackT("status")}
            options={paymentOptions}
            name="status"
            onChange={onChangeQueries}
            value={
              queries?.is_approve ? Number(queries?.is_approve) : queries?.status
            }
          />
          
          {/* Tìm Kiếm */}
          <Search
            placeholder={feedbackT("actions.search")}
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
            {feedbackT("actions.search")}
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
            {feedbackT("actions.search")}
          </Button>
        </Stack>
      </Stack>
      {/* {isShow && (
        <Form
          open={isShow}
          onClose={onHide}
          type={DataAction.CREATE}
          initialValues={INITIAL_VALUES as unknown as CategoryBlogDataForm}
          onSubmit={onCreateNewCategory}
        />
      )} */}
    </>
  );
};

export default memo(Actions);
const PAYMENT_OPTIONS = [
  { label: TEXT_PAY_STATUS_FEEDBACK[FeedbackStatus.RESPONSED], value: FeedbackStatus.RESPONSED },

  { label: TEXT_PAY_STATUS_FEEDBACK[FeedbackStatus.WATTING_RESPONSE], value: FeedbackStatus.WATTING_RESPONSE },

];
