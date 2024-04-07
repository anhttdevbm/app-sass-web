import { Stack, TableRow } from "@mui/material";
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import StatusServer from "components/StatusServer";
import { useContentAboutUs } from "store/content/selectors"
import { NS_CONTENTS, NS_COMMON } from "constant/index";
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
import { StartMemberData } from "store/content/reducer";

const ItemList = () => {
    const { 
        isFetching,
        error, 
        members, 
        onGetAboutUsMembers,
        onCreateAboutUsMember,
        onUpdateAboutUsMember,
        onDeleteAboutUsMember
    } = useContentAboutUs()
    const contentT = useTranslations(NS_CONTENTS);
    const commonT = useTranslations(NS_COMMON);
    const [action, setAction] = useState<DataAction | undefined>();
    const [item, setItem] = useState<StartMemberData>();
    const [memberId, setMemberId] = useState<string | undefined>();

    const desktopHeaderList: CellProps[] = useMemo(
        () => [
          { value: contentT("aboutUs.startTeamMemberTable.name"), width: "25%", align: "left" },
          { value: contentT("aboutUs.startTeamMemberTable.work_experience"), width: "25%", align: "center" },
          { value: contentT("aboutUs.startTeamMemberTable.college"), width: "20%", align: "center" },
          { value: contentT("aboutUs.startTeamMemberTable.email"), width: "25%", align: "center" },
          { value: "", width: "5%", align: "left" },
        ],
        [contentT],
    );

    const memberLists = useMemo(() => {
        if (!members.length) return []
        return members.map((e, index) => {
            return {
                ...e,
                id: index
            }
        })
    }, [members])

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

    const onActionToItem = (action: DataAction, item?: StartMemberData) => {
        return () => {
          if (action === DataAction.DELETE) {
            // setMemberId(item?.slug);
          } else {
            item && setItem(item);
          }
          setAction(action);
        };
      };

    const onResetAction = () => {
        setAction(undefined);
    }

    const handleUpdateAboutUsMember = async(values: StartMemberData) => {
        const response = await onUpdateAboutUsMember(values.id, values)
        if (!response) return;
        await onGetAboutUsMembers()
        return response
    }

    useEffect(() => {
        onGetAboutUsMembers()
    }, [onGetAboutUsMembers])
    return (
        <>
            <StatusServer isFetching={isFetching} error={error}>
                <Stack
                    px={{ xs: 0, md: 3 }}
                    spacing={2}
                    py={2}
                >
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
                        { memberLists.map((item, index) => {
                            return (
                                <TableRow key={index}>
                                    <DesktopCells item={item} />
                                    <IconButton 
                                        size="small"
                                        onClick={onActionToItem(DataAction.UPDATE, item)}
                                        tooltip={commonT("update")}
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
                    initialValues={
                        {
                            id: item?.id,
                            name: item?.name,
                            work_experience: item?.work_experience,
                            college: item?.college,
                            description: item?.description,
                            avatar: item?.avatar,
                            email: item?.email,
                            position: item?.position,
                            social_link: item?.social_link,
                            detail: item?.detail,
                        } as StartMemberData
                    } 
                    //onSubmit={(values) => onUpdateCareer_submit(String(item?.id), values)}       
                    onSubmit={handleUpdateAboutUsMember}            
                />
            )}
        </>
    )
}

export default memo(ItemList)