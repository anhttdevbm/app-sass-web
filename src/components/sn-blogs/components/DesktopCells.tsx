import { Badge, Chip } from "@mui/material";
import { BodyCell } from "components/Table";
import { NS_BLOG, NS_COMMON } from "constant/index";
import { useTranslations } from "next-intl";
import { memo, useMemo, useState } from "react";
import { BlogData, BlogStatus } from "store/blog/actions";
import { BLOGS_DETAIL_PATH } from "constant/paths";
import { formatDate, getMessageErrorByAPI, getPath } from "utils/index";
import { IconButton } from "components/shared";
import { DataAction } from "constant/enums";
import useTheme from "hooks/useTheme";
import TrashIcon from "icons/TrashIcon";
import DeleteCofirmDialog from "./DeleteCofirmDialog";
import { useBlogs } from "store/blog/selectors";

type DesktopCellsProps = {
    item: BlogData;
};

const DesktopCells = (props: DesktopCellsProps) => {
    const blogT = useTranslations(NS_BLOG);
  const commonT = useTranslations(NS_COMMON);
  const [action, setAction] = useState<DataAction | undefined>();
  const { isDarkMode } = useTheme();
    const { item } = props;
    const {
        onDeleteBlog : onDeleteBlogItem
    } = useBlogs();
    const formatDateWithCustomFormat = (dateString) => {
        const date = new Date(dateString);

        const timeOptions = {
            hour: 'numeric' as const,
            minute: 'numeric' as const,
            hour12: true as const,
        };

        const dateOptions = {
            month: 'short' as const,
            day: 'numeric' as const,
            year: 'numeric' as const,
        };

        const formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);
        const formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);

        return `${formattedTime} | ${formattedDate}`;
    };
  
    const onDeleteBlog = () => {
        setAction(DataAction.DELETE);
      };
      const onResetAction = () => {
        setAction(undefined);
      };
      const onSubmitDelete = async () => {
        if (!item.slug) return;
        try {
            try {
                return await onDeleteBlogItem(item.slug as string);
            } catch (error) {
                onAddSnackbar(getMessageErrorByAPI(error, blogT), "error");
            }
        } catch (error) {
            throw error;
        }
    };

    return (
        <>
            <BodyCell align="left" href={getPath(BLOGS_DETAIL_PATH, undefined, { id: item.slug as string })} linkProps={{
                sx: { color: "text.primary" },
                tooltip: commonT("clickGoDetail", {
                    name: blogT("title"),
                }),
            }}>{item.title}</BodyCell>
            <BodyCell align="left">
               {item.slug}
            </BodyCell>
            <BodyCell align="left">
               {item.short_description}
            </BodyCell>
            <BodyCell align="left">
                {item.tag?.map((tag, index) => (
                    <Chip key={index} variant="outlined" label={tag} size="small" />
                ))}
            </BodyCell>
            <BodyCell align="left">
                {formatDateWithCustomFormat(item?.created_time)}
            </BodyCell>
            <BodyCell align="left">
            {item.status === BlogStatus.PUBLISHED ? (
                        <Chip size="small" label={blogT("status.published")} color="success" />
                    ) : item.status === BlogStatus.DRAFT ? (
                        <Chip size="small" label={blogT("status.draft")} color="primary" />
                    ) : (
                        <Chip size="small" label={blogT("status.hide")} color="default" />
                    )}
            </BodyCell>
            <BodyCell align="left">
            <IconButton
                  size="small"
                  onClick={onDeleteBlog}
                  tooltip={blogT("actions.delete.remove")}
                  sx={{
                    backgroundColor: "primary.light",
                    color: "text.primary",
                    p: { xs: "4px!important", md: 1 },
                    "&:hover svg": {
                      color: "common.white",
                    },
                  }}
                  variant="contained"
                >
                  <TrashIcon fontSize="small" />
                </IconButton>
            </BodyCell>
            <DeleteCofirmDialog
                open={action === DataAction.DELETE}
                onClose={onResetAction}
                title={blogT("actions.delete.title")}
                content={blogT("actions.delete.confirm")}
                onSubmit={onSubmitDelete}
                action=""
            />
        </>
    );
};

export default memo(DesktopCells);
function onAddSnackbar(arg0: string, arg1: string) {
    throw new Error("Function not implemented.");
}
