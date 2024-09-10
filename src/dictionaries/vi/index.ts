import {
  NS_ACCOUNT,
  NS_AI_AGENT,
  NS_AI_CHAT,
  NS_APPLICANTS,
  NS_AUTH,
  NS_BILLING,
  NS_BLOG,
  NS_BUDGETING,
  NS_CAREER,
  NS_CHAT,
  NS_CHAT_BOX,
  NS_COMMON,
  NS_COMPANY,
  NS_CONTENTS,
  NS_COST_RATE,
  NS_DOCS,
  NS_FEEDBACK,
  NS_HOLIDAY_CALENDAR,
  NS_INVOICE,
  NS_LAYOUT,
  NS_MANAGER,
  NS_PACKAGE_MANAGERMENT,
  NS_PROJECT,
  NS_RESOURCE_PLANNING,
  NS_SALES,
  NS_TICKET,
  NS_TIME_TRACKING,
} from "constant/index";

import { AccountLang } from "./account";
import { AIAgentLang } from "./aiAgent";
import { AIChatLang } from "./aiChat";
import { ApplicantsLang } from "./applicants";
import { AuthLang } from "./auth";
import { BillingLang } from "./billing";
import { BlogLang } from "./blog";
import { BudgetingLang } from "./budgeting";
import { CareerLang } from "./career";
import { ChatLang } from "./chat";
import { ChatBoxLang } from "./chatbox";
import { CommonLang } from "./common";
import { CompanyLang } from "./company";
import { ContentsLang } from "./contents";
import { CostRateLang } from "./costRate";
import { DocsLang } from "./docs";
import { FeedbackLang } from "./feedback";
import { HolidayCalendarLang } from "./holidayCalendar";
import { InvoiceLang } from "./invoice";
import { LayoutLang } from "./layout";
import { ManagerLang } from "./manager";
import { PackageManagementLang } from "./packageManagement";
import { ProjectLang } from "./project";
import { ResourcePlanning } from "./resourcePlanning";
import { salesLang } from "./sales";
import { TicketLang } from "./ticket";
import { TimeTrackingLang } from "./timetracking";

export default {
  [NS_COMMON]: CommonLang,
  [NS_AUTH]: AuthLang,
  [NS_LAYOUT]: LayoutLang,
  [NS_ACCOUNT]: AccountLang,
  [NS_PROJECT]: ProjectLang,
  [NS_COMPANY]: CompanyLang,
  [NS_MANAGER]: ManagerLang,
  [NS_TIME_TRACKING]: TimeTrackingLang,
  [NS_SALES]: salesLang,
  [NS_RESOURCE_PLANNING]: ResourcePlanning,
  [NS_CHAT]: ChatLang,
  [NS_CHAT_BOX]: ChatBoxLang,
  [NS_AI_CHAT]: AIChatLang,
  [NS_AI_AGENT]: AIAgentLang,
  [NS_DOCS]: DocsLang,
  [NS_FEEDBACK]: FeedbackLang,
  [NS_BLOG]: BlogLang,
  [NS_BUDGETING]: BudgetingLang,
  [NS_CAREER]: CareerLang,
  [NS_APPLICANTS]: ApplicantsLang,
  [NS_BILLING]: BillingLang,
  [NS_COST_RATE]: CostRateLang,
  [NS_HOLIDAY_CALENDAR]: HolidayCalendarLang,
  [NS_PACKAGE_MANAGERMENT]: PackageManagementLang,
  [NS_CONTENTS]: ContentsLang,
  [NS_INVOICE]: InvoiceLang,
  [NS_TICKET]: TicketLang,
};
