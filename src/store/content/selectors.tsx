import { useAppDispatch, useAppSelector } from "store/hooks";
import { useMemo, useCallback } from "react";
import { shallowEqual } from "react-redux";
import { getHomeBanner, updateHomeBanner, getHomeExplore, updateHomeExplore, getHomePower, updateHomePower } from "./actions";
import { DataStatus } from "constant/enums";
import { ExploreData } from "./reducer";
import { uploadFile } from "store/blog/actions";

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

export const useContent = () => {
    const dispatch = useAppDispatch();
    const {
        banner: item,
        contentStatus: status,
        contentError: error,
        explores,
        powers
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