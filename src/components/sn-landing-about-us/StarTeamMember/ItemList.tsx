import { Stack, TableRow } from "@mui/material";
import { ChangeEvent, useMemo, useRef, useState, useEffect } from "react";
import StatusServer from "components/StatusServer";
import { useContentAboutUs } from "store/content/selectors"
import { NS_CONTENTS, NS_COMMON } from "constant/index";
import { Button, IconButton, Text } from "components/shared";
import { useTranslations } from "next-intl";
import PencilIcon from "icons/PencilIcon";
import TrashIcon from "icons/TrashIcon";
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
import DeleteCofirmDialog from "./components/DeleteCofirmDialog";
import { getMessageErrorByAPI } from "utils/index";
import MobileContentCell from　"./components/MobileContentCell";
import useBreakpoint from "hooks/useBreakpoint";

const ItemList = () => {
    const { 
        isFetching,
        error, 
        members, 
        onGetAboutUsMembers,
        onUpdateAboutUsMember,
        onDeleteAboutUsMember
    } = useContentAboutUs()
    const contentT = useTranslations(NS_CONTENTS);
    const commonT = useTranslations(NS_COMMON);
    const [action, setAction] = useState<DataAction | undefined>();
    const [item, setItem] = useState<StartMemberData>();
    const [memberId, setMemberId] = useState<string | undefined>();
    const { isMdSmaller } = useBreakpoint();

    const desktopHeaderList: CellProps[] = useMemo(
        () => [
          { value: contentT("aboutUs.startTeamMemberTable.name"), width: "25%", align: "left" },
          { value: contentT("aboutUs.startTeamMemberTable.work_experience"), width: "25%", align: "center" },
          { value: contentT("aboutUs.startTeamMemberTable.college"), width: "20%", align: "center" },
          { value: contentT("aboutUs.startTeamMemberTable.email"), width: "24%", align: "center" },
          { value: "", width: "3%", align: "center" },
          { value: "", width: "3%", align: "center" },
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
        const additionalHeaderList = isMdSmaller
            ? MOBILE_HEADER_LIST
            : desktopHeaderList;
    
        return [
          ...additionalHeaderList,
        ] as CellProps[];
      }, [desktopHeaderList]);

    const onActionToItem = (action: DataAction, item?: StartMemberData) => {
        return () => {
            if (action === DataAction.DELETE) {
                item && setItem(item)
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
        console.log(values);
        
        const response = await onUpdateAboutUsMember(values.id, values)
        if (!response) return;
        await onGetAboutUsMembers()
        return response
    }

    const onSubmitDelete = async () => {        
        try {
            if (typeof item?.id === 'undefined' ) return;        
            const response = await onDeleteAboutUsMember(item?.id as number);
            console.log(response);
            return response
        } catch (error) {
            onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
        }
    };

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
                                    {isMdSmaller ? (
                                        <>
                                            <MobileContentCell item={item} />
                                            <Stack spacing={4} py={1.5} direction="row" alignItems="center">
                                                <IconButton 
                                                    size="small"
                                                    onClick={onActionToItem(DataAction.UPDATE, item)}
                                                    tooltip={commonT("update")}
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
                                                    <PencilIcon sx={{ color: "grey.400" }} fontSize="medium" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    onClick={onActionToItem(DataAction.DELETE, item)}
                                                    tooltip={commonT("delete")}
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
                                                    <TrashIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </>
                                    ) : (
                                        <>
                                            <DesktopCells item={item} />
                                            <BodyCell>
                                                <IconButton 
                                                    size="small"
                                                    onClick={onActionToItem(DataAction.UPDATE, item)}
                                                    tooltip={commonT("update")}
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
                                                    <PencilIcon sx={{ color: "grey.400" }} fontSize="medium" />
                                                </IconButton>
                                            </BodyCell>
                                            <BodyCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={onActionToItem(DataAction.DELETE, item)}
                                                    tooltip={commonT("delete")}
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
                                                    <TrashIcon fontSize="small" />
                                                </IconButton>
                                            </BodyCell>
                                        </>
                                    )}
                                    
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
                    onSubmit={handleUpdateAboutUsMember}            
                />
            )}
            <DeleteCofirmDialog
                open={action === DataAction.DELETE}
                onClose={onResetAction}
                title={contentT("action.delete.title")}
                content={contentT("action.delete.confirm")}
                onSubmit={onSubmitDelete}
                action={commonT("delete")}
            />
        </>
    )
}

export default memo(ItemList)

function onAddSnackbar(arg0: any, arg1: string) {
    throw new Error("Function not implemented.");
}

const MOBILE_HEADER_LIST = [{ value: "", width: "75%", align: "left" }];