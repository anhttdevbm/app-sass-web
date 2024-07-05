import { FeedbackStatus } from "store/feedback/actions";


export const TEXT_PAY_STATUS_FEEDBACK: { [key in FeedbackStatus]: string } = {
    [FeedbackStatus.RESPONDED]: "responded",
    [FeedbackStatus.WATTING_RESPONDE]: "watting_responde",
};