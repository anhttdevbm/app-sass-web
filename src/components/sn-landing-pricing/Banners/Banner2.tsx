"use client"
import { Stack, TableRow } from "@mui/material";
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import StatusServer from "components/StatusServer";
import { useContentPricing } from "store/content/selectors"
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
import { ContentData } from "store/content/reducer";

const Banner2 = () => {
    const { isFetching, error, pricingBanner2 : banner, onGetPricingBannerTwo, onUpdatePricingBannerTwo } = useContentPricing()
    const contentT = useTranslations(NS_CONTENTS);
    const [action, setAction] = useState<DataAction | undefined>();

    const desktopHeaderList: CellProps[] = useMemo(
        () => [
            { value: contentT("tableList.title"), width: "25%", align: "left" },
            { value: contentT("tableList.description"), width: "35%", align: "left" },
            { value: contentT("tableList.link"), width: "20%", align: "center" },
            { value: contentT("tableList.image"), width: "20%", align: "center" },
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

    const handleUpdatePricingBanner = async(values: ContentData) => {
        const response = await onUpdatePricingBannerTwo(values)
        if (!response) return
        await onGetPricingBannerTwo()
        return response
    }

    const onResetAction = () => {
        setAction(undefined);
    }

    useEffect(() => {
        onGetPricingBannerTwo()
    }, [onGetPricingBannerTwo])
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
                            {contentT("aboutUs.banner")} 2
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
                    onSubmit={handleUpdatePricingBanner}
                    titleForm={contentT("update_banner")}
                />
            )}
        </>
    )
}

export default memo(Banner2)