import { useCallback, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { useAppDispatch, useAppSelector } from "store/hooks";
import {
    BlogData,
    BlogFormData,
    CommentBlogData,
    GetBlogListQueries,
    createBlogComment,
    createNewBlogs,
    deleteBlog,
    getAllBlogs,
    getBlogBySlug,
    getBlogComments,
    getListBlogTags,
    getRelatedBlog,
    updateBlog,
    updatePublished,
    uploadFile,
} from "./actions";
import { DataStatus } from "constant/enums";
import { clientStorage } from "utils/storage";
import { ACCESS_TOKEN_STORAGE_KEY, IMAGES_ACCEPT } from "constant/index";


export const useBlogs = () => {
    const dispatch = useAppDispatch();
    const { blogs: items, blogsStatus: status, 
        blogsError: error, blogsFilters: filters, 
        blog: item, relatedBlogs, 
        listBlogComment, listBlogTag } =
        useAppSelector(
            (state) => state.blogs,
            shallowEqual,
        );
    const { page, size, totalItems, total_page } = useAppSelector(
        (state) => state.blogs.blogsPaging,
        shallowEqual,
    );
    const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
    const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

    const onGetBlogs = useCallback(
        async (queries: GetBlogListQueries) => {
            await dispatch(getAllBlogs({ ...queries }));
        },
        [dispatch],
    );

    const onUpdateBlog = useCallback(
        async (blog: BlogFormData) => {
            try {
                console.log(blog);
                if (blog.backgroundUpload) {
                    const backgroundUploadResponse = await dispatch(
                        uploadFile({
                            file: blog.backgroundUpload,
                        }),
                    );
                    blog.background = backgroundUploadResponse.payload.object;
                }
                console.log(blog.attachments);
                const Token = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
                var id = blog.id as string;
                return await dispatch(updateBlog({ id, blog, Token: Token ?? null })).unwrap();
            } catch (error) {
                throw error;
            }
        },
        [dispatch],
    );



    const onGetBlogBySlug = useCallback(
        async (slug: string) => {
            try {
                return await dispatch(getBlogBySlug(slug)).unwrap();
            } catch (error) {
                throw error;
            }
        }, [dispatch,]
    );

    const onGetRelatedBlogs = useCallback(
        async (slug: string) => {
            try {
                return await dispatch(getRelatedBlog(slug)).unwrap();
            } catch (error) {
                throw error;
            }
        }, [dispatch],
    )

    const onGetBlogComments = useCallback(
        async (slug: string) => {
            try {
                return await dispatch(getBlogComments(slug)).unwrap();
            } catch (error) {
                throw error;
            }
        }, [dispatch],
    )
    const onCreateCommentBlog = useCallback(
        async (id: string, cmt: CommentBlogData, Token: string | null) => {
            try {
                return await dispatch(createBlogComment({ id, cmt, Token })).unwrap();
            } catch (error) {
                console.error("Error submitting form:", error);
                throw error;
            }
        }, [dispatch]
    )

    const onCreateNewBlog = useCallback(
        async (data: BlogFormData) => {
            try {
                if (data.backgroundUpload) {
                    const backgroundUploadResponse = await dispatch(
                        uploadFile({
                            file: data.backgroundUpload,
                        }),
                    );
                    data.background = backgroundUploadResponse.payload.object;
                }
                const Token = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
                return await dispatch(createNewBlogs({ data, Token: Token ?? null })).unwrap();
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],


    );
    const onApproveOrReject = useCallback(
        async () => {
            return null;
        },
        [dispatch]
    );

    const onDeleteBlog = useCallback(
        async (blogIds: string) => {
            try {
                console.log("ids : " + blogIds);
                const Token = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
                return await dispatch(deleteBlog({ ids: blogIds, Token: Token })).unwrap();
            } catch (error) {
                throw error;
            }
        },
        [dispatch]
    );

    const onUpdatePublished = useCallback(
        async (blogIds: string[], published: string) => {
            try {
                const Token = clientStorage.get(ACCESS_TOKEN_STORAGE_KEY);
                return await dispatch(updatePublished({ blogList: blogIds, status: published, Token: Token })).unwrap();
            } catch (error) {
                throw error;
            }
        }, [dispatch]
    );

    const onGetListTag = useCallback(
        async () => {
          try {
            const result = await dispatch(getListBlogTags()).unwrap();
            console.log(result);  // Log the result to check if data is fetched successfully
          } catch (error) {
            throw error;
          }
        },
        [dispatch]
      );
      


    return {
        onGetBlogs,
        onUpdateBlog,
        items,
        status,
        error,
        isIdle,
        isFetching,
        page,
        size,
        totalItems,
        total_page,
        onCreateNewBlog,
        filters,
        onGetBlogBySlug,
        item,
        onGetRelatedBlogs,
        relatedBlogs,
        listBlogComment,
        onGetBlogComments,
        onCreateCommentBlog,
        onApproveOrReject,
        onDeleteBlog,
        onUpdatePublished,
        onGetListTag,
        listBlogTag,
    };
};
