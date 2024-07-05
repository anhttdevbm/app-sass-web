import { Stack } from "@mui/material";
import { BodyCell } from "components/Table";
import { Text } from "components/shared";
import { memo } from "react";
import { NS_BLOG } from "constant/index";
import { useTranslations } from "next-intl";
import { CategoryBlogData } from "store/blog-category/reducer";

type MobileContentCellProps = {
    item: CategoryBlogData;
}
type InformationItemProps = {
    label: string;
    children?: string | React.ReactNode;
}

const MobileContentCell = (props: MobileContentCellProps) => {
    const blogT = useTranslations(NS_BLOG);

    const { item } = props;
    return (
        <BodyCell align="left">
            <Stack spacing={2} py={1.5}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Text variant="h6">{item.id}</Text>
                </Stack>
                <InformationItem label={blogT("blogCategoryList.name")}>{item.name}</InformationItem>
                <InformationItem label={blogT("blogCategoryList.slug")}><Text>{item.slug}</Text>
                </InformationItem>

                <InformationItem label={blogT("blogCategoryList.detail")}>
                    {item.detail}
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
