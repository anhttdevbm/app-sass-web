import { Stack, TableRow } from "@mui/material";
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import StatusServer from "components/StatusServer";
import { useContentAI } from "store/content/selectors"
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
import { PromoteData } from "store/content/reducer";

const PromoteOperation = () => {
    const { isFetching, error, promote, onGetAIPromote, onUpdateAIPromote } = useContentAI()
    const contentT = useTranslations(NS_CONTENTS);
    const [action, setAction] = useState<DataAction | undefined>();

    const desktopHeaderList: CellProps[] = useMemo(
        () => [
          { value: contentT("tableList.title"), width: "70%", align: "left" },
          { value: contentT("tableList.image"), width: "30%", align: "center" },
        ],
        [contentT],
    );

    const promotes = useMemo(() => {
        return promote
    }, [promote])

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

    const handleUpdateAIPromote = async(values: PromoteData) => {
        const response = await onUpdateAIPromote(values)
        if (!response) return
        await onGetAIPromote()
        return response
    }

    useEffect(() => {
        onGetAIPromote()
    }, [onGetAIPromote])
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
                            {contentT("ai.promote_your_operation")}
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
                        { promote &&
                            <TableRow>
                                <DesktopCells item={promote} />
                            </TableRow>
                        }
                    </TableLayout>
                </Stack>
            </StatusServer>
            {action === DataAction.UPDATE && promote && (
                <Form
                    open
                    onClose={onResetAction}
                    type={DataAction.UPDATE}
                    initialValues={promote}
                    onSubmit={handleUpdateAIPromote}
                    titleForm={contentT("ai.update_productivity")}
                />
            )}
        </>
    )
}

export default memo(PromoteOperation)