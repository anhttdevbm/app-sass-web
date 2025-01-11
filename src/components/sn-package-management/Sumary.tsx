"use client";

import { useMediaQuery } from "@mui/material";
import Box from "@mui/material/Box";
import Avatar from "components/Avatar";
import { NewButton, Switch, Text } from "components/shared";
import ConfirmToRequest from "components/sn-employee-detail/components/ConfirmToRequest";
import { Permission } from "constant/enums";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useRouter } from "next/navigation";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth, useSnackbar } from "store/app/selectors";
import { AppDispatch, RootState } from "store/configureStore";
import {
  changeAutoRenewal,
  getAccountBillOwner,
  getRequestUpgradePayment,
} from "store/payment/actions";
import ButtonCustom from "./components/Button";
import Change from "./modals/Change";
import Confirm from "./modals/Confirm";
import ModalUpgradePackage from "./modals/index";

type AccountBillOwnerType = {
  email: string;
  username: string;
  fullName: string;
  avatar: string;
};
const Sumary = () => {
  const { user } = useAuth();
  const router = useRouter();
  const roleUser = user?.roles;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery("(max-width:600px)");
  const { onAddSnackbar } = useSnackbar();

  const { total } = useSelector((state: RootState) => state.payment.accounts);
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalUpgradePackage, setOpenUpgradePackage] =
    useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalChange, setOpenModalChange] = useState<boolean>(false);
  const [accountBillOwner, setAccountBillOwner] =
    useState<AccountBillOwnerType>();
  const [unupgradedAccount, setUnupgradedAccount] = useState<boolean>(false);
  const onClickUpgradePackage = (status: boolean) => {
    if (!isMobile) {
      setOpenUpgradePackage(true);
    } else {
      router.push(
        `/package-management/mobile/upgrade-package?unupgradedAccount=${unupgradedAccount}&totalAccount=${total}`,
      );
    }
    setUnupgradedAccount(status);
  };

  useEffect(() => {
    if (user?.auto_renewal) setChecked(user.auto_renewal);
    if (roleUser && roleUser.includes(Permission.BO)) {
      const resultAction = dispatch(getAccountBillOwner());
      resultAction
        .then((action) => {
          if (action.payload) {
            setAccountBillOwner(action.payload);
          }
        })
        .catch((error) => {
          console.error("Error fetching account bill owner:", error);
        });
    }
  }, [user]);

  const onChangeCheckPackage = async () => {
    try {
      if (user?.email)
        await dispatch(
          changeAutoRenewal({ email: user?.email, auto_renewal: !checked }),
        );
      setChecked(!checked);
      setOpenModal(false);
    } catch (error) {
      console.error("Failed to change auto-renewal:", error);
    }
  };

  const onClickChange = () => {
    setOpenModalChange(true);
  };
  const isGmail = (email) => {
    const gmailPattern = /^[^\s@]+@gmail\.com$/;
    return gmailPattern.test(email);
  };

  //handle function check date expiration <= 3 days
  const isExpirationDate = () => {
    if (user?.expiration_date && new Date(user.expiration_date).getTime() - new Date().getTime() <= 3 * 24 * 60 * 60 * 1000) {
      return true;
    }
    return false;
  }
  const onSubmitConfirmToRequest = async () => {
    try {
      const result = await dispatch(getRequestUpgradePayment());
      // handle result log
      if (result ) {
        onAddSnackbar(packageT("notification.upgradeRequestSuccessful"), "success");
      }

      setOpenModalConfirm(false);
    } catch (error) {
      onAddSnackbar("Request Error", "error");
      setOpenModalConfirm(false);
    }
  };
  return (
    <>
      <Text
        sx={{
          fontSize: "25px",
          fontWeight: 600,
          marginBottom: "32px",
        }}
      >
        {packageT("head.sumary")}
      </Text>

      {(user?.roles.includes(Permission.AM) && !user?.roles.includes(Permission.BO)) ? (
        <Box
          sx={{
            display: "flex",
          }}
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
        >
          {/* Admin */}
          {/* CURRENT PACKAGE */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
            padding={{
              xs: "12px 0 30px 0",
              sm: "0 63px 0 0",
            }}
            borderRight={{
              sm: "1px solid #EFEFEF",
            }}
            borderBottom={{
              xs: "1px solid #EFEFEF",
              sm: "none",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "row", sm: "column" },
                justifyContent: "space-between",
                alignItems: { xs: "center", sm: "flex-start" },
                gap: "16px",
              }}
            >
              <Text
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {packageT("title.currentPackage")}
              </Text>
              <Box
                sx={{
                  padding: "7px",
                  borderRadius: "100px",
                  background: "#F3F1F1",
                  textAlign: "center",
                  width: 118,
                }}
              >
                <Text>{user?.packageName ?? ""}</Text>
              </Box>
            </Box>
            {(isExpirationDate()) ? (
              <ButtonCustom
                buttonDefault
                onClick={() => setOpenModalConfirm(true)}
                text={packageT("button.requestUpgrade")}
            />
            ) : (
              <ButtonCustom
                buttonDefault
                disabled
                text={packageT("button.requestUpgrade")}
              />
            )}
            
          </Box>
          {/* EXPIRATION DATE */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "23px",
            }}
            padding={{
              xs: "12px 0 30px 0",
              sm: "0 63px",
            }}
          >
            <Text
              sx={{
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {packageT("title.expirationDate")}
            </Text>
            <Text color="#999999">
              {dayjs(user?.expiration_date).format("D MMMM, YYYY HH:mm") ?? ""}
            </Text>
          </Box>
          <ConfirmToRequest
            open={openModalConfirm}
            title={packageT("popup.title")}
            question={packageT("popup.subtitle")}
            onClose={() => setOpenModalConfirm(false)}
            onSubmit={onSubmitConfirmToRequest}
          />
        </Box>
      ) : user?.roles.includes(Permission.ST)
        || user?.roles.includes(Permission.MN)
        || user?.roles.includes(Permission.LE)
        || user?.roles.includes(Permission.CL)
        || user?.roles.includes(Permission.CT)
        && user?.email || isGmail(user?.email) ? (
        <Box>
          {/* Email cá nhân  & nhân viên*/}
          <Box
            sx={{
              display: "flex",
            }}
            flexDirection={{
              xs: "column",
              sm: "row",
            }}
          >
            {/* CURRENT PACKAGE */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
              padding={{
                xs: "12px 0 30px 0",
                sm: "0 63px 0 0",
              }}
              borderRight={{
                sm: "1px solid #EFEFEF",
              }}
              borderBottom={{
                xs: "1px solid #EFEFEF",
                sm: "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  justifyContent: "space-between",
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: "16px",
                }}
              >
                <Text
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {packageT("title.currentPackage")}
                </Text>
                <Box
                  sx={{
                    padding: "7px",
                    borderRadius: "100px",
                    background: "#F3F1F1",
                    textAlign: "center",
                    width: 118,
                  }}
                >
                  <Text>{user?.packageName}</Text>
                </Box>
              </Box>
              <ButtonCustom
                onClick={() => onClickUpgradePackage(false)}
                text={packageT("button.upgradePackage")}
              />
            </Box>
            {/* EXPIRATION DATE */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "23px",
              }}
              padding={{
                xs: "12px 0 30px 0",
                sm: "0 63px",
              }}
              borderRight={{
                sm: "1px solid #EFEFEF",
              }}
              borderBottom={{
                xs: "1px solid #EFEFEF",
                sm: "none",
              }}
            >
              <Text
                sx={{
                  fontSize: "13px",
                  fontWeight: 700,
                }}
              >
                {packageT("title.expirationDate")}
              </Text>
              <Text color="#999999">
                {dayjs(user?.expiration_date).format("D MMMM, YYYY HH:mm")}
              </Text>

              <ButtonCustom
                onClick={() => onClickUpgradePackage(false)}
                text={packageT("button.upgradePackage")}
              />

            </Box>
            {/* AUTO-RENEWAL */}
            {!isMobile ? (
              <Box
                sx={{
                  padding: "0 63px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <Text
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {packageT("title.autoRenewal")}
                </Text>
                <Text color="#999999">Annual</Text>
                <Switch onChange={() => setOpenModal(true)} checked={checked} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
                padding={{
                  xs: "12px 0 30px 0",
                  sm: "0 63px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    justifyContent: "space-between",
                    alignItems: { xs: "center", sm: "flex-start" },
                    gap: "24px",
                  }}
                >
                  <Text
                    sx={{
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {packageT("title.autoRenewal")}
                  </Text>
                  <Switch
                    onChange={() => setOpenModal(true)}
                    checked={checked}
                  />
                </Box>
                <Text color="#999999">Annual</Text>
              </Box>
            )}
          </Box>
          {!isMobile && (
            <ModalUpgradePackage
              open={openModalUpgradePackage}
              onClose={() => {
                setOpenUpgradePackage(false);
                setUnupgradedAccount(false);
              }}
              unupgradedAccount={unupgradedAccount}
              totalAccount={total}
            />
          )}

          <Confirm
            title={packageT("button.confirm")}
            open={openModal}
            onSubmit={onChangeCheckPackage}
            onCancel={() => setOpenModal(false)}
            buttonAlignment="center"
          >
            <Text fontWeight="400" textAlign={"center"} color="#999999">
              Are you sure to turn {checked ? "off" : "on"} Auto- renewal?
            </Text>
          </Confirm>
          <Change
            open={openModalChange}
            onClose={() => setOpenModalChange(false)}
          />
        </Box>
      ) : (
        <Box>
          {/* Billing Owner */}
          <Box
            sx={{
              display: "flex",
            }}
            flexDirection={{
              xs: "column",
              sm: "row",
            }}
          >
            {/* CURRENT PACKAGE */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
              padding={{
                xs: "12px 0 30px 0",
                sm: "0 63px 0 0",
              }}
              borderRight={{
                sm: "1px solid #EFEFEF",
              }}
              borderBottom={{
                xs: "1px solid #EFEFEF",
                sm: "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  justifyContent: "space-between",
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: "16px",
                }}
              >
                <Text
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {packageT("title.currentPackage")}
                </Text>
                <Box
                  sx={{
                    padding: "7px",
                    borderRadius: "100px",
                    background: "#F3F1F1",
                    textAlign: "center",
                    width: 118,
                  }}
                >
                  <Text>{user?.packageName ?? ""}</Text>
                </Box>
              </Box>
              <ButtonCustom
                onClick={() => onClickUpgradePackage(false)}
                text={packageT("button.upgradePackage")}
              />
            </Box>
            {/* UNUPGRADED ACCOUNT */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "23px",
              }}
              padding={{
                xs: "12px 0 30px 0",
                sm: "0 63px",
              }}
              borderRight={{
                sm: "1px solid #EFEFEF",
              }}
              borderBottom={{
                xs: "1px solid #EFEFEF",
                sm: "none",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "row", sm: "column" },
                  justifyContent: "space-between",
                  alignItems: { xs: "center", sm: "flex-start" },
                  gap: "23px",
                }}
              >
                <Text
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {packageT("title.unupgradedAccount")}
                </Text>
                <Text color="#999999">{total ?? 0}</Text>
              </Box>
              <ButtonCustom
                onClick={() => onClickUpgradePackage(true)}
                text={packageT("button.upgradePackage")}
              />
            </Box>
            {/* BILLING OWNER */}
            {!isMobile ? (
              <Box
                sx={{
                  padding: "0 63px",
                  borderRight: "1px solid #EFEFEF",
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Text
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {packageT("title.billingOwner")}
                </Text>
                <Box display="flex" gap={2}>
                  <Avatar 
                    alt={accountBillOwner?.fullName}
                    src={accountBillOwner?.avatar ?? UserPlaceholderImage}
                    size={32} 
                    />
                  {accountBillOwner?.fullName} ({accountBillOwner?.email}){" "}
                </Box>
                <ButtonCustom
                  onClick={onClickChange}
                  text={packageT("button.change")}
                  width={115}
                />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
                padding={{
                  xs: "12px 0 30px 0",
                  sm: "0 63px",
                }}
                borderRight={{
                  sm: "1px solid #EFEFEF",
                }}
                borderBottom={{
                  xs: "1px solid #EFEFEF",
                  sm: "none",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    justifyContent: "space-between",
                    alignItems: { xs: "center", sm: "flex-start" },
                    gap: "16px",
                  }}
                >
                  <Text
                    sx={{
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {packageT("title.billingOwner")}
                  </Text>
                  <ButtonCustom
                    onClick={onClickChange}
                    text={packageT("button.change")}
                    width={115}
                  />
                </Box>
                <Box display="flex" gap={2}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" size={0} />
                  {accountBillOwner?.username} ({accountBillOwner?.email}){" "}
                </Box>
              </Box>
            )
            }
            {/* AUTO-RENEWAL */}
            {!isMobile ? (
              <Box
                sx={{
                  padding: "0 63px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
              >
                <Text
                  sx={{
                    fontSize: "13px",
                    fontWeight: 700,
                  }}
                >
                  {packageT("title.autoRenewal")}
                </Text>
                <Text color="#999999">Annual</Text>
                <Switch onChange={() => setOpenModal(true)} checked={checked} />
              </Box>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                }}
                padding={{
                  xs: "12px 0 30px 0",
                  sm: "0 63px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", sm: "column" },
                    justifyContent: "space-between",
                    alignItems: { xs: "center", sm: "flex-start" },
                    gap: "24px",
                  }}
                >
                  <Text
                    sx={{
                      fontSize: "13px",
                      fontWeight: 700,
                    }}
                  >
                    {packageT("title.autoRenewal")}
                  </Text>
                  <Switch
                    onChange={() => setOpenModal(true)}
                    checked={checked}
                  />
                </Box>
                <Text color="#999999">Annual</Text>
              </Box>
            )}
          </Box>
          {!isMobile && (
            <ModalUpgradePackage
              open={openModalUpgradePackage}
              onClose={() => {
                setOpenUpgradePackage(false);
                setUnupgradedAccount(false);
              }}
              unupgradedAccount={unupgradedAccount}
              totalAccount={total}
            />
          )}
          <Confirm
            title={packageT("button.confirm")}
            open={openModal}
            onSubmit={onChangeCheckPackage}
            onCancel={() => setOpenModal(false)}
            buttonAlignment="center"
          >
            <Text fontWeight="400" textAlign={"center"} color="#999999">
              Are you sure to turn {checked ? "off" : "on"} Auto- renewal?
            </Text>
          </Confirm>
          <Change
            open={openModalChange}
            onClose={() => setOpenModalChange(false)}
          />
        </Box>
      )}
    </>
  );
};

export default memo(Sumary);
