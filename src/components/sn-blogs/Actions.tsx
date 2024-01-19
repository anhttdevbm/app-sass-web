"use client";
import { Stack } from "@mui/material"
import { Dropdown, Search } from "components/Filters";
import { Button, Text } from "components/shared"
import useToggle from "hooks/useToggle";
import PlusIcon from "icons/PlusIcon";
import { memo, useEffect, useMemo, useState } from "react";
import { BlogData, BlogFormData, BlogStatus } from "store/blog/actions";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import Form from "./components/Form";
import { DataAction } from "constant/enums";
import { useBlogs } from "store/blog/selectors";
import { useTranslations } from "next-intl";
import { NS_BLOG } from "constant/index";
import { usePathname, useRouter } from "next/navigation";
import { getPath } from "utils/index";

const Actions = () => {
    const blogT = useTranslations(NS_BLOG);
    const [isShow, onShow, onHide] = useToggle();
    const [queries, setQueries] = useState<Params>({});
    const { onCreateNewBlog, filters, size, page, onGetBlogs } = useBlogs();

    const pathname = usePathname();
    const { push } = useRouter();


    const blogOptions = useMemo(
        () =>
            BLOG_STATUS_OPTIONS.map((item) => (
                { ...item, label:  blogT(item.label) }
            )),
        [],
    );


    const onSearch = () => {
        const path = getPath(pathname, queries);
        push(path);

        onGetBlogs({ ...queries, page: 1, size });
    };

    const onChangeQueries = (name: string, value: unknown) => {
        if (name === "status") {
            const addQueries = {
                status: typeof value === "string" ? value : undefined,
            };
            setQueries((prevQueries) => ({ ...prevQueries, ...addQueries }));
        } else {
            setQueries((prevQueries) => ({ ...prevQueries, [name]: value }));
        }
    };
    useEffect(() => {
        setQueries(filters);
    }, [filters]);
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
                    <Text variant="h4" display={{ md: "none" }}
                        alignItems={{ md: "center" }}
                        justifyContent="space-between"
                        px={{ xs: 0, md: 3 }}>
                        {blogT("blogCategory.title")}
                    </Text>
                    <Button
                        onClick={onShow}
                        startIcon={<PlusIcon />}
                        size="extraSmall"
                        variant="primary"
                        sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
                    >
                        {blogT("actions.createBlog")}
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
                        value={queries?.searchKey}
                        rootSx={{ height: { xs: 32, md: 32 } }}
                    />

                    <Dropdown
                        placeholder={blogT("actions.status")}
                        options={blogOptions}
                        name="status"
                        onChange={onChangeQueries}
                        value={queries?.status !== undefined ? queries.status : null}
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
                    initialValues={INITIAL_VALUES as BlogFormData}
                    onSubmit={onCreateNewBlog}
                />
            )}
        </>
    )
}
export default memo(Actions);
const BLOG_STATUS_OPTIONS = [
    { label: BlogStatus[BlogStatus.PUBLISHED], value: BlogStatus.PUBLISHED },
    { label: BlogStatus[BlogStatus.DRAFT], value: BlogStatus.DRAFT },
    { label: BlogStatus[BlogStatus.HIDE], value: BlogStatus.HIDE },
];
const INITIAL_VALUES = {
    title: "",
    content: "",
    category: [],
    tag: [],
    slug: "",
    short_description:"",
};
