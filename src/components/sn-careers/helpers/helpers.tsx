import { SearchStatus, UpdateStatusCareer } from "store/career/action";

export const TEXT_PAY_STATUS_CAREER: { [key in UpdateStatusCareer]: string } = {
    [UpdateStatusCareer.REOPEN]: "ReOpen",
    [UpdateStatusCareer.CLOSED]: "Closed",
};