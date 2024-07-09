"use client";

import {
  memo,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  paginationItemClasses,
  Stack,
  TableRow,
} from "@mui/material";
import { TableLayout, BodyCell, CellProps } from "components/Table";
import { useProjects } from "store/project/selectors";
import { DEFAULT_PAGING, NS_COMMON, NS_PROJECT } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import Pagination from "components/Pagination";
import { usePathname, useRouter } from "next-intl/client";
import { cleanObject, stringifyURLSearchParams } from "utils/index";
import { IconButton } from "components/shared";
import PencilIcon from "icons/PencilIcon";
import useBreakpoint from "hooks/useBreakpoint";
import Form, { ProjectDataForm } from "./Form";
import { Member, Project } from "store/project/reducer";
import { ProjectData, getMembersOfProject } from "store/project/actions";
import { DataAction } from "constant/enums";
import { INITIAL_VALUES } from "./components/helpers";
import { useAppDispatch } from "store/hooks";
import DesktopCells from "./DesktopCells";
import MobileContentCell from "./MobileContentCell";
import { useTranslations } from "next-intl";
import useTheme from "hooks/useTheme";
import PencilUnderlineIcon from "icons/PencilUnderlineIcon";
import FixedLayout from "components/FixedLayout";
import { Option } from "constant/types";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteIcon from "@mui/icons-material/Delete";
import OverflowMenu from "./components/OverflowMenu";

const ItemList = () => {
  const {
    items,
    isFetching,
    isIdle,
    error,
    totalItems,
    pageSize,
    pageIndex,
    totalPages,
    onGetProjects,
    onUpdateProject: onUpdateProjectAction,
  } = useProjects();
  const commonT = useTranslations(NS_COMMON);
  const projectT = useTranslations(NS_PROJECT);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();
  const { isDarkMode } = useTheme();

  const [item, setItem] = useState<Project | undefined>();
  const [action, setAction] = useState<DataAction | undefined>();

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: "#", width: "5%", align: "center" },
      {
        value: projectT("list.form.title.name"),
        width: "23%",
        align: "left",
      },
      {
        value: commonT("assigner"),
        width: "22.5%",
        align: "left",
      },
      { value: commonT("status"), width: "12.5%" },
      { value: "", width: "5%" },
      { value: "", width: "5%" },
    ],
    [commonT, projectT],
  );
  const mobileHeaderList: CellProps[] = useMemo(
    () => [
      {
        value: commonT("name"),
        width: "20%",
        align: "left",
      },
      {
        value: commonT("assigner"),
        width: "25%",
        align: "left",
      },
      {
        value: commonT("creationDate"),
        width: "15%",
        align: "left",
      },
      { value: commonT("status"), width: "25%" },
      { value: "", width: "10%" },
    ],
    [commonT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? [...mobileHeaderList, { value: "", width: "10%" }]
      : desktopHeaderList;
    return additionalHeaderList as CellProps[];
  }, [desktopHeaderList, isMdSmaller, mobileHeaderList]);

  const initValues = useMemo(
    () =>
      item
        ? {
            avatar: item?.avatar?.link,
            name: item.name,
            description: item.description,
            owner: item?.owner?.id,
            type_project: {
              value: item?.type_project?.id,
              label: item?.type_project?.name,
            } as Option,
            start_date: item?.start_date
              ? new Date(item.start_date).getTime()
              : undefined,
            end_date: item?.end_date
              ? new Date(item.end_date).getTime()
              : undefined,
            expected_cost: item?.expected_cost,
            currency: item?.currency,
            working_hours: item?.working_hours,
            members: item?.members.map(({ id, fullname, ...rest }) => ({
              id,
              fullname,
            })),
          }
        : INITIAL_VALUES,
    [item],
  );

  const onActionToItem = (action: DataAction, item?: Project) => {
    return () => {
      item && setItem(item);
      setAction(action);
    };
  };

  const onResetAction = () => {
    setItem(undefined);
    setAction(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (queries: { [key: string]: any }) => {
    let newQueries = { ...query, ...queries };
    newQueries = cleanObject(newQueries);
    const queryString = stringifyURLSearchParams(newQueries);
    push(`${pathname}${queryString}`);

    onGetProjects(newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  const onUpdateProject = async (data: ProjectData) => {
    if (!item) return;
    return await onUpdateProjectAction(item.id, data);
  };

  useEffect(() => {
    if (!isReady) return;
    onGetProjects({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetProjects]);

  return (
    <>
      <Stack>
        <TableLayout
          headerList={headerList}
          pending={isFetching}
          headerProps={{
            sx: {
              px: { xs: 0.5, md: 2 },
              py: { xs: 0.5, md: 3 },
              bgcolor: "#D9F0FD",
            },
          }}
          error={error as string}
          noData={!isIdle && totalItems === 0}
          px={{ md: 3 }}
        >
          {items.map((item, index) => {
            return (
              <TableRow key={item.id}>
                {isMdSmaller ? (
                  <MobileContentCell item={item} />
                ) : (
                  <DesktopCells
                    item={item}
                    order={(pageIndex - 1) * pageSize + (index + 1)}
                  />
                )}
                <BodyCell align="center">
                  <OverflowMenu>
                    <MenuItem onClick={onActionToItem(DataAction.UPDATE, item)}>
                      <ListItemIcon>
                        <PencilUnderlineIcon sx={{ fontSize: 24 }} />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={onActionToItem(DataAction.DELETE, item)}>
                      <ListItemIcon>
                        <DeleteIcon sx={{ fontSize: 24, color: "red" }} />
                      </ListItemIcon>
                      <ListItemText sx={{ color: "red" }}>Delete</ListItemText>
                    </MenuItem>
                  </OverflowMenu>
                </BodyCell>
              </TableRow>
            );
          })}
        </TableLayout>
        <Pagination
          totalItems={totalItems}
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          containerProps={{ px: { md: 3 }, py: 1, gap: 6 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
          sx={{
            [`& .${paginationItemClasses.root}`]: {
              fontWeight: 600,
              bgcolor: "#D9F0FD",
            },
          }}
        />
      </Stack>

      {action === DataAction.UPDATE && (
        <Form
          open
          onClose={onResetAction}
          type={DataAction.UPDATE}
          initialValues={initValues as unknown as ProjectDataForm}
          onSubmit={onUpdateProject}
        />
      )}
    </>
  );
};

export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "#", width: "75%", align: "left" }];
