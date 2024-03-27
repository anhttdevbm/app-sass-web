import Wrapper from "components/Wrapper";
import { CAREER_DETAIL_PATH, CAREER_PATH, COMPANIES_PATH } from "constant/paths";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useCareer } from "store/career/selectors";
import { getPath } from "utils/index";
import { TabList } from "components/sn-career-detail/components";

type CareerDetaiLayoutProps = {
    children: React.ReactNode;
    id: string;
};

const CareerDetaiLayout = ({ children, id }: CareerDetaiLayoutProps) => {
    const { onGetCareerBySlug, items, filters, page, size, item} = useCareer();
    const { onUpdateHeaderConfig } = useHeaderConfig();

    const pathname = usePathname();

    const isCareerDetailPath = useMemo(
        () => pathname.replace(id, "{id}") === CAREER_DETAIL_PATH,
        [id, pathname],
    );

    const dataStringifyRef = useRef<string | undefined>();

    useEffect(() => {
        if (!id) return;
        onGetCareerBySlug(id)
    }, [id, onGetCareerBySlug]);

    useEffect(() => {
        dataStringifyRef.current = JSON.stringify({
            ...filters,
            page,
            size,
        });
    }, [filters, page, size]);

    useEffect(() => {
        const parsedQueries = dataStringifyRef.current
            ? JSON.parse(dataStringifyRef.current)
            : {};

        const prevPath = getPath(CAREER_PATH, parsedQueries);

        onUpdateHeaderConfig({
            title: item?.slug,
            searchPlaceholder: undefined,
            prevPath,
        });

        return () => {
            onUpdateHeaderConfig({
                title: undefined,
                searchPlaceholder: undefined,
                prevPath: undefined,
            });
        };
    }, [item?.slug, onUpdateHeaderConfig]);

    return (
        <Wrapper overflow="auto" inFrame={isCareerDetailPath}>
            <TabList />
            {children}
        </Wrapper>
    );
};

export default CareerDetaiLayout;