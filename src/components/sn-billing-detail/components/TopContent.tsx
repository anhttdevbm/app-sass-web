import { memo, useEffect, useMemo, useState } from "react";
import {
  Avatar,
  AvatarGroup,
  Box,
  Menu,
  MenuItem,
  Stack,
  StackProps,
  Theme,
  Typography,
  selectClasses,
} from "@mui/material";
import Link from "components/Link";
import ChevronIcon from "icons/ChevronIcon";
import { Button, IconButton, Select, Text } from "components/shared";
import { useHeaderConfig } from "store/app/selectors";
import useBreakpoint from "hooks/useBreakpoint";
import { usePathname, useRouter } from "next-intl/client";
import { useParams } from "next/navigation";
import {
  BILLING_DUPLICATE_PATH,
  BILLING_PATH,
  INVOICES_PATH,
  PROJECT_MEMBERS_PATH,
  PROJECT_TASKS_PATH,
} from "constant/paths";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { NS_BILLING, NS_PROJECT } from "constant/index";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Billing } from "store/billing/reducer";
import { Option, User } from "constant/types";
import TrashIcon from "icons/TrashIcon";
import {
  CloseOutlined,
  ContentCopyRounded,
  Subtitles,
  SubtitlesOutlined,
  TagOutlined,
} from "@mui/icons-material";
import CopyIcon from "icons/CopyIcon";
import SelectMembers from "./SelectMembers";
import { Dropdown } from "components/Filters";
import DropdownTag from "./DropdownTag";
import { useBillings } from "store/billing/selectors";
import useTheme from "hooks/useTheme";
import { Invoice, Member } from "store/invoice/reducer";
import CommentHistory from "icons/CommentHistory";

const ITEM_HEIGHT = 48;

type TopContentProps = {
  tagsOptions?: Option[];
  item?: Invoice;
  user: User;
  memberOptions?: Option[];
  handleDisplayComment: (value: boolean) => void;
};

const TopContent = (props: TopContentProps) => {
  const { tagsOptions, item, memberOptions, user, handleDisplayComment } =
    props;
  const {
    onAddUserToBilling,
    addUserStatus,
    onGetBilling,
    onMarkAsSentBilling,
    markAsSend,
    isUpdateTagBill,
    onUpdateTagBilling,
    onDeleteBilling,
    isDeleted,
  } = useBillings();
  const { title, prevPath } = useHeaderConfig();
  const { isMdSmaller } = useBreakpoint();
  const billingT = useTranslations(NS_BILLING);
  const { id } = useParams() as { id: string };
  const { push } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [listUser, setListUser] = useState<Member[]>([]);
  const [tagSelected, setTagSelected] = useState<string>("");
  const [markSent, setMarkSent] = useState<string>("");
  const { isDarkMode } = useTheme();

  const open = Boolean(anchorEl);

  const options = [
    billingT("detail.form.top.button.option.duplicateInvoice"),
    billingT("detail.form.top.button.option.createCreditNote"),
    billingT("detail.form.top.button.option.deleteInvoice"),
  ];

  const setMember = new Set<String>();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onChangeMember = (name, data) => {
    setListUser(data);

    const lastItem = data[data.length - 1];

    onAddUserToBilling(id, data);
  };

  const onChangeTag = (input) => {
    const data = {
      tag: input,
    };
    onUpdateTagBilling(id, data);
  };

  const onDelete = () => {
    onDeleteBilling(id);
    push(BILLING_PATH);
  };

  useEffect(() => {
    if (item?.members && item.members.length > 0 && listUser?.length === 0) {
      const filterMember = item.members
        ?.map((item) => {
          if (!setMember.has(item.id)) {
            setMember.add(item.id);
            const member = {
              id: item.id,
              fullname: item.fullname,
              email: item.email,
            } as Member;
            return member;
          }
        })
        .filter((item2) => item2 && typeof item2 !== "undefined");
      setListUser([...filterMember] as Member[]);
    }
    // if (item?.tag && item?.tag?.length > 0) {
    //   setTagSelected(item?.tag[0] ?? "");
    // }
    // if (item?.mail_status) {
    //   setMarkSent(item?.mail_status ?? "");
    // }
    // if (item?.user && item.user.length > 0 && listUser?.length > 0) {
    //   const filterMember = item.user
    //     ?.map((item) => {
    //       if (!setMember.has(item.id)) {
    //         setMember.add(item.id);
    //         const member = {
    //           id: item.id,
    //           fullname: item.fullname,
    //           avatar: item?.avatar,
    //         } as Member;
    //         return member;
    //       }
    //     })
    //     .filter((item2) => item2 && typeof item2 !== "undefined");
    //   console.log(filterMember);
    // setListUser([...listUser, ...filterMember] as Member[]);
  }, [item]);

  useEffect(() => {
    if ((addUserStatus || isUpdateTagBill) && id) {
      onGetBilling(id);
    }
  }, [addUserStatus, isUpdateTagBill]);

  useEffect(() => {
    if (id) {
      onGetBilling(id);
      setMarkSent("");
    }
  }, [markAsSend]);

  const onMarkAsSend = () => {
    const data = {
      mail_status: markSent == "Sent" ? "Unsend" : "Sent",
    };
    onMarkAsSentBilling(id, data);
  };

  return (
    <Stack
      gap={1}
      pt={1}
      px={2}
      bgcolor={isDarkMode ? "#313130" : "white"}
      borderRadius={1}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        pr={3}
        sx={{ borderBottom: "1px solid #EEEEEE" }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          flex={1}
          width="50%"
        >
          <Link
            href={INVOICES_PATH ?? ""}
            underline="none"
            display={"flex"}
            alignItems={"center"}
          >
            {/* <Avatar src={user?.avatar?.link ?? ""} /> */}

            <Text fontWeight={600} variant={{ xs: "body2", md: "h4" }} pl={1}>
              INV-{item?.invoice_number ? item?.invoice_number?.toString() : ""}
            </Text>

            <Box
              sx={{
                border: "1px solid rgba(131, 129, 149, 0.2)",
                color: "#838195",
                padding: "3px",
                marginLeft: "16px",
                borderRadius: "3px",
                fontSize: "14px",
              }}
            >
              DRAFT
            </Box>
          </Link>
        </Stack>

        <Button
          onClick={() => handleDisplayComment(true)}
          sx={{
            textAlign: "center",
            padding: 1,
            paddingRight: "3px",
            display: "flex",
            gap: "12px",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Stack
            sx={{
              width: "1.5px",
              height: "20px",
              margin: "auto",
              background: "#E0E0E0",
            }}
          />
          <CommentHistory
            sx={{
              marginTop: "2px",
              width: "16px",
            }}
          />
          <Typography fontSize={14} fontWeight={400} color="#212529">
            Comments & History
          </Typography>
        </Button>
        <CloseOutlined
          sx={{ cursor: "pointer" }}
          onClick={() => push(INVOICES_PATH)}
        />
      </Stack>
    </Stack>
  );
};

export default memo(TopContent);
