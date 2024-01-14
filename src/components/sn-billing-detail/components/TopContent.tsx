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
  BILLING_PATH,
  PROJECT_MEMBERS_PATH,
  PROJECT_TASKS_PATH,
} from "constant/paths";
import PlusIcon from "icons/PlusIcon";
import { useTranslations } from "next-intl";
import { NS_BILLING, NS_PROJECT } from "constant/index";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Billing, Member } from "store/billing/reducer";
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

const ITEM_HEIGHT = 48;

type TopContentProps = {
  tagsOptions?: Option[];
  item?: Billing;
  user: User;
  memberOptions?: Option[];
};

const TopContent = (props: TopContentProps) => {
  const { tagsOptions, item, memberOptions, user } = props;
  const { onAddUserToBilling, addUserStatus, onGetBilling } = useBillings();
  const { title, prevPath } = useHeaderConfig();
  const { isMdSmaller } = useBreakpoint();
  const billingT = useTranslations(NS_BILLING);
  const { id } = useParams() as { id: string };
  const { push } = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [listUser, setListUser] = useState<Member[]>([]);
  const [tagSelected, setTagSelected] = useState<string>("");
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

    onAddUserToBilling(id, lastItem?.id);
  };

  useEffect(() => {
    if (user && listUser.length === 0 && item?.user && item.user.length === 0) {
      if (!setMember.has(user.id)) {
        setMember.add(user.id);
        const member = {
          id: user.id,
          fullname: user.fullname,
          avatar: {
            link: user?.avatar?.link,
          },
        } as Member;

        setListUser([member]);
      }
    }
  }, [user, item]);

  useEffect(() => {
    if (item?.user && item.user.length > 0 && listUser?.length === 0) {
      const filterMember = item.user
        ?.map((item) => {
          if (!setMember.has(item.id)) {
            setMember.add(item.id);
            const member = {
              id: item.id,
              fullname: item.fullname,
              avatar: {
                link: item?.avatar?.link,
              },
            } as Member;
            return member;
          }
        })
        .filter((item2) => item2 && typeof item2 !== "undefined");

      setListUser([...filterMember] as Member[]);
    }
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

    //   // setListUser([...listUser, ...filterMember] as Member[]);
    // }
  }, [item]);

  // console.log(user);
  // console.log(listUser);

  useEffect(() => {
    if (addUserStatus) {
      onGetBilling(id);
    }
  }, [addUserStatus]);

  return (
    <Stack gap={1} pt={2} ml={5}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        pr={3}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          flex={1}
          width="50%"
        >
          <Link
            href={BILLING_PATH ?? ""}
            underline="none"
            display={"flex"}
            alignItems={"center"}
          >
            <Avatar src={user?.avatar?.link ?? ""} />

            <Text fontWeight={600} variant={{ xs: "body2", md: "h4" }} pl={1}>
              {"Invoice " +
                (item?.invoiceNumber ? item?.invoiceNumber?.toString() : "")}
            </Text>
          </Link>
        </Stack>

        <Box
          sx={{
            textAlign: "center",
            width: 100,
            padding: 1,
            borderRadius: 2,
            background: "#C9F7F5",
            paddingRight: "3px",
          }}
        >
          <Text variant={"body2"} sx={{ color: "#1BC5BD" }}>
            {billingT("detail.form.top.title.paid")}
          </Text>
        </Box>
        <CloseOutlined onClick={() => push(BILLING_PATH)} />
      </Stack>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={0.5}
          flex={1}
          width="50%"
        >
          <Button
            // startIcon={<PlusIcon />}
            // onClick={onAddNew}
            size="small"
            variant="primary"
          >
            {billingT("detail.form.top.button.markAsSent")}
          </Button>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent={"end"}
          spacing={1}
          flex={1}
          width="50%"
        >
          {/* <Dropdown
            placeholder={"company name"}
            options={[]}
            name="status"
            onChange={(name, value) => null}
            // value={listUser}
            rootSx={{
              px: "0px!important",
              [`& .${selectClasses.outlined}`]: {
                pr: "0!important",
                mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                  `${spacing(4)}!important`,
                "& .sub": {
                  display: "none",
                },
              },
            }}
          /> */}

          <Stack
            direction={"row"}
            gap={2}
            alignItems={"center"}
            sx={{
              ["& .MuiAvatar-root"]: {
                // marginLeft: "-20px",
                position: "initial",
                background: "#E1F0FF",
                color: "#666",
                width: 24,
                height: 24,
              },
              ["& .MuiAvatarGroup-root .MuiAvatar-root"]: {
                marginLeft: "-15px",
              },
            }}
          >
            <AvatarGroup total={listUser?.length} max={5} spacing={"medium"}>
              {listUser?.map((item, index) => {
                // eslint-disable-next-line react/jsx-key
                return (
                  <Avatar
                    key={index}
                    src={item?.avatar?.link ?? ""}
                    alt=""
                    sx={{ width: 24, height: 24 }}
                  />
                );
              })}
            </AvatarGroup>
          </Stack>

          <Stack direction={"row"} gap={2}>
            <SelectMembers
              onChange={(name, data) => onChangeMember(name, data)}
              name=""
              value={listUser}
            />
          </Stack>

          <DropdownTag
            placeholder={""}
            options={tagsOptions ?? []}
            name="Tag"
            onChange={(name, value) => setTagSelected(value)}
            value={tagSelected}
            rootSx={{
              px: "0px!important",
              [`& .${selectClasses.outlined}`]: {
                pr: "0!important",
                mr: ({ spacing }: { spacing: Theme["spacing"] }) =>
                  `${spacing(4)}!important`,
                "& .sub": {
                  display: "none",
                },
              },
            }}
          />
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? "long-menu" : undefined}
            aria-expanded={open ? "true" : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="long-menu"
            MenuListProps={{
              "aria-labelledby": "long-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            PaperProps={{
              style: {
                maxHeight: ITEM_HEIGHT * 4.5,
                width: "25ch",
              },
            }}
          >
            {options.map((option) => (
              <MenuItem
                key={option}
                selected={option === "Pyxis"}
                onClick={handleClose}
              >
                {option ===
                billingT("detail.form.top.button.option.duplicateInvoice") ? (
                  <Stack gap={2} direction={"row"} alignItems={"center"}>
                    <ContentCopyRounded />
                    <Text variant={"body2"}>
                      {billingT(
                        "detail.form.top.button.option.duplicateInvoice",
                      )}
                    </Text>
                  </Stack>
                ) : option ===
                  billingT("detail.form.top.button.option.createCreditNote") ? (
                  <Stack gap={2} direction={"row"} alignItems={"center"}>
                    <SubtitlesOutlined />
                    <Text variant={"body2"}>
                      {billingT(
                        "detail.form.top.button.option.createCreditNote",
                      )}
                    </Text>
                  </Stack>
                ) : option ===
                  billingT("detail.form.top.button.option.deleteInvoice") ? (
                  <Stack
                    gap={2}
                    direction={"row"}
                    alignItems={"center"}
                    color={"red"}
                  >
                    <TrashIcon sx={{ fontSize: 25 }} />
                    <Text variant={"body2"} color={"red"}>
                      {billingT("detail.form.top.button.option.deleteInvoice")}
                    </Text>
                  </Stack>
                ) : (
                  ""
                )}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default memo(TopContent);
