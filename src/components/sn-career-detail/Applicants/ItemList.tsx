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
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { HEADER_HEIGHT } from "layouts/Header";
import FixedLayout from "components/FixedLayout";
import { useCareer } from "store/career/selectors"
import useBreakpoint from "hooks/useBreakpoint";
import { NS_APPLICANTS } from "constant/index";
import useQueryParams from "hooks/useQueryParams";
import DesktopCells from "./DesktopCells";
import MobileContentCell from "./MobileContentCell";

const ItemList = () => {
  const {
    item,
    applicants,
    isFetching,
    isIdle,
    error,
    totalItems,
    onGetCareerApplicants,
  } = useCareer()

  const applicantsT = useTranslations(NS_APPLICANTS);
  const { isMdSmaller } = useBreakpoint();
  const { initQuery, isReady, query } = useQueryParams();
  const slug = useMemo(() => item?.slug, [item?.slug]);

  const desktopHeaderList: CellProps[] = useMemo(
    () => [
      { value: applicantsT("applicants.information.first_name"), width: "20%", align: "left" },
      { value: applicantsT("applicants.information.last_name"), width: "20%", align: "left" },
      { value: applicantsT("applicants.information.birth"), width: "10%", align: "left" },
      { value: applicantsT("applicants.information.gender"), width: "10%", align: "left" },
      { value: applicantsT("applicants.information.resume_down"), width: "10%", align: "center" },
      { value: applicantsT("applicants.information.social_link"), width: "15%", align: "center" },
      { value: applicantsT("applicants.information.note"), width: "15%", align: "center" },
    ],
    [applicantsT],
  );

  const headerList = useMemo(() => {
    const additionalHeaderList = isMdSmaller
      ? MOBILE_HEADER_LIST
      : desktopHeaderList;

    return [
      ...additionalHeaderList,
      { value: "", width: isMdSmaller ? "20%" : "8%" },
    ] as CellProps[];
  }, [isMdSmaller, desktopHeaderList]);

  useEffect(() => {
    if (!isReady || !slug) return;
    onGetCareerApplicants(slug);
  }, [isReady, onGetCareerApplicants, slug]);

  return (
    <>
       <FixedLayout>
        <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            pb={0.25}
          ></Stack>
          <TableLayout
            headerList={headerList}
            pending={isFetching}
            error={error as string}
            headerProps={{ sx: { px: { xs: 0.5, md: 2 } } }}
            px={{ xs: 0, md: 3 }}
            containerHeaderProps={{
              sx: {
                maxHeight: { xs: 0, md: undefined },
                minHeight: { xs: 0, md: HEADER_HEIGHT },
              },
            }}
            sx={{ bgcolor: { xs: "grey.50", md: "transparent" } }}
          >
            {applicants.map((item) => {
              return (
                <TableRow key={item.id}>
                  {isMdSmaller ? (
                    <MobileContentCell item={item} />
                  ) : (
                    <DesktopCells item={item} />
                  )}
                </TableRow>
              )
            })}
          </TableLayout>
       </FixedLayout>
    </>
  )
}

export default memo(ItemList);

const MOBILE_HEADER_LIST = [{ value: "", width: "70%", align: "left" }];