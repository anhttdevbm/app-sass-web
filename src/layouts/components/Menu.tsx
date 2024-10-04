import { Stack } from "@mui/material";
import Link from "components/Link";
import { Button, Text } from "components/shared";
import { Permission } from "constant/enums";
import { NS_LAYOUT } from "constant/index";
import {
  AI_AGENT_PATH,
  AI_CHAT_PATH,
  BLOG_CATEGORY_PATH,
  BLOGS_PATH,
  BUDGETING_PATH,
  CAREER_PATH,
  CHATTING_ROOM_PATH,
  CLIENT_COMPANIES_PATH,
  COMPANIES_PATH,
  DOCS_PATH,
  EMPLOYEES_PATH,
  FEEDBACK_PATH,
  HOLIDAY_CALENDAR_PATH,
  HOME_PATH,
  INVOICES_PATH,
  LANDING_ABOUT_US_PATH,
  LANDING_AI_PATH,
  LANDING_HELP_CENTER_PATH,
  LANDING_HOME_PATH,
  LANDING_PRICING_PATH,
  LANDING_TRUST_CENTER_PATH,
  MY_COMPANY_PATH,
  PACKAGE_MANAGERMENT_PATH,
  POSITIONS_PATH,
  PROJECT_TYPES_PATH,
  PROJECTS_PATH,
  RESOURCE_PLANING_PATH,
  SALES_LIST_PATH,
  TICKET_AGENT,
  TICKET_DASHBOARD,
  TICKET_PATH,
  TIME_TRACKING_PATH
} from "constant/paths";
import dayjs from "dayjs";
import useBreakpoint from "hooks/useBreakpoint";
import useTheme from "hooks/useTheme";
import BillingIcon from "icons/BillingIcon";
import BudgetIcon from "icons/BudgetIcon";
import CardReceive from "icons/CardReceive";
import CareerIcon from "icons/CareerIcon";
import CrownIconUpgrade from "icons/CrownIconUpgrade";
import FeedbackIcon from "icons/FeedbackIcon";
import HomeOutlinedIcon from "icons/HomeOutlinedIcon";
import MenuBlogIcon from "icons/MenuBlogIcon";
import MenuChatIcon from "icons/MenuChatIcon";
import MenuCompanyIcon from "icons/MenuCompanyIcon";
import MenuDashboardIcon from "icons/MenuDashboardIcon";
import MenuDocsIcon from "icons/MenuDocsIcon";
import MenuProjectIcon from "icons/MenuProjectIcon";
import MenuResourcePlaningIcon from "icons/MenuResourcePlaningIcon";
import MenuTimeTrackingIcon from "icons/MenuTimeTrackingIcon";
import TaskcoverAIIcon from "icons/TaskcoverIcon";
import TicketIcon from "icons/TicketIcon";
import { useTranslations } from "next-intl";
import { usePathname } from "next-intl/client";
import { memo, MouseEvent, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth, useSidebar, useSnackbar } from "store/app/selectors";
import { AppDispatch } from "store/configureStore";
import {
  getPriceUpgradePackage,
  getRequestUpgradePayment,
  pay,
} from "store/payment/actions";
import Collapse from "./Collapse";
import SubMenu from "./SubMenu";
import { MenuItemProps } from "./helpers";

const Menu = () => {
  const { user } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const { onAddSnackbar } = useSnackbar();

  const onClickUpgradeAccount = async () => {
    if (user)
      if (
        user?.roles?.includes(Permission.AM) &&
        !user?.roles?.includes(Permission.BO)
      ) {
        const result = await dispatch(getRequestUpgradePayment());

        if (result?.payload?.success) {
          onAddSnackbar("Request Success", "success");
        } else {
          onAddSnackbar("Already sent a payment request!", "error");
        }
      } else {
        const priceUpgradePackage = {
          newPackage: user.packageName || "",
          billingPlan: "monthly",
          numberOfUser: 1,
        };
        
        const resultAction = await dispatch(
          getPriceUpgradePackage(priceUpgradePackage),
        );
        const price = resultAction.payload?.data;
        const payload = {
          billing_plan: "Monthly",
          packageName:
            user?.packageName === "Standard"
              ? "1"
              : user?.packageName === "Business"
              ? "2"
              : user?.packageName === "Enterprise"
              ? "3"
              : "0",
          currency_code: "USD",
          sub_total: price?.subTotal,
          vat: price?.vat,
        };
        const result = await dispatch(pay(payload));

        if (pay.fulfilled.match(result)) {
          window.open(result?.payload?.return_url, "_blank");
        } else {
          console.error("Error");
        }
      }
  };
  return (
    <Stack
      width="100%"
      spacing={{ xs: 1, xl: 1.5 }}
      sx={{
        overflowX: "hidden",
        overflowY: "auto",
      }}
    >
      {user?.expiration_date &&
        dayjs(user?.expiration_date).diff(dayjs(), "day") < 3 && (
          <Button
            size="extraSmall"
            variant="primary"
            sx={{ height: 48 }}
            onClick={onClickUpgradeAccount}
          >
            <CrownIconUpgrade />
            <Text sx={{ marginLeft: "6px", color: "#fff" }}>
              Upgrade account
            </Text>
          </Button>
        )}

      {DATA.map((item) => {
        const isAuthorized = user?.roles?.some((role) =>
          item?.roles?.includes(role),
        );
        if (isAuthorized) {
          return <MenuItem key={item.label} {...item} />;
        }
        return null;
      })}
    </Stack>
  );
};

export default memo(Menu);

const MenuItem = (props: MenuItemProps) => {
  const { icon, href, label, subs } = props;

  const pathname = usePathname();
  const { isExpandedSidebar } = useSidebar();
  const { isLgSmaller, isSmSmaller } = useBreakpoint();

  const isShowLarge = useMemo(
    () => isExpandedSidebar && !isLgSmaller,
    [isExpandedSidebar, isLgSmaller],
  );

  if (subs && (isShowLarge || isSmSmaller)) {
    return (
      <Collapse label={label} icon={icon}>
        {subs.map((subItem) => (
          <LinkItem key={subItem.label} {...subItem} />
        ))}
      </Collapse>
    );
  }

  return <LinkItem {...props} />;
};

const LinkItem = (props: Omit<MenuItemProps, "children">) => {
  const { icon, href, label, subs } = props;

  const t = useTranslations(NS_LAYOUT);

  const { isDarkMode } = useTheme();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const { isExpandedSidebar } = useSidebar();
  const { isLgSmaller, isSmSmaller } = useBreakpoint();

  const isShowLarge = useMemo(
    () => isExpandedSidebar && !isLgSmaller,
    [isExpandedSidebar, isLgSmaller],
  );

  const pathname = usePathname();

  const isActiveLink = useMemo(
    () => checkIsActiveLink(pathname, href),
    [pathname, href],
  );

  const onMouseOver = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!subs) return;
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    if (!subs) return;
    setAnchorEl(null);
  };

  return (
    <Link
      href={href ?? "#"}
      className={isActiveLink ? "active" : ""}
      underline="none"
      sx={{
        width: "100%",
        color: "grey.400",
        borderRadius: 1,
        px: isShowLarge || isSmSmaller ? { xs: 1.5, xl: 2.5 } : 1,
        py: isShowLarge || isSmSmaller ? { xs: 1, xl: 1.5 } : 1,
        // backgroundColor: {
        //   xs: isDarkMode ? "background.default" : "grey.50",
        //   sm: undefined,
        // },
        "&:hover, &.active": {
          backgroundColor: isDarkMode ? "grey.50" : "primary.light",
        },
        display: "inline-flex",
      }}
      tooltip={isShowLarge || isSmSmaller || !!subs ? undefined : t(label)}
      placement="right"
      onMouseOver={onMouseOver}
      onMouseOut={onClose}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{
          "& svg:first-of-type": {
            fontSize: 24,
          },
        }}
      >
        {icon}
        {(isShowLarge || isSmSmaller) && (
          <Text
            color="grey.400"
            variant={{ xs: "body2", xl: "body1" }}
            ml={icon ? undefined : 4.5}
            noWrap
            textTransform="capitalize"
          >
            {t(label)}
          </Text>
        )}
        {!!subs && (
          <SubMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            options={subs}
          />
        )}
      </Stack>
    </Link>
  );
};

const DATA: MenuItemProps[] = [
  {
    label: "menu.dashboard",
    href: HOME_PATH,
    icon: <MenuDashboardIcon />,
    roles: [Permission.AM, Permission.ST],
  },

  {
    label: "menu.project",
    icon: <MenuProjectIcon />,
    href: PROJECTS_PATH,
    roles: [Permission.AM, Permission.ST],
  },
  // {
  //   label: "menu.task",
  //   icon: <MenuTaskIcon />,
  //   roles: [Permission.AM, Permission.ST],
  // },
  {
    label: "menu.company",
    icon: <MenuCompanyIcon />,
    subs: [
      { label: "menu.employees", href: EMPLOYEES_PATH, roles: [Permission.AM] },
      // {
      //   label: "menu.costHistory",
      //   href: COST_HISTORY_PATH,
      //   roles: [Permission.AM],
      // },
      {
        label: "menu.listOfPositions",
        href: POSITIONS_PATH,
        roles: [Permission.AM],
      },
      {
        label: "menu.projectTypeList",
        href: PROJECT_TYPES_PATH,
        roles: [Permission.AM],
      },
      {
        label: "menu.clientCompanies",
        href: CLIENT_COMPANIES_PATH,
        roles: [Permission.AM],
      },
      {
        label: "menu.companyInformation",
        href: MY_COMPANY_PATH,
        roles: [Permission.AM],
      },
      {
        label: "menu.holidayCalendar",
        href: HOLIDAY_CALENDAR_PATH,
        roles: [Permission.AM],
      },
      {
        label: "menu.packageManager",
        href: PACKAGE_MANAGERMENT_PATH,
        roles: [Permission.AM, Permission.ST, Permission.SA],
      },
    ],
    roles: [Permission.AM],
  },
  {
    label: "menu.manager",
    icon: <MenuCompanyIcon />,
    subs: [
      {
        label: "menu.companyList",
        href: COMPANIES_PATH,
        roles: [Permission.SA],
      },
      // {
      //   label: "menu.statementHistory",
      //   href: STATEMENT_HISTORY_PATH,
      //   roles: [Permission.SA],
      // },
    ],
    roles: [Permission.SA],
  },
  {
    label: "menu.timeTracking",
    href: TIME_TRACKING_PATH,
    icon: <MenuTimeTrackingIcon />,
    roles: [Permission.AM, Permission.ST, Permission.MN],
  },
  {
    label: "menu.resourcePlaning",
    href: RESOURCE_PLANING_PATH,
    icon: <MenuResourcePlaningIcon />,
    roles: [Permission.AM, Permission.MN],
  },
  {
    label: "menu.budgeting",
    icon: <BudgetIcon />,
    href: BUDGETING_PATH,
    roles: [Permission.AM, Permission.MN],
  },
  {
    label: "menu.invoice",
    icon: <BillingIcon />,
    href: INVOICES_PATH,
    roles: [Permission.AM, Permission.MN],
  },
  {
    label: "menu.chat",
    href: CHATTING_ROOM_PATH,
    icon: <MenuChatIcon />,
    roles: [Permission.AM, Permission.ST, Permission.MN],
  },
  {
    label: "menu.taskcoverAI",
    icon: <TaskcoverAIIcon />,
    roles: [Permission.AM, Permission.ST, Permission.MN],
    subs: [
      {
        label: "menu.aiChat",
        roles: [Permission.AM, Permission.ST, Permission.MN],
        href: AI_CHAT_PATH,
      },
      {
        label: "menu.aiAgent",
        roles: [Permission.AM, Permission.ST, Permission.MN],
        href: AI_AGENT_PATH,
      },
    ],
  },
  {
    label: "menu.sales",
    href: SALES_LIST_PATH,
    icon: <CardReceive />,
    roles: [Permission.AM, Permission.MN],
  },
  {
    label: "menu.docs",
    href: DOCS_PATH,
    icon: <MenuDocsIcon />,
    roles: [Permission.AM, Permission.ST, Permission.MN],
  },
  {
    label: "menu.ticket",
    href: TICKET_PATH,
    icon: <TicketIcon />,
    roles: [Permission.AM, Permission.ST, Permission.MN],
  },
  // Feedback
  {
    label: "menu.feedback",
    icon: <FeedbackIcon />,
    href: FEEDBACK_PATH,
    roles: [Permission.SA],
  },
  {
    label: "menu.blog",
    icon: <MenuBlogIcon />,
    subs: [
      {
        label: "menu.blogCategoryList",
        roles: [Permission.SA],
        href: BLOG_CATEGORY_PATH,
      },
      {
        label: "menu.blogList",
        href: BLOGS_PATH,
        roles: [Permission.SA],
      },
    ],
    roles: [Permission.SA],
  },
  //Carrer
  {
    label: "menu.career",
    icon: <CareerIcon />,
    href: CAREER_PATH,
    roles: [Permission.SA],
  },
  // Contents
  {
    label: "menu.contents",
    icon: <HomeOutlinedIcon />,
    subs: [
      {
        label: "menu.landingHome",
        roles: [Permission.SA],
        href: LANDING_HOME_PATH,
      },
      {
        label: "menu.landingAboutUs",
        roles: [Permission.SA],
        href: LANDING_ABOUT_US_PATH,
      },
      {
        label: "menu.landingHelpCenter",
        roles: [Permission.SA],
        href: LANDING_HELP_CENTER_PATH,
      },
      {
        label: "menu.landingTrustCenter",
        roles: [Permission.SA],
        href: LANDING_TRUST_CENTER_PATH,
      },
      {
        label: "menu.landingAI",
        roles: [Permission.SA],
        href: LANDING_AI_PATH,
      },
      {
        label: "menu.landingPricing",
        roles: [Permission.SA],
        href: LANDING_PRICING_PATH,
      },
    ],
    roles: [Permission.SA],
  },

  // Ticket manager
  {
    label: "menu.ticket",
    icon: <TicketIcon />,
    subs: [
      {
        label: "menu.dashboard",
        href: TICKET_DASHBOARD,
        roles: [Permission.SA],
      },
      {
        label: "menu.ticket",
        href: TICKET_PATH,
        roles: [Permission.SA],
      },
      {
        label: "menu.agent",
        href: TICKET_AGENT,
        roles: [Permission.SA],
      },
    ],
    roles: [Permission.SA],
  },
];

const checkIsActiveLink = (pathname: string, href?: string) => {
  return Boolean(
    pathname &&
      href &&
      (pathname === href ||
        (href.length && href !== "/" && pathname.startsWith(href))),
  );
};
