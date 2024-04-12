"use client"
import { Stack, TableRow } from "@mui/material";
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import StatusServer from "components/StatusServer";
import { useContentCenter } from "store/content/selectors"
import {NS_CONTENTS } from "constant/index";
import { Button, IconButton, Text } from "components/shared";
import { useTranslations } from "next-intl";
import PencilIcon from "icons/PencilIcon";
import {
    ActionsCell,
    BodyCell,
    CellProps,
    TableLayout,
  } from "components/Table";
import DesktopCells from "./components/DesktopCells";
import { DataAction } from "constant/enums";
import Form from "./components/Form";
import React, { memo } from "react";
import { BannerCenterData } from "store/content/reducer";

const Banners = () => {
    const { isFetching, error, centerBanner : banner, onGetTrustCenterBanner, onUpdateTrustCenterBanner } = useContentCenter()
    const contentT = useTranslations(NS_CONTENTS);
    const [action, setAction] = useState<DataAction | undefined>();

    const desktopHeaderList: CellProps[] = useMemo(
        () => [
            { value: contentT("tableList.description"), width: "30%", align: "left" },
            { value: contentT("tableList.description"), width: "40%", align: "left" },
            { value: contentT("tableList.banner"), width: "30%", align: "center" },
        ],
        [contentT],
    );

    const headerList = useMemo(() => {
        const additionalHeaderList = desktopHeaderList;
    
        return [
          ...additionalHeaderList,
        ] as CellProps[];
      }, [desktopHeaderList]);

    const onAction = (action: DataAction) => {
        return () => {
            if (action === DataAction.UPDATE) {
                setAction(action);
            }
        };
    }

    const handleUpdateTrustCenterBanner = async(values: BannerCenterData) => {
        const response = await onUpdateTrustCenterBanner(values)
        if (!response) return
        await onGetTrustCenterBanner()
        return response
    }

    const onResetAction = () => {
        setAction(undefined);
    }

    useEffect(() => {
        onGetTrustCenterBanner()
    }, [onGetTrustCenterBanner])
    return (
        <>
            <StatusServer isFetching={isFetching} error={error}>
                <Stack
                    px={{ xs: 0, md: 3 }}
                    spacing={2}
                    py={2}
                >
                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems={"center"}
                    >
                        <Text variant="h4">
                            {contentT("aboutUs.banner")}
                        </Text>
                        <IconButton
                            onClick={onAction(DataAction.UPDATE)} 
                            size="small"
                            tooltip={contentT("action.edit")}
                            sx={{
                            backgroundColor: "primary.light",
                            color: "text.primary",
                            p: { xs: "4px!important", md: 1 },
                            marginTop:1,
                            "&:hover svg": {
                                color: "common.white",
                            },
                            }}
                            variant="contained"
                        >
                            <PencilIcon sx={{ color: "grey.400" }} fontSize="medium" />
                        </IconButton>
                    </Stack>
                        
                    <TableLayout
                        headerList={headerList}
                        px={{ xs: 0 }}
                        // containerHeaderProps={{
                        //     sx: {
                        //     maxHeight: { xs: 0, md: undefined },
                        //     minHeight: { xs: 0, md: HEADER_HEIGHT },
                        //     },
                        // }}
                        sx={{ bgcolor: { xs: "grey.50", md: "transparent" } }}
                    >
                        { banner && 
                            (
                                <TableRow>
                                    <DesktopCells item={banner} />
                                </TableRow>
                            )
                        }
                    </TableLayout>
                </Stack>
            </StatusServer>
            {(action === DataAction.UPDATE && banner) && (
                <Form
                    open
                    onClose={onResetAction}
                    type={DataAction.UPDATE}
                    initialValues={banner}
                    onSubmit={handleUpdateTrustCenterBanner}
                    titleForm={contentT("update_banner")}
                />
            )}
        </>
    )
}

export default memo(Banners)