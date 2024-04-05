import Wrapper from "components/Wrapper";
import { CAREER_DETAIL_PATH, CAREER_PATH, COMPANIES_PATH } from "constant/paths";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useHeaderConfig } from "store/app/selectors";
import { useCareer } from "store/career/selectors";
import { getPath } from "utils/index";
import { TabList } from "components/sn-career-detail/components";

type LandingPageLayoutProps = {
    children: React.ReactNode;
};

const LandingPageLayout = ({ children }: LandingPageLayoutProps) => {
    return (
        <Wrapper overflow="auto">
            {children}
        </Wrapper>
    );
};

export default LandingPageLayout;