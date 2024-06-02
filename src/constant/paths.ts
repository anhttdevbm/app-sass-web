import { Permission } from "./enums";

export const HOME_PATH = "/";
export const SIGNIN_PATH = "/signin";
export const SIGNUP_PATH = "/signup";
export const JOIN_WORKSPACE_PATH = "/join-workspace";
export const FORGOT_PASSWORD_PATH = "/forgot-password";
export const RESET_PASSWORD_PATH = "/reset-password";
export const CHANGE_PASSWORD_PATH = "/change-password";
export const PROJECTS_PATH = "/projects";
export const BUDGETING_PATH = "/budgeting";
export const BUDGET_DETAIL_PATH = "/budgeting/{id}";
export const EMPLOYEES_PATH = "/employees";
export const EMPLOYEES_DETAIL_PATH = "/employee-detail/{id}";
export const HOLIDAY_CALENDAR_PATH = "/holiday-calendar";
export const COST_HISTORY_PATH = "/cost-history";
export const POSITIONS_PATH = "/positions";
export const PROJECT_TYPES_PATH = "/project-types";
export const CLIENT_COMPANIES_PATH = "/client-companies";
export const MY_COMPANY_PATH = "/my-company";
export const COMPANIES_PATH = "/companies";
export const COMPANY_DETAIL_PATH = "/companies/{id}";
export const COMPANY_EMPLOYEES_PATH = "/companies/{id}/employees";
export const STATEMENT_HISTORY_PATH = "/statement-history";
export const ACCOUNT_INFO_PATH = "/user-information";
export const UPGRADE_ACCOUNT_PATH = "/upgrade-account";
export const PROJECT_TASKS_PATH = "/projects/{id}/tasks";
export const PROJECT_ACTIVITIES_PATH = "/projects/{id}/activities";
export const PROJECT_BUDGET_PATH = "/projects/{id}/budget";
export const PROJECT_MEMBERS_PATH = "/projects/{id}/members";
export const PROJECT_INFORMATION_PATH = "/projects/{id}";
export const PROJECT_DOCUMENT_PATH =
  "/projects/{id}/docs?project={id}&page=1&group_by=project_id&size=50";

export const TIME_TRACKING_PATH = "/time-tracking";
export const RESOURCE_PLANING_PATH = "/resource-planing";
export const SALES_LIST_PATH = "/sales";
export const CHATTING_ROOM_PATH = "/chat";
export const CHATTING_INFO_PATH = "/chat/{id}";

// TASKCOVER AI
export const AI_CHAT_PATH = "/ai-chat";
export const AI_AGENT_PATH = "/ai-agent";
export const AI_AGENT_CHAT = "/ai-agent-chat/{id}";
export const AI_AGENT_GENERAL_PATH = "/ai-agent/{id}/general";
export const AI_AGENT_TOOLS_PATH = "/ai-agent/{id}/tools";
export const AI_AGENT_KNOWLEDGE_PATH = "/ai-agent/{id}/knowledge";
export const AI_AGENT_COMMANDS_PATH = "/ai-agent/{id}/commands";
export const AI_AGENT_PROMPT_TEMPLATES_PATH = "/ai-agent/{id}/prompt-templates";

export const SALE_DETAIL_PATH = "/sales/{id}";

export const DOCS_PATH = "/documents";
export const DOCS_DETAIL_PATH = "/documents/{id}";
export const DOCS_CREATE_PATH = "/documents/create";

// Feedback
export const FEEDBACK_PATH = "/feedback";
//blogs
export const BLOGS_PATH = "/blogs";
export const BLOG_CATEGORY_PATH = "/blog-category";
export const BLOGS_DETAIL_PATH = "/blogs/{id}";
export const BLOGS_RELATED_PATH = "/blogs/{id}/related";
//Carrer
export const CAREER_PATH = "/careers";
export const CAREER_DETAIL_PATH = "/careers/{slug}";
export const APPLICANTS_DETAIL_PATH = "/careers/{slug}/applicants";
//Billing
export const BILLING_PATH = "/billing";
export const BILLING_CREATE_PATH = "/billing/create";
export const BILLING_INFO_PATH = "/billing/{id}";
export const BILLING_DETAIL_PATH = "/billing/detail";
export const BILLING_EXPORT_PATH = "/billing/export/{id}";
export const BILLING_DUPLICATE_PATH = "/billing/duplicate";

//Budget
export const BUDGET_EXPENSE_EXPORT_PATH = "/budgeting/expense/export/{id}";
export const BUDGET_INVOICE_EXPORT_PATH = "/budgeting/invoice/export/{id}";

// Landing
export const LANDING_HOME_PATH = "/landing/home";
export const LANDING_ABOUT_US_PATH = "/landing/about-us";
export const LANDING_HELP_CENTER_PATH = "/landing/help-center";
export const LANDING_TRUST_CENTER_PATH = "/landing/trust-center";
export const LANDING_AI_PATH = "/landing/ai";
export const LANDING_PRICING_PATH = "/landing/pricing";

// Meetings
export const MEETING_HOME_PATH = "/meeting";

const AUTHORIZED_LOGGED_IN_PATHS = [
  SIGNIN_PATH,
  SIGNUP_PATH,
  JOIN_WORKSPACE_PATH,
  FORGOT_PASSWORD_PATH,
  RESET_PASSWORD_PATH,
  CHANGE_PASSWORD_PATH,
  ACCOUNT_INFO_PATH,
  // Feedback
  FEEDBACK_PATH,
];

export const AUTHORIZED_PATHS = {
  [Permission.AM]: [
    ...AUTHORIZED_LOGGED_IN_PATHS,
    PROJECTS_PATH,
    POSITIONS_PATH,
    EMPLOYEES_PATH,
    COST_HISTORY_PATH,
    PROJECT_TYPES_PATH,
    PROJECT_TASKS_PATH,
    PROJECT_INFORMATION_PATH,
    PROJECT_MEMBERS_PATH,
    PROJECT_BUDGET_PATH,
    PROJECT_ACTIVITIES_PATH,
    MY_COMPANY_PATH,
    HOME_PATH,
    TIME_TRACKING_PATH,
    RESOURCE_PLANING_PATH,
    SALE_DETAIL_PATH,
    SALES_LIST_PATH,
    DOCS_PATH,
    DOCS_DETAIL_PATH,
    DOCS_CREATE_PATH,
    CHATTING_ROOM_PATH,

    // AI
    AI_CHAT_PATH,
    AI_AGENT_PATH,

    FEEDBACK_PATH,
    // Billing
    BILLING_PATH,
    BILLING_CREATE_PATH,
    BILLING_INFO_PATH,
    BILLING_DETAIL_PATH,
    BILLING_EXPORT_PATH,
    BILLING_PATH,
    BILLING_DUPLICATE_PATH,
    // Budgeting
    BUDGETING_PATH,
    BUDGET_DETAIL_PATH,
    BUDGET_EXPENSE_EXPORT_PATH,
    MEETING_HOME_PATH,
  ],
  [Permission.SA]: [
    ...AUTHORIZED_LOGGED_IN_PATHS,
    HOME_PATH,
    COMPANIES_PATH,
    COMPANY_EMPLOYEES_PATH,
    COMPANY_DETAIL_PATH,
    STATEMENT_HISTORY_PATH,
    UPGRADE_ACCOUNT_PATH,
    // Feedback
    FEEDBACK_PATH,
    //blog
    BLOGS_PATH,
    BLOG_CATEGORY_PATH,
    BLOGS_DETAIL_PATH,
    //Carrer
    CAREER_PATH,
    CAREER_DETAIL_PATH,
    BLOGS_RELATED_PATH,
    BUDGET_EXPENSE_EXPORT_PATH,
  ],
  [Permission.ST]: [
    ...AUTHORIZED_LOGGED_IN_PATHS,
    PROJECTS_PATH,
    PROJECT_TYPES_PATH,
    PROJECT_TASKS_PATH,
    PROJECT_INFORMATION_PATH,
    PROJECT_MEMBERS_PATH,
    PROJECT_BUDGET_PATH,
    PROJECT_ACTIVITIES_PATH,
    MY_COMPANY_PATH,
    HOME_PATH,
    TIME_TRACKING_PATH,
    RESOURCE_PLANING_PATH,
    SALES_LIST_PATH,
    SALE_DETAIL_PATH,
    DOCS_PATH,
    DOCS_DETAIL_PATH,
    DOCS_CREATE_PATH,
    CHATTING_ROOM_PATH,

    // AI
    AI_CHAT_PATH,
    AI_AGENT_PATH,

    FEEDBACK_PATH,
    // Billing
    BILLING_PATH,
    BILLING_CREATE_PATH,
    BILLING_INFO_PATH,
    BILLING_DETAIL_PATH,
    BILLING_EXPORT_PATH,
    BILLING_PATH,
    BILLING_DUPLICATE_PATH,
    // Budgeting
    BUDGETING_PATH,
    BUDGET_DETAIL_PATH,
    BUDGET_EXPENSE_EXPORT_PATH,

    MEETING_HOME_PATH,
  ],
  [Permission.EU]: [...AUTHORIZED_LOGGED_IN_PATHS, UPGRADE_ACCOUNT_PATH],
};
