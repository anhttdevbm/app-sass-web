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
import { UnlockValueData } from "store/content/reducer";

const UnlockValue = () => {
    const { isFetching, error, unlockValues, onGetPricingUnlockValues, onUpdatePricingUnlockValues } = useContentPricing()
    const contentT = useTranslations(NS_CONTENTS);
    const [action, setAction] = useState<DataAction | undefined>();

    const desktopHeaderList: CellProps[] = useMemo(
        () => [
          { value: contentT("tableList.name"), width: "20%", align: "left" },
          { value: contentT("tableList.description"), width: "30%", align: "left" },
          { value: contentT("tableList.monthly"), width: "10%", align: "left" },
          { value: contentT("tableList.yearly"), width: "10%", align: "left" },
          { value: contentT("tableList.tag"), width: "20%", align: "left" },
          { value: contentT("tableList.features"), width: "20%", align: "left" },
        ],
        [contentT],
    );

    const items = useMemo(() => {
        if (!unlockValues.length) return []
        const values = unlockValues.map(e => {
            const features = e.features.map((tag) => ({ tag }))
            return {
                name: e.name,
                tag: e.tag,
                description: e.description,
                monthly: e.monthly,
                yearly: e.yearly,
                features: e.features || [],
                tagFeatures: features
            }
        })
        return values
    }, [unlockValues])

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

    const onResetAction = () => {
        setAction(undefined);
    }

    const handleUpdatePricingUnlockValues = async(values: UnlockValueData[]) => {
        return  await onUpdatePricingUnlockValues(values)
        // if (!response) return
        // await onGetPricingUnlockValues()
        // return response
    }

    useEffect(() => {
        onGetPricingUnlockValues()
    }, [onGetPricingUnlockValues])

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
                            {contentT("pricing.unlock_unbeatable_value")}
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
                        { items.map((item, index) => {
                            return (
                                <TableRow key={index}>
                                    <DesktopCells item={item} />
                                </TableRow>
                            )
                        })}
                    </TableLayout>
                </Stack>
            </StatusServer>
            {action === DataAction.UPDATE && (
                <Form
                    open
                    onClose={onResetAction}
                    type={DataAction.UPDATE}
                    initialValues={items}
                    onSubmit={onUpdatePricingUnlockValues}
                    titleForm={contentT("pricing.update_unlock_unbeatable_value")}
                />
            )}
        </>
    )
}

export default memo(UnlockValue)