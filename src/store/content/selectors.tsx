import { useAppDispatch, useAppSelector } from "store/hooks";
import { useMemo, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { 
    getHomeBanner,
    updateHomeBanner, 
    getHomeExplore, 
    updateHomeExplore, 
    getHomePower,
    updateHomePower,
    getAboutUsQuestion,
    updateAboutUsQuestion,
    getAboutUsMission,
    updateAboutUsMission,
    getAboutUsMostViewArticles,
    updateAboutUsMostViewArticles,
    getAboutUsMembers,
    createAboutUsMember,
    updateAboutUsMember,
    deleteAboutUsMember,
    getAboutUsBanners,
    updateAboutUsBanners,
    getHelpCenterBanner,
    updateHelpCenterBanner,
    getHelpCenterUsageTips,
    updateHelpCenterUsageTips,
    getTrustCenterBanner,
    updateTrustCenterBanner,
    getTrustCenterBuildingTrust,
    updateTrustCenterBuildingTrust, } from "./actions";
import { DataStatus } from "constant/enums";
import { ExploreData, ContentData, StartMemberData, StartMemberFormData } from "./reducer";
import { uploadFile } from "store/blog/actions";
import { ArticleData } from "./reducer";
import { Attachment } from "constant/types";
import { BannerCenterData } from "./reducer";

export type BannerData = {
    data: string;
};

export type ExploreFormData = {
    title: string;
    tab_name: string;
    description: string;
    image: string;
    linkCTA: string;
};

export type ContentCommonFormData = {
    title?: string;
    description?: string;
    image?: string;
};

export interface BannerFormAboutUs extends Attachment {
    bannerUpload?: File | undefined
}

export const useContentHome = () => {
    const dispatch = useAppDispatch();
    const {
        banner: item,
        contentStatus: status,
        contentError: error,
        explores,
        powers,
    } = useAppSelector((state) => state.content, shallowEqual);

    const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
    const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

    const onGetHomeBanner = useCallback(
        async () => {
            await dispatch(getHomeBanner());
        },
        [dispatch],
    );

    const onUpdateHomeBanner = useCallback(
        async (data: BannerData) => {
            await dispatch(updateHomeBanner(data));
        },
        [dispatch],
    );

    const onGetHomeExplore = useCallback(
        async () => {
            await dispatch(getHomeExplore());
        },
        [dispatch],
    );

    const onUpdateHomeExplore = useCallback(
        async (data: ExploreData[]) => {
            try {
                const promises = data.map(async(item, index) => {
                    if (item.imageUpload) {
                        const imageUploadResponse = await dispatch(
                            uploadFile({
                                file: item.imageUpload,
                            }),
                        );
                        item.image = imageUploadResponse.payload.object;
                    }
                    return {
                        title: item.title,
                        tab_name: item.tab_name,
                        description: item.description,
                        image: item.imageUpload ? item.image : item.image?.object,
                        linkCTA: item.linkCTA
                    }
                })

                const params = await Promise.all(promises);                

                return await dispatch(updateHomeExplore(params as ExploreFormData[])).unwrap();
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],

        
    );

    const onGetHomePower = useCallback(
        async () => {
            await dispatch(getHomePower());
        },
        [dispatch],
    );

    const onUpdateHomePower = useCallback(
        async (data: ExploreData[]) => {
            try {
                const promises = data.map(async(item, index) => {
                    if (item.imageUpload) {
                        const imageUploadResponse = await dispatch(
                            uploadFile({
                                file: item.imageUpload,
                            }),
                        );
                        item.image = imageUploadResponse.payload.object;
                    }
                    return {
                        title: item.title,
                        tab_name: item.tab_name,
                        description: item.description,
                        image: item.imageUpload ? item.image : item.image?.object,
                        linkCTA: item.linkCTA
                    }
                })

                const params  = await Promise.all(promises);
                

                return await dispatch(updateHomePower(params as ExploreFormData[])).unwrap();
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],
    );

    return {
        item,
        status,
        error,
        isIdle,
        isFetching,
        explores,
        powers,
        onGetHomeBanner,
        onUpdateHomeBanner,
        onGetHomeExplore,
        onUpdateHomeExplore,
        onGetHomePower,
        onUpdateHomePower
    }
}

export const useContentAboutUs = () => {
    const dispatch = useAppDispatch();
    const {
        banner: item,
        contentStatus: status,
        contentError: error,
        questions,
        missions,
        articles,
        members,
        aboutBanners
    } = useAppSelector((state) => state.content, shallowEqual);

    const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
    const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

    const onGetAboutUsQuestion = useCallback(
        async () => {
            await dispatch(getAboutUsQuestion());
        },
        [dispatch],
    );

    const onUpdateAboutUsQuestion = useCallback(
        async (questions: ContentData[]) => {
            return await dispatch(updateAboutUsQuestion(questions)).unwrap();
        },
        [dispatch],
    );

    const onGetAboutUsMission = useCallback(
        async () => {
            await dispatch(getAboutUsMission());
        },
        [dispatch],
    );

    const onUpdateAboutUsMission = useCallback(
        async (missions: ContentData[]) => {
            return await dispatch(updateAboutUsMission(missions)).unwrap();
        },
        [dispatch],
    );

    const onGetAboutUsMostViewArticles = useCallback(
        async () => {
            await dispatch(getAboutUsMostViewArticles());
        },
        [dispatch],
    );

    const onUpdateAboutUsMostViewArticles = useCallback(
        async (articles: ArticleData[]) => {
            try {
                const promises = articles.map(async(item, index) => {
                    if (item.logoUpload) {
                        const logoUploadResponse = await dispatch(
                            uploadFile({
                                file: item.logoUpload,
                            }),
                        );
                        item.logo = logoUploadResponse.payload.object;
                    }
                    return {
                        name: item.name,
                        logo: item.logoUpload ? item.logo : item.logo?.object,
                    }
                })

                const params = await Promise.all(promises);                

                return await dispatch(updateAboutUsMostViewArticles(params as ArticleData[])).unwrap();
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],
    )

    const onGetAboutUsMembers = useCallback(
        async () => {
            await dispatch(getAboutUsMembers());
        },
        [dispatch],
    );

    const onCreateAboutUsMember = useCallback(
        async (member: StartMemberData) => {
            
            try {
                let avatarUrl: string =  ""
                if (member.avatarUpload) {
                    const avatarUploadResponse = await dispatch(
                        uploadFile({
                            file: member.avatarUpload,
                        }),
                    );
                    avatarUrl = avatarUploadResponse.payload.object
                } else {
                    avatarUrl = member.avatar.object;
                }
                const params = {
                    name: member.name,
                    work_experience: member.work_experience,
                    college: member.college,
                    description: member.description,
                    avatar: avatarUrl,
                    email: member.email,
                    position: member.position,
                    social_link: member.social_link,
                    detail: member.detail,
                }  as StartMemberFormData
                return await dispatch(createAboutUsMember(params)).unwrap;
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],
    );

    const onUpdateAboutUsMember = useCallback(
        async (id: number | undefined, member: StartMemberData) => {
            try {
                let avatarUrl: string =  ""
                if (member.avatarUpload) {
                    const avatarUploadResponse = await dispatch(
                        uploadFile({
                            file: member.avatarUpload,
                        }),
                    );
                    avatarUrl = avatarUploadResponse.payload.object
                } else {
                    avatarUrl = member.avatar.object;
                }
                const params = {
                    name: member.name,
                    work_experience: member.work_experience,
                    college: member.college,
                    description: member.description,
                    avatar: avatarUrl,
                    email: member.email,
                    position: member.position,
                    social_link: member.social_link,
                    detail: member.detail,
                }  as StartMemberFormData
                return await dispatch(updateAboutUsMember({ id, params })).unwrap();
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],
    );

    const onDeleteAboutUsMember = useCallback(
        async () => {
            await dispatch(deleteAboutUsMember());
        },
        [dispatch],
    );

    const onGetAboutUsBanners = useCallback(
        async () => {
            await dispatch(getAboutUsBanners());
        },
        [dispatch],
    );

    const onUpdateAboutUsBanners = useCallback(
        async (data: BannerFormAboutUs[]) => {
            try {
                const promises = data.map(async(item, index) => {
                    if (item.bannerUpload) {
                        const bannerUploadResponse = await dispatch(
                            uploadFile({
                                file: item.bannerUpload,
                            }),
                        );
                        item.object = bannerUploadResponse.payload.object;
                    }
                    return item.object
                })

                const params  = await Promise.all(promises);
                

                return await dispatch(updateAboutUsBanners(params as string[])).unwrap();
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],
    );

    return {
        error,
        isIdle,
        isFetching,
        questions,
        missions,
        articles,
        members,
        aboutBanners,
        onGetAboutUsQuestion,
        onUpdateAboutUsQuestion,
        onGetAboutUsMission,
        onUpdateAboutUsMission,
        onGetAboutUsMostViewArticles,
        onUpdateAboutUsMostViewArticles,
        onGetAboutUsMembers,
        onCreateAboutUsMember,
        onUpdateAboutUsMember,
        onDeleteAboutUsMember,
        onGetAboutUsBanners,
        onUpdateAboutUsBanners
    }
}

export const useContentCenter = () => {
    const dispatch = useAppDispatch();
    const {
        contentStatus: status,
        contentError: error,
        centerBanner,
        usageTips,
        buildingTrust,
    } = useAppSelector((state) => state.content, shallowEqual);

    const isIdle = useMemo(() => status === DataStatus.IDLE, [status]);
    const isFetching = useMemo(() => status === DataStatus.LOADING, [status]);

    const onGetHelpCenterBanner = useCallback(
        async () => {
            await dispatch(getHelpCenterBanner());
        },
        [dispatch],
    );

    const onUpdateHelpCenterBanner = useCallback(
        async (data: BannerCenterData) => {
            let bannerUpload: string = ""
            if (data?.bannerUpload) {
                const bannerUploadResponse = await dispatch(
                    uploadFile({
                        file: data.bannerUpload,
                    }),
                );
                bannerUpload = bannerUploadResponse.payload.object
            } else {
                bannerUpload = data.banner_image.object;
            }
            const params = {
                description: data.description,
                banner_image: bannerUpload
            } as BannerCenterData
            return await dispatch(updateHelpCenterBanner(params)).unwrap();
        },
        [dispatch],
    );

    const onGetHelpCenterUsageTips = useCallback(
        async () => {
            await dispatch(getHelpCenterUsageTips());
        },
        [dispatch],
    );

    const onUpdateHelpCenterUsageTips = useCallback(
        async (items: ContentData[]) => {
            try {
                const promises = items.map(async(item, index) => {
                    if (item.imageUpload) {
                        const imageUploadesponse = await dispatch(
                            uploadFile({
                                file: item.imageUpload,
                            }),
                        );
                        item.image = imageUploadesponse.payload.object;
                    }
                    return {
                        title: item.title,
                        image: item.imageUpload ? item.image : item.image?.object,
                        linkCTA: item.linkCTA,
                    }
                })

                const params = await Promise.all(promises);                

                return await dispatch(updateHelpCenterUsageTips(params as ContentData[])).unwrap();
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],
    )

    const onGetTrustCenterBanner = useCallback(
        async () => {
            await dispatch(getTrustCenterBanner());
        },
        [dispatch],
    );

    const onUpdateTrustCenterBanner = useCallback(
        async (data: BannerCenterData) => {
            let bannerUpload: string = ""
            if (data?.bannerUpload) {
                const bannerUploadResponse = await dispatch(
                    uploadFile({
                        file: data.bannerUpload,
                    }),
                );
                bannerUpload = bannerUploadResponse.payload.object
            } else {
                bannerUpload = data?.banner_image?.object;
            }
            const params = {
                banner_title: data.banner_title,
                banner_description: data.banner_description,
                banner_image: bannerUpload
            } as BannerCenterData
            return await dispatch(updateTrustCenterBanner(params)).unwrap();
        },
        [dispatch],
    );

    const onGetTrustCenterBuildingTrust = useCallback(
        async () => {
            await dispatch(getTrustCenterBuildingTrust());
        },
        [dispatch],
    );

    const onUpdateTrustCenterBuildingTrust = useCallback(
        async (items: ContentData[]) => {
            try {
                const promises = items.map(async(item, index) => {
                    if (item.imageUpload) {
                        const imageUploadesponse = await dispatch(
                            uploadFile({
                                file: item.imageUpload,
                            }),
                        );
                        item.image = imageUploadesponse.payload.object;
                    }
                    return {
                        title: item.title,
                        image: item.imageUpload ? item.image : item.image?.object,
                        description: item.description,
                    }
                })

                const params = await Promise.all(promises);                

                return await dispatch(updateTrustCenterBuildingTrust(params as ContentData[])).unwrap();
            } catch (error) {
                console.error("Error:", error);
            }
        },
        [dispatch],
    )

    return {
        isIdle,
        isFetching,
        error,
        centerBanner,
        usageTips,
        buildingTrust,
        onGetHelpCenterBanner,
        onUpdateHelpCenterBanner,
        onGetHelpCenterUsageTips,
        onUpdateHelpCenterUsageTips,
        onGetTrustCenterBanner,
        onUpdateTrustCenterBanner,
        onGetTrustCenterBuildingTrust,
        onUpdateTrustCenterBuildingTrust
    }
}