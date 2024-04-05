import { Stack, TableRow } from "@mui/material";
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import StatusServer from "components/StatusServer";
import { useContent } from "store/content/selectors"
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
import { ExploreData } from "store/content/reducer";
import React, { memo } from "react";

const ExploreHowWe = () => {
    const { isFetching, error, explores, onGetHomeExplore, onUpdateHomeExplore } = useContent()
    const contentT = useTranslations(NS_CONTENTS);
    const [action, setAction] = useState<DataAction | undefined>();
    const [isEdit, setIsEdit] = useState<undefined>();

    const desktopHeaderList: CellProps[] = useMemo(
        () => [
          { value: contentT("home.exploreTable.title"), width: "30%", align: "left" },
          { value: contentT("home.exploreTable.tab_name"), width: "20%", align: "left" },
          { value: contentT("home.exploreTable.description"), width: "35%", align: "left" },
          { value: contentT("home.exploreTable.image"), width: "15%", align: "left" },
        ],
        [contentT],
    );

    const exploreForm = useMemo(() => {
        if (!explores.length) return []
        
        return explores.map(e => {
            return {
              ...e,
            }
          })
      }, [explores]);

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
        onGetHomeExplore()
    }, [onGetHomeExplore])
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
                            {contentT("home.explore_how_we")}
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
                        { explores.map((item, index) => {
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
                    initialValues={exploreForm}
                    onSubmit={(values) => onUpdateHomeExplore(values)}
                    titleForm={contentT("home.update_explore_how_we")}
                />
            )}
        </>
    )
}

export default memo(ExploreHowWe)