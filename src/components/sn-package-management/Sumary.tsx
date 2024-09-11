"use client";

import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import ButtonCustom from "./components/Button";
import { Switch, Text } from "components/shared";
import Box from "@mui/material/Box";
import ModalUpgradePackage from "./modals/index";
import Confirm from "./modals/Confirm";
import Change from "./modals/Change";
import { Avatar, useMediaQuery } from "@mui/material";
import { useTranslations } from "next-intl";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useDispatch } from "react-redux";
import { changeAutoRenewal } from "store/payment/actions";
import { AppDispatch } from "store/configureStore";
import { useAuth } from "store/app/selectors";
import { Permission } from "constant/enums";
import ConfirmToRequest from "components/sn-employee-detail/components/ConfirmToRequest";
import { useRouter } from "next/navigation";

const Sumary = () => {
  const { user } = useAuth();
  const router = useRouter();
  const roleUser = user?.roles;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useMediaQuery("(max-width:600px)");

  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalUpgradePackage, setOpenUpgradePackage] =
    useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalChange, setOpenModalChange] = useState<boolean>(false);
  const onClickUpgradePackage = () => {
    if (!isMobile) {
      setOpenUpgradePackage(true);
    } else {
      router.push("/package-management/mobile/upgrade-package");
    }
  };

  useEffect(() => {
    if (user?.auto_renewal) setChecked(user.auto_renewal);
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
      {(roleUser && roleUser.includes(Permission.SA)) ||
      roleUser?.includes(Permission.BO) ? (
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
            <ButtonCustom
              buttonDefault
              onClick={() => setOpenModalConfirm(true)}
              text={packageT("button.requestUpgrade")}
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
          >
            <Text
              sx={{
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              {packageT("title.expirationDate")}
            </Text>
            <Text color="#999999">29 July, 2024 20 00</Text>
          </Box>
          <ConfirmToRequest
            open={openModalConfirm}
            title="Confirm to Request Upgrade"
            question="Are you sure to request upgrade?"
            onClose={() => setOpenModalConfirm(false)}
          />
        </Box>
      ) : user && user?.email && isGmail(user.email) ? (
        <Box>
          {/* Email cá nhân */}
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
                onClick={onClickUpgradePackage}
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
              <Text color="#999999">16 Jul 20:00</Text>
              <ButtonCustom
                onClick={onClickUpgradePackage}
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
              }}
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
                onClick={onClickUpgradePackage}
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
                <Text color="#999999">3</Text>
              </Box>
              <ButtonCustom
                onClick={onClickUpgradePackage}
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
                <Box display="flex" gap={2}>
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  Nguyễn Văn A (phamvana@taskcover.com){" "}
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
                  <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                  Nguyễn Văn A (phamvana@taskcover.com){" "}
                </Box>
              </Box>
            )}
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
              }}
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
