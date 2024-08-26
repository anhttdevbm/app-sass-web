const ADMIN_ROUTER_ROOT = "/admin";
const USER_ROUTER_ROOT = "/";

const BASIC_ROUTERS = {
  FORBIDEN: "/forbiden",
  NOT_FOUND: "*",
  AUTH: "/auth",
  REGISTER: "auth/register",
  CHANGE_PASSWORD: "/auth/change-password",
  FORGOT_PASSWORD: "/auth/forgot-password",
  PROFILE: "/profile",
  VERIFY_ACCOUNT: "/verify-account",
  VERIFY_ACCOUNT_SUCCESS: "/verify-account-success",
  VERIFY_ACCOUNT_FAIL: "/verify-account-failure",
  UPGRADE_ACCOUNT: "/upgrade-account",
  RESET_PASSWORD: "/reset-password/:token",
};

const ADMIN_ROUTERS = {
  ADMIN: ADMIN_ROUTER_ROOT,
  DASHBOARD: `${ADMIN_ROUTER_ROOT}/dashboard`,
  USER_MANAGEMENT: `${ADMIN_ROUTER_ROOT}/users`,
  PROJECTS: `${ADMIN_ROUTER_ROOT}/projects`,
  PROJECT_DETAILS: `${ADMIN_ROUTER_ROOT}/projects/:id`,
  PROJECT_TASK: `${ADMIN_ROUTER_ROOT}/projects/:id/task`,
  PROJECT_WORK: `${ADMIN_ROUTER_ROOT}/projects/:id/work`,
  PROJECT_COST: `${ADMIN_ROUTER_ROOT}/projects/:id/cost`,
  PROJECT_MEMBERS: `${ADMIN_ROUTER_ROOT}/projects/:id/members`,
  PROJECT_INFORMATION: `${ADMIN_ROUTER_ROOT}/projects/:id/information`,
  TASKS: `${ADMIN_ROUTER_ROOT}/tasks`,
  TIME_TRACKING: `${ADMIN_ROUTER_ROOT}/time-tracking`,
  TIME_TRACKING_MY_TIME: `${ADMIN_ROUTER_ROOT}/time-tracking/my-time`,
  TIME_TRACKING_COMPANY_TIME: `${ADMIN_ROUTER_ROOT}/time-tracking/company-time`,
  TIME_TRACKING_TIME_LOG: `${ADMIN_ROUTER_ROOT}/time-tracking/time-log`,

  DOCUMENT: `${ADMIN_ROUTER_ROOT}/document`,
  CHAT: `${ADMIN_ROUTER_ROOT}/chat`,
  WRITING_ASSISTANT: `${ADMIN_ROUTER_ROOT}/writing-assistant`,
  BUDGETING: `${ADMIN_ROUTER_ROOT}/budgeting`,
  RESOURCE_PLANNING: `${ADMIN_ROUTER_ROOT}/resource-planning`,
  SALES: `${ADMIN_ROUTER_ROOT}/sales`,
  BILLING: `${ADMIN_ROUTER_ROOT}/billing`,
  ME: `${ADMIN_ROUTER_ROOT}/profile/me`,
  COMPANY: `${ADMIN_ROUTER_ROOT}/company`,
  COMPANY_LIST_EMPLOYEE: `${ADMIN_ROUTER_ROOT}/company/employees`,
  COMPANY_COST_HISTORY: `${ADMIN_ROUTER_ROOT}/company/cost-history`,
  COMPANY_LIST_OF_POSITIONS: `${ADMIN_ROUTER_ROOT}/company/positions`,
  COMPANY_LIST_OF_PRODUCTS: `${ADMIN_ROUTER_ROOT}/company/products`,
  COMPANY_PROJECT_TYPE_LIST: `${ADMIN_ROUTER_ROOT}/company/project-types`,
  COMPANY_INFORMATION: `${ADMIN_ROUTER_ROOT}/company/information`,
  UPDATE_PASSWORD: `${ADMIN_ROUTER_ROOT}/change-password`,
  UPGRADE_ACCOUNT_PRO: `${ADMIN_ROUTER_ROOT}/upgrade-account`,

  MANAGE_COMPANY_LIST: `${ADMIN_ROUTER_ROOT}/companyManage`,
  MANAGE_COMPANY_STATEMENT: `${ADMIN_ROUTER_ROOT}/companyManage/statement`,
  MANAGE_COMPANY_INFO: `${ADMIN_ROUTER_ROOT}/companyManage/:id`,
};

const USER_ROUTERS = {
  HOME: USER_ROUTER_ROOT,
};

export { BASIC_ROUTERS, ADMIN_ROUTERS, USER_ROUTERS };

export default {
  ...BASIC_ROUTERS,
  ...ADMIN_ROUTERS,
  ...USER_ROUTERS,
};
