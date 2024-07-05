"use client";

import {
  memo,
  useEffect,
  useState,
  useMemo,
  useCallback,
  ChangeEvent,
} from "react";
import { Stack, TableRow } from "@mui/material";
import {
  TableLayout,
  BodyCell,
  CellProps,
  ActionsCell,
} from "components/Table";
import { DEFAULT_PAGING, NS_COMMON, NS_MANAGER } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import Pagination from "components/Pagination";
import { usePathname, useRouter } from "next-intl/client";
import { getPath } from "utils/index";
import { IconButton, Text, Checkbox } from "components/shared";
import { useCompanies } from "store/manager/selectors";
import { Company } from "store/company/reducer";
import useBreakpoint from "hooks/useBreakpoint";
import CircleTickIcon from "icons/CircleTickIcon";
import CloseSquareIcon from "icons/CloseSquareIcon";
import DesktopCells from "./DesktopCells";
import MobileContentCell from "./MobileContentCell";
import { ApproveOrRejectConfirm } from "./components";
import { useTranslations } from "next-intl";
import { PayStatus } from "constant/enums";
import { CompanyStatus } from "store/manager/actions";
import FixedLayout from "components/FixedLayout";
import { HEADER_HEIGHT } from "layouts/Header";

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
    onGetCompanies,
    onApproveOrReject: onApproveOrRejectAction,
  } = useCompanies();

  const commonT = useTranslations(NS_COMMON);
  const managerT = useTranslations(NS_MANAGER);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();

  const [selectedList, setSelectedList] = useState<Company[]>([]);
  const [action, setAction] = useState<number | undefined>();
  const [id, setId] = useState<string | undefined>();

  const nOfWaitings = useMemo(
    () =>
      items.filter(
        (item) =>
          item.is_approve === undefined && item.status === PayStatus.PAID,
      ).length,
    [items],
  );

  const isCheckedAll = useMemo(
    () => Boolean(selectedList.length && selectedList.length === nOfWaitings),
    [selectedList.length, nOfWaitings],
  );

  const textAction = useMemo(
    () => (action !== undefined ? managerT(TEXT_ACTION[action]) : ""),
    [action, managerT],
  );

  const onChangeAll = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const isChecked = event.target.checked;
      if (isChecked) {
        setSelectedList(
          items.filter(
            (item) =>
              item.is_approve === undefined && item.status === PayStatus.PAID,
          ),
        );
      } else {
        setSelectedList([]);
      }
    },
    [items],
  );

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: commonT("name"), width: "25%", align: "left" },
      { value: "Email", width: "25%", align: "left" },
      { value: commonT("creationDate"), width: "19%" },
      { value: commonT("status"), width: "20%" },
    ],
    [commonT],
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
      { value: "", width: isMdSmaller ? "15%" : "8%" },
    ] as CellProps[];
  }, [isMdSmaller, desktopHeaderList, isCheckedAll, onChangeAll]);

  const onToggleSelect = (item: Company, indexSelected: number) => {
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

  const onResetAction = () => {
    setAction(undefined);
    setId(undefined);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeQueries = (queries: { [key: string]: any }) => {
    const newQueries = { ...query, ...queries };
    const path = getPath(pathname, newQueries);
    push(path);

    onGetCompanies(newQueries);
  };

  const onChangePage = (newPage: number) => {
    onChangeQueries({ pageIndex: newPage, pageSize });
  };

  const onChangeSize = (newPageSize: number) => {
    onChangeQueries({ pageIndex: 1, pageSize: newPageSize });
  };

  const onApproveOrReject = (type: CompanyStatus, id?: string) => {
    return () => {
      setAction(type);
      setId(id);
    };
  };

  const onSubmitApproveOrReject = async () => {
    if (action === undefined) return;
    const ids = id ? [id] : selectedList.map((item) => item.id);
    try {
      const idsResponse = await onApproveOrRejectAction(ids, action);
      if (idsResponse.length) {
        setAction(undefined);
        setSelectedList([]);
        setId(undefined);
      }
      return idsResponse;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    if (!isReady) return;
    onGetCompanies({ ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, onGetCompanies]);

  useEffect(() => {
    setSelectedList([]);
  }, [pageIndex]);

  return (
    <>
      <FixedLayout>
        {!!selectedList.length && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            pb={0.25}
            border={{ md: "1px solid" }}
            borderColor={{ md: "grey.100" }}
            borderBottom="none"
            sx={{ borderTopLeftRadius: 1, borderTopRightRadius: 1 }}
            px={{ xs: 0.75, md: 1 }}
            py={1.125}
            justifyContent={{ xs: "flex-end", md: "flex-start" }}
            bgcolor={{ xs: "grey.50", md: "transparent" }}
          >
            <Checkbox
              checked={isCheckedAll}
              onChange={onChangeAll}
              sx={{ mr: "auto", display: { md: "none" } }}
            />
            <IconButton
              size="small"
              onClick={onApproveOrReject(CompanyStatus.APPROVE)}
              tooltip={managerT("approve")}
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
              <CircleTickIcon filled={false} fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              onClick={onApproveOrReject(CompanyStatus.REJECT)}
              tooltip={managerT("reject")}
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
              <CloseSquareIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
        <TableLayout
          headerList={headerList}
          pending={isFetching}
          error={error as string}
          noData={!isIdle && totalItems === 0}
          px={{ xs: 0, md: 3 }}
          headerProps={{
            sx: { px: { xs: 0.5, md: 2 }, wordBreak: "break-all" },
          }}
          containerHeaderProps={{
            sx: selectedList.length
              ? {
                  maxHeight: { xs: 0, md: undefined },
                  minHeight: { xs: 0, md: HEADER_HEIGHT },
                }
              : {},
          }}
        >
          {items.map((item) => {
            const indexSelected = selectedList.findIndex(
              (selected) => selected.id === item.id,
            );
            return (
              <TableRow key={item.id}>
                <BodyCell sx={{ pl: { xs: 0.5, md: 2 } }}>
                  {item.is_approve === undefined &&
                    item.status === PayStatus.PAID && (
                      <Checkbox
                        checked={indexSelected !== -1}
                        onChange={onToggleSelect(item, indexSelected)}
                      />
                    )}
                </BodyCell>
                {isMdSmaller ? (
                  <MobileContentCell item={item} />
                ) : (
                  <DesktopCells item={item} />
                )}

                <ActionsCell
                  sx={{
                    pl: { xs: 0.5, md: 2 },
                    verticalAlign: { xs: "top", md: "middle" },
                    pt: { xs: 2, md: 0 },
                  }}
                  iconProps={{
                    sx: {
                      p: { xs: "4px!important", md: 1 },
                    },
                  }}
                  options={
                    item.is_approve === undefined &&
                    item.status === PayStatus.PAID
                      ? [
                          {
                            content: managerT("approve"),
                            onClick: onApproveOrReject(
                              CompanyStatus.APPROVE,
                              item.id,
                            ),
                            icon: (
                              <CircleTickIcon filled={false} fontSize="small" />
                            ),
                          },
                          {
                            content: managerT("reject"),
                            onClick: onApproveOrReject(
                              CompanyStatus.REJECT,
                              item.id,
                            ),
                            icon: <CloseSquareIcon fontSize="small" />,
                          },
                        ]
                      : undefined
                  }
                />
              </TableRow>
            );
          })}
        </TableLayout>

        <Pagination
          totalItems={totalItems}
          totalPages={totalPages}
          page={pageIndex}
          pageSize={pageSize}
          containerProps={{ px: { md: 3 }, py: 1 }}
          onChangePage={onChangePage}
          onChangeSize={onChangeSize}
        />
      </FixedLayout>

      <ApproveOrRejectConfirm
        open={action !== undefined}
        onClose={onResetAction}
        title={managerT("companyList.confirm.title", { label: textAction })}
        content={managerT("companyList.confirm.content", {
          label: textAction,
          count: id ? 1 : selectedList.length,
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

const TEXT_ACTION: { [key: number]: string } = {
  [CompanyStatus.APPROVE]: "approve",
  [CompanyStatus.REJECT]: "reject",
};
