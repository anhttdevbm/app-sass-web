import { SearchStatus } from "store/career/action";

export const TEXT_PAY_STATUS_CAREER: { [key in SearchStatus]: string } = {
    [SearchStatus.IS_OPENING]: "is_opening",
    [SearchStatus.IS_CLOSED]: "is_closed",
};