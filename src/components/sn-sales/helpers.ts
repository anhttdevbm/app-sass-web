import { CURRENCY_CODE, SALE_STAGE } from "constant/enums";
import { Option } from "constant/types";

export const TEXT_STAGE_STATUS: { [key in SALE_STAGE]: string } = {
  [SALE_STAGE.LEAD]: "list.stage.lead",
  [SALE_STAGE.PROPOSAL_SENT]: "list.stage.proposalSent",
  [SALE_STAGE.PROSPECT]: "list.stage.prospect",
  [SALE_STAGE.WAITING_APPROVE]: "list.stage.waitingApprove",
  [SALE_STAGE.NEGOTIATION]: "list.stage.negotiation",
  [SALE_STAGE.OPEN]: "list.stage.open",
  [SALE_STAGE.WON_DEAL]: "list.stage.wonDeal",
  [SALE_STAGE.LOST_DEAL]: "list.stage.lostDeal",
};

export const COLOR_STAGE_STATUS: { [key in SALE_STAGE]: string } = {
  [SALE_STAGE.LEAD]: "warning",
  [SALE_STAGE.PROPOSAL_SENT]: "positive",
  [SALE_STAGE.PROSPECT]: "error",
  [SALE_STAGE.WAITING_APPROVE]: "success",
  [SALE_STAGE.NEGOTIATION]: "purple",
  [SALE_STAGE.OPEN]: "info",
  [SALE_STAGE.WON_DEAL]: "success",
  [SALE_STAGE.LOST_DEAL]: "error",
};

export const mappingStageStatusOptions: Option[] = [
  {
    label: TEXT_STAGE_STATUS[SALE_STAGE.LEAD],
    value: SALE_STAGE.LEAD,
  },
  {
    label: TEXT_STAGE_STATUS[SALE_STAGE.PROPOSAL_SENT],
    value: SALE_STAGE.PROPOSAL_SENT,
  },
  {
    label: TEXT_STAGE_STATUS[SALE_STAGE.PROSPECT],
    value: SALE_STAGE.PROSPECT,
  },
  {
    label: TEXT_STAGE_STATUS[SALE_STAGE.WAITING_APPROVE],
    value: SALE_STAGE.WAITING_APPROVE,
  },
  {
    label: TEXT_STAGE_STATUS[SALE_STAGE.NEGOTIATION],
    value: SALE_STAGE.NEGOTIATION,
  },
];

export const mappingStatusOptions: Option[] = [
  {
    label: TEXT_STAGE_STATUS[SALE_STAGE.OPEN],
    value: SALE_STAGE.OPEN,
  },
  {
    label: TEXT_STAGE_STATUS[SALE_STAGE.WON_DEAL],
    value: SALE_STAGE.WON_DEAL,
  },
  {
    label: TEXT_STAGE_STATUS[SALE_STAGE.LOST_DEAL],
    value: SALE_STAGE.LOST_DEAL,
  },
];

export enum TIME_OFF_TYPE {
  VACATION = "VACATION",
  SICK = "SICK",
  OTHER = "OTHER",
}

export const CURRENCY_SYMBOL: Record<CURRENCY_CODE, string> = {
  [CURRENCY_CODE.USD]: "$",
  [CURRENCY_CODE.EUR]: "€",
  [CURRENCY_CODE.JPY]: "¥",
  [CURRENCY_CODE.GBP]: "£",
  [CURRENCY_CODE.AUD]: "A$",
  [CURRENCY_CODE.CAD]: "C$",
  [CURRENCY_CODE.NZD]: "NZ$",
  [CURRENCY_CODE.SGD]: "S$",
  [CURRENCY_CODE.HKD]: "HK$",
  [CURRENCY_CODE.SEK]: "kr",
  [CURRENCY_CODE.CHF]: "CHF",
  [CURRENCY_CODE.MXN]: "MX$",
  [CURRENCY_CODE.BRL]: "R$",
  [CURRENCY_CODE.RUB]: "₽",
  [CURRENCY_CODE.CNY]: "¥",
  [CURRENCY_CODE.VND]: "₫",
};

export const EXPORT_TYPE_OPTIONS = {
  PDF: "pdf",
  CSV: "csv",
  XLS: "xlsx",
};

export const EXPORT_ORIENTATION_OPTIONS = {
  PORTRAIT: "portrait",
  LANDSCAPE: "landscape",
};

export const EXPORT_PAGE_SIZE_OPTIONS = {
  LETTER: "letter",
  LEGAL: "legal",
  TABLOID: "tabloid",
  LEDGER: "ledger",
  A0: "A0",
  A1: "A1",
  A2: "A2",
  A3: "A3",
  A4: "A4",
  A5: "A5",
  A6: "A6",
};
