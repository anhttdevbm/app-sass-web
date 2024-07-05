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
import { IconButton, Checkbox } from "components/shared";
import { useCompany, useEmployeesOfCompany } from "store/manager/selectors";
import { Employee } from "store/company/reducer";
import DesktopCells from "./DesktopCells";
import MobileContentCell from "./MobileContentCell";
import { ApproveOrRejectConfirm } from "./components";
import useBreakpoint from "hooks/useBreakpoint";
import CircleTickIcon from "icons/CircleTickIcon";
import CloseSquareIcon from "icons/CloseSquareIcon";
import { useParams } from "next/navigation";
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
    onGetEmployees,
    onApproveOrReject: onApproveOrRejectAction,
  } = useEmployeesOfCompany();
  const { item } = useCompany();
  const commonT = useTranslations(NS_COMMON);
  const managerT = useTranslations(NS_MANAGER);

  const { initQuery, isReady, query } = useQueryParams();
  const pathname = usePathname();
  const { push } = useRouter();
  const { isMdSmaller } = useBreakpoint();

  const companyCode = useMemo(() => item?.code, [item?.code]);

  const [selectedList, setSelectedList] = useState<Employee[]>([]);
  const [action, setAction] = useState<CompanyStatus | undefined>();
  const [id, setId] = useState<string | undefined>();

  const nOfWaitings = useMemo(
    () =>
      items.filter(
        (item) => item.approve === undefined && item.status === PayStatus.PAID,
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
              item.approve === undefined && item.status === PayStatus.PAID,
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
      { value: commonT("name"), width: "20%", align: "left" },
      { value: "Email", width: "20%", align: "left" },
      { value: commonT("creator"), width: "17%", align: "left" },
      { value: commonT("creationDate"), width: "15%" },
      { value: commonT("status"), width: "17%" },
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
      { value: "", width: isMdSmaller ? "20%" : "8%" },
    ] as CellProps[];
  }, [isMdSmaller, desktopHeaderList, isCheckedAll, onChangeAll]);

  const onToggleSelect = (item: Employee, indexSelected: number) => {
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
    if (!companyCode) return;
    onGetEmployees(companyCode, newQueries);
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
    if (action === undefined || !companyCode) return;
    const ids = id ? [id] : selectedList.map((item) => item.id);
    try {
      const idsResponse = await onApproveOrRejectAction(
        ids,
        action,
        companyCode,
      );
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
    if (!isReady || !companyCode) return;
    onGetEmployees(companyCode, { ...DEFAULT_PAGING, ...initQuery });
  }, [initQuery, isReady, companyCode, onGetEmployees]);

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
            spacing={{ xs: 2, md: 3 }}
            px={{ xs: 0.75, md: 3 }}
            py={{ xs: 1.125, md: 3 }}
            pb={{ md: 0.25 }}
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
          headerProps={{ sx: { px: { xs: 0.5, md: 2 } } }}
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
                <BodyCell sx={{ px: { xs: 0.5, md: 2 } }}>
                  {item.approve === undefined &&
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
                    pl: { xs: 0.5, md: 0 },
                    verticalAlign: { xs: "top", md: "middle" },
                    pt: { xs: 2, md: 0 },
                  }}
                  iconProps={{
                    sx: {
                      p: { xs: "4px!important", md: 1 },
                    },
                  }}
                  options={
                    item.approve === undefined && item.status === PayStatus.PAID
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
        title={managerT("employeeList.confirm.title", { label: textAction })}
        content={managerT("employeeList.confirm.content", {
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

const MOBILE_HEADER_LIST = [{ value: "", width: "70%", align: "left" }];

const TEXT_ACTION: { [key in CompanyStatus]: string } = {
  [CompanyStatus.APPROVE]: "approve",
  [CompanyStatus.REJECT]: "reject",
};
