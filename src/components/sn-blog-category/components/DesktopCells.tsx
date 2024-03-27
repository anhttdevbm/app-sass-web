import { BodyCell } from "components/Table";
import { memo } from "react";
import { CategoryBlogData } from "store/blog-category/reducer";

type DesktopCellsProps = {
    item: CategoryBlogData;
};

const DesktopCells = (props: DesktopCellsProps) => {
    const { item } = props;
    return (
        <>
            <BodyCell align="left">{item.id}</BodyCell>
            <BodyCell align="left">
                {item.name}
            </BodyCell>
            <BodyCell align="left">
                {item.slug}
            </BodyCell>
            <BodyCell align="left">
                {item.detail}
            </BodyCell>
        </>
    );
};
export default memo(DesktopCells);
