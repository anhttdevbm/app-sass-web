"use client";

import { IconButton, Stack, TableRow } from "@mui/material";
import FixedLayout from "components/FixedLayout";
import { Checkbox } from "components/shared";
import {
  ActionsCell,
  CellProps,
  TableLayout
} from "components/Table";
import { DataAction, Permission } from "constant/enums";
import { DEFAULT_PAGING, NS_COMMON, NS_COMPANY } from "constant/index";
import useBreakpoint from "hooks/useBreakpoint";
import useQueryParams from "hooks/useQueryParams";
import DuplicateIcon from "icons/DuplicateIcon";
import EditIcon from "icons/EditIcon";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next-intl/client";
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAuth } from "store/app/selectors";
import { useClientCompanies } from "store/company/selectors";
import { getPath } from "utils/index";
import { client, Endpoint } from "../../api";
import TrashIcon from "../../icons/TrashIcon";
import { DesktopCells, MobileContentCell } from "./components";
import DeleteConfirm from "./components/DeleteConfirm";
import DuplicateForm from "./components/DuplicateForm";
import Form from "./components/Form";
import Pagination from "./components/Pagination";
import { ClientCompany } from "./type";

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
    onGetClientCompanies,
    onDeleteClientCompany,
    onMultipleDeleteClientCompany,
    onCreateClientCompany,
    onUpdateClientCompany,
  } = useClientCompanies();
  const companyT = useTranslations(NS_COMPANY);
  const commonT = useTranslations(NS_COMMON);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { user } = useAuth();

  const { isMdSmaller } = useBreakpoint();
  const actionCellRef = useRef<HTMLDivElement>(null);

  const [item, setItem] = useState<ClientCompany | undefined>();
  const [selected, setSelected] = useState<ClientCompany | undefined>(
    undefined,
  );
  const [action, setAction] = useState<DataAction | undefined>();
  const [selectedList, setSelectedList] = useState<ClientCompany[]>([]);
  const [deleteType, setDeleteType] = useState<"single" | "multiple">("single");
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

  const onToggleSelect = (item: ClientCompany, indexSelected: number) => {
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

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: "No", width: "8%", align: "center" },
      {
        value: commonT("name"),
        width: "45%",
        align: "left",
        sort: true,
      },
      {
        value: companyT("clientCompany.createBy"),
        width: "20%",
        align: "left",
        sort: true,
      },
      {
        value: companyT("clientCompany.createDate"),
        width: "15%",
        align: "center",
        sort: true,
      },
    ],
    [commonT, companyT],
  );

  const MobileHeader = (props: {
    checked: boolean;
    disable: boolean;
    setAction: (value: DataAction) => void;
    setDeleteType: (value: "single" | "multiple") => void;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  }) => {
    const { checked, disable, onChange, setAction, setDeleteType } = props;
    return (
      <Stack direction="row" justifyContent="space-between">
        <Checkbox sx={{ pl: 1 }} checked={checked} onChange={onChange} />
        <IconButton
          size="medium"
          disabled={disable}
          onClick={() => {
            setDeleteType("multiple");
            setAction(DataAction.DELETE);
          }}
        >
          <TrashIcon color="error" />
        </IconButton>
      </Stack>
    );
  };

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller ? [] : desktopHeaderList;
    const list = [
      ...(isMdSmaller
        ? [
          {
            value: (
              <MobileHeader
                checked={isCheckedAll}
                onChange={onChangeAll}
                setAction={setAction}
                setDeleteType={setDeleteType}
                disable={selectedList?.length === 0}
              />
            ),
            width: "100%",
            align: "left",
          },
        ]
        : []),
      ...additionalHeaderList,
      ...(isMdSmaller
        ? []
        : [
          {
            value: "",
            width: "6%",
          },
        ]),
    ];
    return list as CellProps[];
  }, [
    isMdSmaller,
    desktopHeaderList,
    isCheckedAll,
    onChangeAll,
    selectedList,
    setAction,
    setDeleteType,
  ]);

  const onActionToItem = (action: DataAction, item?: ClientCompany) => {
    return () => {
      if (action === DataAction.DELETE || action === DataAction.UPDATE) {
        setDeleteType("single");
        item && setSelected(item);
      } else {
        item && setItem(item);
      }
      setAction(action);
    };
  };

  const onResetAction = () => {
    setItem(undefined);
    setAction(undefined);
  };
  const onChangeQueries = async (queries: { [key: string]: number }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);
    push(path);
    await onGetClientCompanies({ ...newQueries });
  };

  const onChangePage = async (newPage: number) => {
    await onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = async (newPageSize: number) => {
    await onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  const onDuplicateClientCompany = async (data: ClientCompany) => {
    if (!item) return;
    return await onCreateClientCompany(data);
  };

  const onSubmitDelete = async (type: "single" | "multiple" = "single") => {
    try {
      if (type === "single" && selected?.id) {
        return await onDeleteClientCompany(selected?.id);
      } else if (type === "multiple" && !!selectedList?.length) {
        const ids = (selectedList?.map((item) => item?.id) || []) as string[];
        const result = await onMultipleDeleteClientCompany(ids);
        setSelectedList([]);
        return result;
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  };

  const onUpdate = async (data: ClientCompany) => {
    const payload = { ...data };
    if (data.files) {
      const logoUrl = await client.uploadFileV2(Endpoint.UPLOAD_FILE_V2, data?.files);
      payload.avatar = logoUrl;
    } else {
      delete payload["files"];
    }
    return await onUpdateClientCompany(payload);
  };

  useEffect(() => {
    if (!isReady) return;
    onGetClientCompanies({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetClientCompanies]);

  return (
    <>
      <FixedLayout rounded="unset">
        <TableLayout
          headerList={headerList}
          pending={isFetching}
          error={error as string}
          noData={!isIdle && items.length === 0}
          // mt={3}
          px={{ xs: 0, md: 3 }}
          headerProps={{
            sx: {
              px: { xs: 0.5, md: 2 },
              wordBreak: "break-all",
              overflow: "auto",
              py: "2px",
              height: "50px",
              verticalAlign: "middle",
              background: "#D9F0FD",
              color: "#999999",
              h6: { fontSize: "13px" }
            }
          }}
        >
          {items.map((item, index) => {
            const indexSelected = selectedList.findIndex(
              (selected) => selected.id === item.id,
            );
            return (
              <TableRow key={item.id}>
                {isMdSmaller ? (
                  <MobileContentCell
                    item={item}
                    indexSelected={indexSelected}
                    checked={indexSelected !== -1}
                    actionCellRef={actionCellRef}
                    onUpdate={onActionToItem(DataAction.UPDATE, item)}
                    onDuplicate={onActionToItem(DataAction.OTHER, item)}
                    onDelete={onActionToItem(DataAction.DELETE, item)}
                    onToggleSelect={onToggleSelect}
                  />
                ) : (
                  <DesktopCells
                    item={item}
                    order={(pageIndex - 1) * pageSize + (index + 1)}
                  />
                )}

                {!isMdSmaller && !user?.roles.includes(Permission.ST) && (
                  <ActionsCell
                    sx={{
                      verticalAlign: "middle",
                      textAlign: "right",
                    }}
                    ref={actionCellRef}
                    options={[
                      {
                        content: commonT("edit"),
                        onClick: onActionToItem(DataAction.UPDATE, item),
                        icon: (
                          <EditIcon
                            sx={{ color: "grey.400" }}
                            fontSize="medium"
                          />
                        ),
                      },
                      {
                        content: companyT("clientCompany.duplicate"),
                        onClick: onActionToItem(DataAction.OTHER, item),
                        icon: (
                          <DuplicateIcon
                            sx={{ color: "grey.400" }}
                            fontSize="medium"
                          />
                        ),
                      },
                    ]}
                    onDelete={onActionToItem(DataAction.DELETE, item)}
                    hasPopup={false}
                  />
                )}
              </TableRow>
            );
          })}
        </TableLayout>

        <Pagination
          sx={{
            ".MuiPaginationItem-page.Mui-selected": {
              background: "#14B9E5!important",
              borderColor: "transparent",
              color: "white",
              borderRadius: "12px",
            },
            ".MuiPaginationItem-previousNext": {
              background: "#D9F0FD!important",
              borderColor: "transparent",
              color: "black",
              borderRadius: "12px",
            },
            ".MuiPaginationItem-page": {
              background: "#D9F0FD!important",
              borderColor: "transparent",
              color: "black",
              borderRadius: "12px",
            },

          }}
          totalItems={totalItems}
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>
      {action === DataAction.OTHER && item && (
        <DuplicateForm
          open
          onClose={onResetAction}
          type={DataAction.UPDATE}
          initialValues={item}
          onSubmit={onDuplicateClientCompany}
        />
      )}

      {action === DataAction.UPDATE && (
        <Form
          open={action === DataAction.UPDATE}
          onClose={onResetAction}
          type={DataAction.UPDATE}
          initialValues={selected}
          onSubmit={onUpdate}
        />
      )}

      <DeleteConfirm
        open={action === DataAction.DELETE}
        onClose={onResetAction}
        title={companyT("clientCompany.confirmRemove.title")}
        content={companyT("clientCompany.confirmRemove.content")}
        item={selected}
        onSubmit={() => onSubmitDelete(deleteType)}
      />
    </>
  );
};

export default memo(ItemList);
