import { Stack, TableRow } from "@mui/material";
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import StatusServer from "components/StatusServer";
import { useContentAboutUs, ContentCommonFormData } from "store/content/selectors"
import {NS_CONTENTS } from "constant/index";
import { Button, IconButton, Text } from "components/shared";
import { useTranslations } from "next-intl";
import PencilIcon from "icons/PencilIcon";
import {
    CellProps,
    TableLayout,
  } from "components/Table";
import DesktopCells from "./components/DesktopCells";
import { DataAction } from "constant/enums";
import Form from "./components/Form";
import { ExploreData } from "store/content/reducer";
import React, { memo } from "react";

const Mission = () => {
    const { isFetching, error, missions, onGetAboutUsMission, onUpdateAboutUsMission } = useContentAboutUs()
    const contentT = useTranslations(NS_CONTENTS);
    const [action, setAction] = useState<DataAction | undefined>();

    const desktopHeaderList: CellProps[] = useMemo(
        () => [
          { value: contentT("tableList.title"), width: "40%", align: "left" },
          { value: contentT("tableList.description"), width: "60%", align: "left" },
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

    const onResetAction = () => {
        setAction(undefined);
    }

    useEffect(() => {
        onGetAboutUsMission()
    }, [onGetAboutUsMission])

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
                            {contentT("aboutUs.mission")}
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
                        { missions.map((item, index) => {
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
                    initialValues={missions}
                    onSubmit={(values) => onUpdateAboutUsMission(values)}
                    titleForm={contentT("aboutUs.updatemission")}
                    name={contentT("aboutUs.mission")}
                />
            )}
        </>
    )
}

export default memo(Mission)