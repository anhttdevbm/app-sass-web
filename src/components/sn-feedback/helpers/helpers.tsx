import { FeedbackStatus } from "store/feedback/actions";


export const TEXT_PAY_STATUS_FEEDBACK: { [key in FeedbackStatus]: string } = {
    [FeedbackStatus.RESPONSED]: "responsed",
    [FeedbackStatus.WATTING_RESPONSE]: "watting_responsed",
};