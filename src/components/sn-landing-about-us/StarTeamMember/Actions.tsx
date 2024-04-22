"use client";

import { memo, useMemo, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { Button, Text } from "components/shared";
import PlusIcon from "icons/PlusIcon";
import { getPath } from "utils/index";
import { usePathname, useRouter } from "next-intl/client";
import { DataAction } from "constant/enums";
import { NS_COMMON, NS_CONTENTS } from "constant/index";
import { useTranslations } from "next-intl";
import Form from "./components/Form";
import { StartMemberData } from "store/content/reducer";
import useToggle from "hooks/useToggle";
import { useContentAboutUs } from "store/content/selectors"

const Actions = () => {
    const commonT = useTranslations(NS_COMMON);
    const contentT = useTranslations(NS_CONTENTS);
    const [item, setItem] = useState<StartMemberData>();
    const [isShow, onShow, onHide] = useToggle();
    const { 
        isFetching,
        error, 
        members, 
        onGetAboutUsMembers,
        onCreateAboutUsMember,
    } = useContentAboutUs()

    const onResponsedContent = async(values: StartMemberData) => {
        const response = await onCreateAboutUsMember(values)
        if (!response) return;
        await onGetAboutUsMembers()
        return response
    }
    return (
    <>
        <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ md: "center" }}
            justifyContent="space-between"
            spacing={{ xs: 1, md: 2 }}
            px={{ xs: 0, md: 3 }}
        >
            <Stack
                direction="row"
                alignItems="center"
                width="100%"
                spacing={{ xs: 2, md: 1 }}
                sx={{
                    display: {md: "flex" },
                    height: 32,
                }}
            >
                <Text variant="h4">
                    {contentT("aboutUs.allStarTeam")}
                </Text>

                <Button
                    onClick={onShow}
                    startIcon={<PlusIcon />}
                    size="extraSmall"
                    variant="primary"
                    sx={{ height: 32, px: ({ spacing }) => `${spacing(2)}!important` }}
                >
                    {commonT("createNew")}
                </Button>
            </Stack>
        </Stack>
        {isShow && (
            <Form
                open={isShow}
                onClose={onHide}
                type={DataAction.CREATE}
                initialValues={INITIAL_VALUES as unknown as StartMemberData}
                onSubmit={onResponsedContent}
            />
        )}
    </>
    );
};

export default memo(Actions);

const INITIAL_VALUES = {
    name: "",
    work_experience: "",
    college: "",
    description: "",
    email: "",
    position: "",
    social_link: "",
    detail: "",
};
