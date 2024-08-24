import { Stack, Tab } from "@mui/material";
import { NS_BILLING } from "constant/index";
import useTheme from "hooks/useTheme";
import { useTranslations } from "next-intl";
import { memo, useEffect, useState } from "react";

import { ContentCopyRounded, SubtitlesOutlined } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Avatar, AvatarGroup, Menu, MenuItem } from "@mui/material";
import { IconButton, Text } from "components/shared";
import { ButtonGradiant } from "components/sn-invoice/components";
import { User } from "constant/types";
import { FormikProps, useFormik } from "formik";
import useBreakpoint from "hooks/useBreakpoint";
import PlusIcon from "icons/PlusIcon";
import TrashIcon from "icons/TrashIcon";
import { useRouter } from "next-intl/client";
import { useParams } from "next/navigation";
import { useSnackbar } from "store/app/selectors";
import { BillingData } from "store/billing/actions";
import {
  Bill,
  Billing,
  BillingDataUpdate,
  Budgets,
} from "store/billing/reducer";
import { useBillings, useClientBill } from "store/billing/selectors";
import { Invoice, Member } from "store/invoice/reducer";
import TabClient from "../Client";
import TabFeed from "../Feed";
import TabInvoice from "../Invoice";
import TabPayment from "../Payment";
import PaymentModal from "./PaymentModal";
import SelectMembers from "./SelectMembers";
const ITEM_HEIGHT = 48;

type TabItemProps = {
  label: string;
  value: string;
  editForm?: boolean;
  item?: Invoice;
  arrBudgets?: Budgets[];
  user: User;
  form: FormikProps<Billing>;
  billToInfo: Bill;
  setBillToInfo: (value: Bill) => void;
  billFromInfo: Bill;
  setBillFromInfo: (value: Bill) => void;
  handleDisplayComment: (value: boolean) => void;
  openComment: boolean;
};

type TabListProps = {
  item?: Invoice;
  arrBudgets?: Budgets[];
  user: User;
  handleDisplayComment: (value: boolean) => void;
  openComment: boolean;
};

const TabInfo = (props: TabListProps) => {
  const { item, user, arrBudgets, handleDisplayComment, openComment } = props;
  // const { id } = useParams() as { id: string };
  // const pathname = usePathname();
  const billingT = useTranslations(NS_BILLING);
  const { push } = useRouter();
  const { onAddSnackbar } = useSnackbar();
  const [value, setValue] = useState("Invoice");
  const [editForm, setEditForm] = useState<boolean>(false);
  const [billToInfo, setBillToInfo] = useState<Bill>({});
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [billFromInfo, setBillFromInfo] = useState<Bill>({
    fullNameCompany: user?.company,
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [actionButton, setActionButton] = useState<string>("");
  const { isShowEditClient } = useClientBill();

  useEffect(() => {
    console.log(isShowEditClient);
  }, [isShowEditClient]);

  const TABS = [
    {
      label: billingT("detail.form.invoice.title.invoice"),
      value: "Invoice",
    },
    // {
    //   label: billingT("detail.form.feed.title.Feed"),
    //   value: "Feed",
    // },
    {
      label: billingT("detail.form.client.title.Client"),
      value: "Client",
    },
    {
      label: billingT("detail.form.payment.title.payments"),
      value: "Payment",
    },
  ];

  const {
    onAddUserToBilling,
    addUserStatus,
    onGetBilling,
    onMarkAsSentBilling,
    isUpdateTagBill,
    onUpdateTagBilling,
    onDeleteBilling,
    isDeleted,
    onUpdateBilling,
    updateStatus,
    onCreateBilling,
    createStatus,
    markAsSend,
  } = useBillings();

  const options = [
    billingT("detail.form.top.button.option.duplicateInvoice"),
    billingT("detail.form.top.button.option.createCreditNote"),
    billingT("detail.form.top.button.option.deleteInvoice"),
  ];
  const { isMdSmaller } = useBreakpoint();
  const { id } = useParams() as { id: string };
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [listUser, setListUser] = useState<Member[]>([]);
  const [tagSelected, setTagSelected] = useState<string>("");
  const [markSent, setMarkSent] = useState<string>("");
  const { isDarkMode } = useTheme();
  const open = Boolean(anchorEl);

  const setMember = new Set<String>();
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloseAddPayment = () => {
    setIsOpen(false);
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

  const onDelete = () => {};

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

  const formik = useFormik<Billing>({
    enableReinitialize: true,
    initialValues: {},
    onSubmit(values, formikHelpers) {},
  });

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleSaveValue = (data: BillingDataUpdate) => {
    onUpdateBilling(data);
    onAddSnackbar("Cập nhật thành công!", "success");
  };

  const handleCreateData = (data: BillingData) => {
    onCreateBilling(data);
    onAddSnackbar("Thành công!", "success");
  };

  return (
    <>
      <Stack
        borderBottom={{ md: "1px solid" }}
        borderColor={{ md: "grey.100" }}
        width="100%"
        bgcolor="background.paper"
        px={3}
      >
        <TabContext value={value}>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            gap={1}
            height={56}
            mt={2}
          >
            {!isShowEditClient && (
              <TabList
                key={value}
                onChange={handleChange}
                sx={{
                  height: 56,
                  minHeight: "56px !important",
                  ["& span"]: {
                    display: "none !important",
                  },
                  border: "1px solid #EBEAF2",
                  borderRadius: "100px",
                }}
                variant="scrollable"
              >
                {TABS.map((tab) => (
                  <Tab
                    key={tab.label}
                    {...tab}
                    label={tab.label}
                    sx={{
                      color: value === tab.value ? "#045EB8" : "#333333",
                      textTransform: "none",
                      background: value === tab.value ? "#D9F0FD" : "none",
                      width: 150,
                      ["&.MuiTab-root.Mui-selected"]: {
                        color: "#045EB8",
                      },
                      height: 56,
                      borderRadius: "100px",
                    }}
                  />
                ))}
              </TabList>
            )}
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent={"end"}
                spacing={1}
                flex={1}
                width="50%"
              >
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
                  <AvatarGroup
                    total={listUser?.length}
                    max={5}
                    spacing={"medium"}
                  >
                    {listUser?.map((item, index) => {
                      // eslint-disable-next-line react/jsx-key
                      return (
                        <Avatar
                          key={index}
                          src={""}
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

                <Stack gap={2} direction={"row"} mb={1}>
                  <Stack direction="row" alignItems="center">
                    <ButtonGradiant
                      onClick={() => setIsOpen(true)}
                      startIcon={<PlusIcon />}
                    >
                      Payment
                    </ButtonGradiant>
                  </Stack>
                </Stack>
                <PaymentModal
                  open={isOpen}
                  handleClose={handleCloseAddPayment}
                  title={"New Payment"}
                  // action={actionButton == "add" ? "add" : "write"}
                />

                {/* <DropdownTag
            placeholder={""}
            options={tagsOptions ?? []}
            name="Tag"
            onChange={(name, value) => {
              onChangeTag(value);
              setTagSelected(value);
            }}
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
          /> */}

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
                      billingT(
                        "detail.form.top.button.option.duplicateInvoice",
                      ) ? (
                        <Stack
                          gap={2}
                          direction={"row"}
                          alignItems={"center"}
                          // onClick={() => onDuplicate()}
                        >
                          <ContentCopyRounded />
                          <Text variant={"body2"}>
                            {billingT(
                              "detail.form.top.button.option.duplicateInvoice",
                            )}
                          </Text>
                        </Stack>
                      ) : option ===
                        billingT(
                          "detail.form.top.button.option.createCreditNote",
                        ) ? (
                        <Stack gap={2} direction={"row"} alignItems={"center"}>
                          <SubtitlesOutlined />
                          <Text variant={"body2"}>
                            {billingT(
                              "detail.form.top.button.option.createCreditNote",
                            )}
                          </Text>
                        </Stack>
                      ) : option ===
                        billingT(
                          "detail.form.top.button.option.deleteInvoice",
                        ) ? (
                        <Stack
                          gap={2}
                          direction={"row"}
                          alignItems={"center"}
                          color={"red"}
                          onClick={() => onDelete()}
                        >
                          <TrashIcon sx={{ fontSize: 25 }} />
                          <Text variant={"body2"} color={"red"}>
                            {billingT(
                              "detail.form.top.button.option.deleteInvoice",
                            )}
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
          {TABS.map((tab) => (
            <TabItem
              key={tab.label}
              {...tab}
              label={tab.label}
              editForm={editForm}
              item={item}
              user={user}
              arrBudgets={arrBudgets}
              form={formik}
              billToInfo={billToInfo}
              setBillToInfo={setBillToInfo}
              billFromInfo={billFromInfo}
              setBillFromInfo={setBillFromInfo}
              handleDisplayComment={handleDisplayComment}
              openComment={openComment}
            />
          ))}
          {/* <TabActions /> */}
        </TabContext>
      </Stack>
    </>
  );
};

export default memo(TabInfo);

const TabItem = (props: TabItemProps) => {
  const {
    label,
    value,
    editForm,
    item,
    user,
    arrBudgets,
    form,
    billToInfo,
    setBillToInfo,
    billFromInfo,
    setBillFromInfo,
    handleDisplayComment,
    openComment,
  } = props;

  const billingT = useTranslations(NS_BILLING);
  const { isDarkMode } = useTheme();

  // const pathname = usePathname();
  // const params = useParams();

  // const isActiveLink = useMemo(() => {
  //   const suffixPath = getSuffixPath(pathname);

  //   return suffixPath;
  // }, [pathname]);

  return (
    <TabPanel
      value={value}
      sx={{ padding: 0 }}

      // color={value ? "#212121" : "grey.300"}
      // sx={{ overflow: "scroll" }}
      // sx={{ overflow: "scroll", padding: "0px 12px" }}
    >
      {value === "Invoice" && (
        <TabInvoice
          title={label}
          editForm={editForm}
          item={item}
          user={user}
          arrBudgets={arrBudgets}
          form={form}
          billToInfo={billToInfo}
          setBillToInfo={setBillToInfo}
          billFromInfo={billFromInfo}
          setBillFromInfo={setBillFromInfo}
        />
      )}
      <TabFeed
        title={label}
        bill={{}}
        user={user}
        handleDisplayComment={handleDisplayComment}
        openComment={openComment}
      />
      {value === "Payment" && <TabPayment title={label} />}
      {value === "Client" && <TabClient />}
    </TabPanel>
  );
};
