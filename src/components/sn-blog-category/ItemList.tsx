"use client";
import { Stack, TableRow } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import {
    ActionsCell,
    BodyCell,
    CellProps,
    TableLayout,
} from "components/Table";
import { NS_BLOG } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { HEADER_HEIGHT } from "layouts/Header";
import { useTranslations } from "next-intl";
import { memo, useEffect, useMemo, useState } from "react";
// import { useCategoryBlogs } from "store/blog-category/selectors";
import DesktopCells from "./components/DesktopCells";
import MobileContentCells from "./components/MobileContentCells";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import { DataAction } from "constant/enums";
import { CategoryBlogData } from "store/blog-category/reducer";
import Form from "./components/Form";
import { useCategoryBlog } from "store/blog-category/selectors";
import useQueryParams from "hooks/useQueryParams";
import { getMessageErrorByAPI } from "utils/index";
import ConfirmDialog from "components/ConfirmDialog";
const ItemList = () => {
    const blogT = useTranslations(NS_BLOG);
    const dispatch = useDispatch<AppDispatch>();
    const [item, setItem] = useState<CategoryBlogData>();
    const [action, setAction] = useState<DataAction | undefined>();
    const [categoryBlogId, setCategoryBlogId] = useState<string | undefined>();

    const { isMdSmaller } = useBreakpoint();
    // const { loading, categories } = useSelector((state: RootState) => state.categoryBlogs);
    const { initQuery, isReady, query } = useQueryParams();

    const {
        onUpdateCategoryBlog,
        onDeleteCategoryBlog,
        onGetCategoryBlogs,
        items,
    } = useCategoryBlog();

    // useEffect(() => {
    //     dispatch(getAllBlogCategory());
    // },);

    const onUpdateCategory = async (data: CategoryBlogData) => {
        if (!item) return; // Nếu item là undefined, thoát khỏi hàm
        return await onUpdateCategoryBlog(item.id as string, data);
    };

    const onSubmitDelete = async () => {
        if (!categoryBlogId) return;
        try {
            try {
                return await onDeleteCategoryBlog(categoryBlogId as string);
            } catch (error) {
                onAddSnackbar(getMessageErrorByAPI(error, blogT), "error");
            }
        } catch (error) {
            throw error;
        }
    };

    // const {
    //     items,
    //     onGetCategoryBlogs
    // } = useCategoryBlogs();
    const desktopHeaderList: CellProps[] = useMemo(
        () => [
            { value: blogT("blogCategoryList.id"), width: "15%", align: "left" },
            { value: blogT("blogCategoryList.name"), width: "25%", align: "left" },
            { value: blogT("blogCategoryList.slug"), width: "20%", align: "left" },
            { value: blogT("blogCategoryList.detail"), width: "25%", align: "left" },
        ],
        [blogT],
    );
    const headerList = useMemo(() => {
        const additionalHeaderList = isMdSmaller
            ? MOBILE_HEADER_LIST
            : desktopHeaderList;

        return [
            ...additionalHeaderList,
            { value: "", width: isMdSmaller ? "20%" : "8%" },
        ] as CellProps[];
    }, [isMdSmaller, desktopHeaderList]);

    useEffect(() => {
        if (!isReady) return;
        onGetCategoryBlogs({ ...initQuery });
    }, [initQuery, isReady, onGetCategoryBlogs]);

    const onActionToItem = (action: DataAction, item?: CategoryBlogData) => {
        return () => {
            if (action === DataAction.DELETE) {
                setCategoryBlogId(item?.slug);
            } else {
                item && setItem(item);
            }
            setAction(action);
        };
    };

    const onResetAction = () => {
        setItem(undefined);
        setAction(undefined);
        setCategoryBlogId(undefined);
    };
    return (
        <>
            <FixedLayout>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={2}
                    pb={0.25}
                    border="1px solid"
                    borderColor="grey.100"
                    borderBottom="none"
                    sx={{ borderTopLeftRadius: 1, borderTopRightRadius: 1 }}
                    px={{ xs: 0.75, md: 1.125 }}
                    py={1.125}
                    mx={{ xs: 0, md: 3 }}
                ></Stack>
                <TableLayout
                    headerList={headerList}
                    px={{ xs: 0, md: 3 }}
                    containerHeaderProps={{
                        sx: {
                            maxHeight: { xs: 0, md: undefined },
                            minHeight: { xs: 0, md: HEADER_HEIGHT },
                        },
                    }}
                    sx={{ bgcolor: { xs: "grey.50", md: "transparent" } }}
                >
                    {items.map((item, index) => {
                        return (
                            <TableRow key={index}>
                                {isMdSmaller ? (
                                    <MobileContentCells item={item} />
                                ) : (
                                    <DesktopCells item={item} />
                                )}
                                <ActionsCell
                                    sx={{
                                        pl: { xs: 0.5, md: 0 },
                                        verticalAlign: { xs: "top", md: "middle" },
                                        pt: { xs: 2, md: 0 },
                                    }}
                                    iconProps={{
                                        sx: {
                                            p: { xs: "4px!important", lg: 1 },
                                        },
                                    }}
                                    onEdit={onActionToItem(DataAction.UPDATE, item)}
                                    onDelete={onActionToItem(DataAction.DELETE, item)}
                                    hasPopup={false}
                                />
                            </TableRow>
                        );
                    })}
                </TableLayout>
            </FixedLayout>
            {action === DataAction.UPDATE && (
                <Form
                    open
                    onClose={onResetAction}
                    type={DataAction.UPDATE}
                    initialValues={
                        {
                            id: item?.id,
                            name: item?.name,
                            detail: item?.detail,
                            slug: item?.slug,
                        } as CategoryBlogData
                    }
                    onSubmit={onUpdateCategory}
                />
            )}

            <ConfirmDialog
                open={action === DataAction.DELETE}
                onClose={onResetAction}
                title={blogT("blogCategory.confirmRemove.title")}
                content={blogT("blogCategory.confirmRemove.content")}
                onSubmit={onSubmitDelete}
            />
        </>
    );
};

export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "", width: "75%", align: "left" }];
function onAddSnackbar(arg0: string, arg1: string) {
    throw new Error("Function not implemented.");
}
