"use client";

import { Stack } from "@mui/material";
import { client, Endpoint } from "api";
import { formErrorCode } from "api/formErrorCode";
import Link from "components/Link";
import { Text } from "components/shared";
import { ButtonOutlineGradient } from "components/sn-ai-agent-detail/Knowledge/components/ButtonOutlineGradient";
import { HttpStatusCode } from "constant/enums";
import {
    AN_ERROR_TRY_AGAIN,
    AUTH_API_URL,
    NS_AUTH,
    NS_COMMON
} from "constant/index";
import { JOIN_WORKSPACE_PATH } from "constant/paths";
import { ErrorResponse } from "constant/types";
import useWindowSize from "hooks/useWindowSize";
import { useTranslations } from "next-intl";
import { useRouter } from "next-intl/client";
import Image from "next/image";
import TemplateTwoPng from "public/images/img-taskcover-working.png";
import { memo, useMemo, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { getMessageErrorByAPI } from "utils/index";


const WaitingApprove = () => {
    const { onAddSnackbar } = useSnackbar();
    const authT = useTranslations(NS_AUTH);
    const commonT = useTranslations(NS_COMMON);
    const { isLoggedIn, user, onGetProfile } = useAuth();
    // const { appReady } = useAppReady();
    const { replace, push } = useRouter();

    const { height } = useWindowSize();

    const isSmallHeight = useMemo(() => height && height < 768, [height]);

    const [error, setError] = useState<string | undefined>();


    const onSubmit = async () => {
        
        try {
            const response = await client.get(Endpoint.CANCEL_REQUEST, {},{ baseURL: AUTH_API_URL });
            
            if (response?.status === HttpStatusCode.OK) {
                onAddSnackbar(authT("waitingApprove.notification.success"), "success");
                push(JOIN_WORKSPACE_PATH);
                onGetProfile();
            } else {
                throw AN_ERROR_TRY_AGAIN;
            }
        } catch (error) {
            if ((error as ErrorResponse)["code"] === formErrorCode.NOT_FOUND) {
                setError(authT("waitingApprove.notification.notFound"));
            } else {
                onAddSnackbar(getMessageErrorByAPI(error, commonT), "error");
            }
        } 
    };
    return (
        <>
            <Stack
                // flex={1}
                // height="calc(var(--vh, 1vh) * 100)"
                // width="100vw"
                // justifyContent="center"
                alignItems="center"
            >
                <Stack
                    // mx={{ xs: 2, sm: 8 }}
                    // my={{ sm: isSmallHeight ? 3 : 6, lg: isSmallHeight ? 3 : 8 }}
                    justifyContent="center"
                    alignItems="center"
                    bgcolor="background.paper"
                    p={3}
                    flex={{ sm: 1 }}
                    width={({ spacing }) => ({
                        xs: `calc(100vw - ${spacing(2 * 2)})`,
                        sm: `calc(100vw - ${spacing(8 * 2)})`,
                    })}
                    height={({ spacing }) => ({
                        xs: "fit-content",
                        sm: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(
                            (isSmallHeight ? 3 : 6) * 2,
                        )})`,
                        lg: `calc(calc(var(--vh, 1vh) * 100) - ${spacing(
                            (isSmallHeight ? 3 : 8) * 2,
                        )})`,
                    })}
                    sx={{
                        overflowX: "hidden",
                    }}
                    maxHeight={{ xs: "fit-content", sm: "100%" }}
                    borderRadius={2}
                    overflow="auto"
                    position="relative"
                >
                    <Stack
                        // minWidth={340}
                        // maxWidth={340}
                        justifyContent="center"
                        alignItems="center"
                    >
                        <Text variant="h3" textAlign="center" mt={3} mb={2}>
                            Waiting for <span style={{ color: "#045EB8" }}>@Taskcover.com</span> to approve your request...
                        </Text>
                        
                        <Image
                            src={TemplateTwoPng}
                            alt="Task cover working"
                            width={400} // specify the width of the image
                            height={400} // specify the height of the image
                        />

                        <Text
                            variant="body2"
                            textAlign="center"
                            mt={{ xs: 3, sm: 10 }}
                            mb={2}
                            color="text.primary"
                            maxWidth={280}
                        >
                            {authT("waitingApprove.description")}
                        </Text>

                        <ButtonOutlineGradient
                            name={authT("waitingApprove.cancelRequest")}
                            onClick={onSubmit} 
                            icon={undefined}                        
                        />

                        {/* Add link text forward new page */}
                        <Link
                            href="https://taskcover.com/help-center"
                            // underline="none"
                            target="_blank"
                            sx={{
                                color: "inherit",
                                "&:hover": {
                                color: "primary.main",
                                },
                                fontSize: 10,
                            }}
                            >
                            <Text
                                sx={{
                                    fontFamily: "Inter",
                                    fontSize: "12px",
                                    fontWeight: 400,
                                    lineHeight: "28.29px",
                                    textAlign: "center",
                                    textDecorationLine: "underline",
                                    textDecorationStyle: "solid",
                                    textUnderlinePosition: "from-font",
                                    textDecorationSkipInk: "none",
                                    color: "#0575E6",
                                }}
                            >
                                {authT("waitingApprove.helpCenter")}
                            </Text>
                        </Link>

                        
                    </Stack>
                </Stack>
            </Stack>

        </>
    );
};

export default memo(WaitingApprove);
