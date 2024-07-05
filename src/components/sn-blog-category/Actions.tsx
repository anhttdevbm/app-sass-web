"use client";

import { memo, useMemo, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { Clear, Dropdown, Refresh, Search } from "components/Filters";
import { getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import useToggle from "hooks/useToggle";
import { DataAction, PayStatus } from "constant/enums";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { GetEmployeeListQueries } from "store/company/actions";
import { usePositionOptions } from "store/global/selectors";
import { NS_COMMON, NS_BLOG } from "constant/index";
import { useTranslations } from "next-intl";
import Form from "./components/Form";
import { useCategoryBlog } from "store/blog-category/selectors";
import { CategoryBlog, CategoryBlogDataForm } from "store/blog/reducer";
import { getAllBlogCategory } from "store/blog-category/actions";

const Actions = () => {
    const blogT = useTranslations(NS_BLOG);
    const commonT = useTranslations(NS_COMMON);

    const { onCreateNewCategory } = useCategoryBlog();

    const [isShow, onShow, onHide] = useToggle();

    const pathname = usePathname();
    const { push } = useRouter();

    const [queries, setQueries] = useState<Params>({});
    const onChangeQueries = (name: string, value: unknown) => {
        setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
    };

    const onSearch = () => {
        const path = getPath(pathname, queries);
        push(path);
        getAllBlogCategory({ ...queries });
    };

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
                    <Text variant="h4" display={{ md: "none" }}>
                        {blogT("blogCategory.title")}
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
                    <Search
                        placeholder={blogT("actions.search")}
                        name="searchKey"
                        sx={{ width: 200, minWidth: 200 }}
                        onChange={onChangeQueries}
                        rootSx={{ height: { xs: 46, md: 32 } }}
                    />
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
                        {blogT("actions.search")}
                    </Button>
                </Stack>
                <Button
                    size="small"
                    sx={{ height: 40, display: { md: "none" }, width: "fit-content" }}
                    onClick={onSearch}
                    variant="secondary"
                >
                    Search
                </Button>
            </Stack>
            {isShow && (
                <Form
                    open={isShow}
                    onClose={onHide}
                    type={DataAction.CREATE}
                    initialValues={INITIAL_VALUES as unknown as CategoryBlogDataForm}
                    onSubmit={onCreateNewCategory}
                />
            )}
        </>
    );
};

export default memo(Actions);

const INITIAL_VALUES = {
    name: "",
    slug: "",
    detail: "",
};
