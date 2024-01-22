"use client";
import { Stack, TableRow } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import {
  ActionsCell,
  BodyCell,
  CellProps,
  TableLayout,
} from "components/Table";
import { Checkbox, IconButton } from "components/shared";
import { DEFAULT_PAGING, NS_BLOG, NS_MANAGER } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import { useTranslations } from "next-intl";
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BlogData, BlogStatus } from "store/blog/actions";
import DesktopCells from "./components/DesktopCells";
import MobileContentCell from "./components/MobileContentCell";
import { useBlogs } from "store/blog/selectors";
import useQueryParams from "hooks/useQueryParams";
import Pagination from "components/Pagination";
import { cleanObject, getPath, stringifyURLSearchParams } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import CircleTickIcon from "icons/CircleTickIcon";
import CloseSquareIcon from "icons/CloseSquareIcon";
import ApproveOrRejectConfirm from "./components/ApproveOrRejectConfirm";
import TrashIcon from "icons/TrashIcon";
import DeleteCofirmDialog from "./components/DeleteCofirmDialog";
import { AltRoute } from "@mui/icons-material";
import { DataAction } from "constant/enums";
import UnEyeIcon from "icons/UnEyeIcon";

const ItemList = () => {

  const { items, item, onGetBlogs, page, size, totalItems, total_page, error, status, isFetching, isIdle, onUpdatePublished: onApproveOrRejectAction, onDeleteBlog: onDeleteAction } = useBlogs();
  totalItems;
  const { initQuery, isReady, query } = useQueryParams();
  const { isMdSmaller } = useBreakpoint();
  const [selectedList, setSelectedList] = useState<BlogData[]>([]);
  const [action, setAction] = useState<DataAction | undefined>();
  const [id, setId] = useState<string | undefined>();
  const blogT = useTranslations(NS_BLOG);
  const { push } = useRouter();
  const pathname = usePathname();
  const [published, setPublished] = useState<BlogStatus | undefined>();

  const isCheckedAll = useMemo(
    () => Boolean(selectedList.length && selectedList.length === items.length),
    [selectedList.length, items.length],
  );

  const onChangeAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        setSelectedList(items);
      } else {
        setSelectedList([]);
      }
    },
    [items],
  );
  const onChangeQueries = (queries: { [key: string]: any }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);

    push(path);

    onGetBlogs(newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ page: newPage, size });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ page: 1, size: newPageSize });
  };
  const onToggleSelect = (item: BlogData, indexSelected: number) => {
    return () => {
      if (indexSelected === -1) {
        setSelectedList((prevList) => [...prevList, item]);
      } else {
        setSelectedList((prevList) => {
          const newList = [...prevList];
          newList.splice(indexSelected, 1);
          return newList;
        });
      }
    };
  };
  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: blogT("blogList.title"), width: "15%", align: "center" },
      { value: blogT("blogList.slug"), width: "15%", align: "center" },
      { value: blogT("blogList.short_description"), width: "25%", align: "center" },
      { value: blogT("blogList.tag"), width: "15%", align: "center" },
      { value: blogT("blogList.created_time"), width: "10%", align: "center" },
      { value: blogT("blogList.statusBlog"), width: "10%", align: "center" },
      { value: "", width: "5%", align: "center" },
    ],
    [blogT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? MOBILE_HEADER_LIST
      : desktopHeaderList;

    return [
      {
        value: <Checkbox checked={isCheckedAll} onChange={onChangeAll} />,
        width: isMdSmaller ? "10%" : "3%",
      },
      ...additionalHeaderList,
      { value: "", width: isMdSmaller ? "20%" : "8%" },
    ] as CellProps[];
  }, [isMdSmaller, desktopHeaderList, isCheckedAll, onChangeAll]);

  useEffect(() => {
    if (!isReady) return;
    onGetBlogs({ ...initQuery });
  }, [initQuery, isReady, onGetBlogs]);

  const onApproveOrReject = (type: BlogStatus) => {
    return () => {
      setAction(DataAction.OTHER);
      setPublished(type);
      setId(id);
    };
  };
  const onResetAction = () => {
    setAction(undefined);
    setId(undefined);
    setPublished(undefined);
  };
  const textAction = useMemo(
    () => (published !== undefined ? blogT(TEXT_ACTION[published]) : ""),
    [published, blogT],
  );

  const onSubmitApproveOrReject = async () => {
    if (action === undefined) return;
    const ids = id ? [id] : selectedList.map((item) => item.id);
    const listItem = selectedList;
    try {
      console.log(action);
      const listUpdate = await onApproveOrRejectAction(ids as string[], published as unknown as string);
      setAction(undefined);
      setSelectedList([]);
      setId(undefined);
      setPublished(undefined);
      return listUpdate;
    } catch (error) {
      throw error;
    }
  };
  return (
    <>
      <FixedLayout>
        {!!selectedList.length && (
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
          >
            <Checkbox
              checked={isCheckedAll}
              onChange={onChangeAll}
              sx={{ mr: "auto", display: { md: "none" } }}
            />
            <IconButton
              size="small"
              onClick={onApproveOrReject(BlogStatus.PUBLISHED)}
              tooltip={blogT("actions.published")}
              sx={{
                backgroundColor: "primary.light",
                color: "text.primary",
                p: { xs: "4px!important", md: 1 },
                "&:hover svg": {
                  color: "common.white",
                },
              }}
              variant="contained"
              disabled={!selectedList.length}
            >
              <CircleTickIcon filled={false} fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onApproveOrReject(BlogStatus.HIDE)}
              tooltip={blogT("actions.hide")}
              sx={{
                backgroundColor: "primary.light",
                color: "text.primary",
                p: { xs: "4px!important", md: 1 },
                "&:hover svg": {
                  color: "common.white",
                },
              }}
              variant="contained"
              disabled={!selectedList.length}
            >
              <UnEyeIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}

        <TableLayout
          headerList={headerList}
          pending={isFetching}
          headerProps={{
            sx: { px: { xs: 0.5, md: 2 } },
          }}
          error={error as string}
          noData={!isIdle && totalItems === 0}
          px={{ md: 3 }}
        >
          {items.map((item) => {
            const indexSelected = selectedList.findIndex(
              (selected) => selected.id === item.id,
            );
            return (
              <TableRow key={item.slug}>
                <BodyCell sx={{ pl: { xs: 0.5, md: 2 } }}>
                  <Checkbox
                    checked={indexSelected !== -1}
                    onChange={onToggleSelect(item, indexSelected)}
                  />
                </BodyCell>
                {isMdSmaller ? (
                  <MobileContentCell item={item} />
                ) : (
                  <DesktopCells item={item} />
                )}
              </TableRow>
            );
          })}
        </TableLayout>
        <Pagination
          totalItems={total_page}
          totalPages={total_page}
          page={page}
          pageSize={size}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>
      <ApproveOrRejectConfirm
        open={action === DataAction.OTHER}
        onClose={onResetAction}
        title={blogT("actions.update.title", { label: textAction })}
        content={blogT("actions.update.content", {
          label: textAction
        })}
        items={id ? undefined : selectedList}
        onSubmit={onSubmitApproveOrReject}
        action={textAction}
      />
     
    </>
  );
};
export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "", width: "75%", align: "left" }];

const TEXT_ACTION: { [key in BlogStatus]: string } = {
  [BlogStatus.PUBLISHED]: "PUBLISHED",
  [BlogStatus.DRAFT]: "DRAFT",
  [BlogStatus.HIDE]: "HIDE",
};
