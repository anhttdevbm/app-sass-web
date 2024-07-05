"use client";

import Wrapper from "components/Wrapper";
import { BLOGS_DETAIL_PATH, BLOGS_PATH } from "constant/paths";
import { usePathname } from "next-intl/client";
import { useEffect, useMemo, useRef } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useBlogs } from "store/blog/selectors";
import { getPath } from "utils/index";

type BlogDetailLayoutProps = {
    children: React.ReactNode;
    id: string;
};

const BlogDetailLayout = ({ children, id }: BlogDetailLayoutProps) => {
    const { onGetBlogBySlug, item } = useBlogs();
    const { filters, page, size } = useBlogs();
    const { onUpdateHeaderConfig } = useHeaderConfig();

    const pathname = usePathname();

    const isBlogDetailPath = useMemo(
        () => pathname.replace(id, "{id}") === BLOGS_DETAIL_PATH,
        [id, pathname],
    );

    const dataStringifyRef = useRef<string | undefined>();

    useEffect(() => {
        if (!id) return;
        onGetBlogBySlug(id)
    }, [id, onGetBlogBySlug]);

    useEffect(() => {
        dataStringifyRef.current = JSON.stringify({
            ...filters,
            page,
            size,
        });
    }, [filters, page, size]);

    useEffect(() => {
        const parsedQueries = dataStringifyRef.current
            ? JSON.parse(dataStringifyRef.current)
            : {};

        const prevPath = getPath(BLOGS_PATH, parsedQueries);

        onUpdateHeaderConfig({
            title: item?.slug,
            searchPlaceholder: undefined,
            prevPath,
        });
        return () => {
            onUpdateHeaderConfig({
                title: undefined,
                searchPlaceholder: undefined,
                prevPath: undefined,
            });
        };
    }, [item?.slug, onUpdateHeaderConfig]);

    return (
        <Wrapper overflow="auto" inFrame={isBlogDetailPath}>
            {children}
        </Wrapper>
    );
};

export default BlogDetailLayout;
