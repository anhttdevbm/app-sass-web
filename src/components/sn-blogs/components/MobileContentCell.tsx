import { Badge, Chip, Stack } from "@mui/material";
import Link from "components/Link";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { NS_BLOG, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import React, { memo } from "react";
import { BlogData, BlogStatus } from "store/blog/actions";
import { BLOGS_DETAIL_PATH } from "constant/paths";
import { formatDate, getPath } from "utils/index";

type MobileContentCellProps = {
    item: BlogData;
}
type InformationItemProps = {
    label: string;
    children?: string | React.ReactNode;
}

const MobileContentCell = (props: MobileContentCellProps) => {
    const blogT = useTranslations(NS_BLOG);
    const commonT = useTranslations(NS_COMMON);

    const { item } = props;
    return (
        <BodyCell align="left">
            <Stack spacing={2} py={1.5}>
                <Link sx={{ color: "text.primary" }} tooltip={commonT("clickGoDetail", { name: blogT("title"), })}
                    href={getPath(BLOGS_DETAIL_PATH, undefined, { id: item.slug as string })}
                    underline="none"
                />

                <Stack direction="row" alignItems="center" spacing={2}>
                    <Text variant="h6">{item.title}</Text>
                </Stack>
                <InformationItem label={blogT("slug")}>
                    {item.slug}
                </InformationItem>
                <InformationItem label={blogT("blogList.short_description")}>
                    {item.short_description}
                </InformationItem>
                <InformationItem label={blogT("tag")}>
                    {item.tag?.map((tag, index) => (
                        <Text key={index}>{tag}</Text>
                    ))}
                </InformationItem>
                <InformationItem label={blogT("created_time")}>{formatDate(item?.created_time, "HH:mm - dd/MM/yyyy")}</InformationItem>
                <InformationItem label={blogT("blogList.statusBlog")}>
                    {item.status === BlogStatus.PUBLISHED ? (
                        <Chip size="small" label={blogT("status.published")} color="success" />
                    ) : item.status === BlogStatus.DRAFT ? (
                        <Chip size="small" label={blogT("status.draft")} color="primary" />
                    ) : (
                        <Chip size="small" label={blogT("status.hide")} color="default" />
                    )}
                </InformationItem>
            </Stack>

        </BodyCell>
    );
}


export default memo(MobileContentCell);

const InformationItem = (props: InformationItemProps) => {
    const { label, children = "--" } = props;

    return (
        <Stack direction="row" alignItems="center" spacing={2}>
            <Text variant="caption" color="grey.400" width={57}>
                {label}
            </Text>
            {typeof children === "string" ? (
                <Text variant="body2" noWrap>
                    {children}
                </Text>
            ) : (
                children
            )}
        </Stack>
    );
};
