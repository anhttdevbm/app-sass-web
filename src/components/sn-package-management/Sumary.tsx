"use client";

import { memo, useEffect, useState } from "react";
import styled from "styled-components";
import ButtonCustom from "./components/Button";
import { Switch, Text } from "components/shared";
import Box from "@mui/material/Box";
import ModalUpgradePackage from "./modals/index";
import Confirm from "./modals/Confirm";
import Change from "./modals/Change";
import { Avatar } from "@mui/material";
import { useTranslations } from "next-intl";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useDispatch } from "react-redux";
import { changeAutoRenewal } from "store/payment/actions";
import { AppDispatch } from "store/configureStore";
import { useAuth } from "store/app/selectors";
import { Permission } from "constant/enums";
import ConfirmToRequest from "components/sn-employee-detail/components/ConfirmToRequest";

const Sumary = () => {
  const { user } = useAuth();
  const roleUser = user?.roles;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();
  const [openModalConfirm, setOpenModalConfirm] = useState(false);
  const [openModalUpgradePackage, setOpenUpgradePackage] =
    useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalChange, setOpenModalChange] = useState<boolean>(false);
  const onClickUpgradePackage = () => {
    setOpenUpgradePackage(true);
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
      {/* Billing Owner */}
      {/* {roleUser && roleUser?.includes(Permission.BO) && ( */}
      <Box>
        <Box
          sx={{
            display: "flex",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              paddingRight: "63px",
              borderRight: "1px solid #EFEFEF",
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
            <ButtonCustom
              onClick={onClickUpgradePackage}
              text={packageT("button.upgradePackage")}
            />
          </Box>
          <Box
            sx={{
              padding: "0 63px",
              borderRight: "1px solid #EFEFEF",
              display: "flex",
              flexDirection: "column",
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
            <ButtonCustom
              onClick={onClickUpgradePackage}
              text={packageT("button.upgradePackage")}
            />
          </Box>
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
        </Box>
        <ModalUpgradePackage
          open={openModalUpgradePackage}
          onClose={() => {
            setOpenUpgradePackage(false);
          }}
        />
        <Confirm
          title={packageT("button.confirm")}
          open={openModal}
          onSubmit={onChangeCheckPackage}
          onCancel={() => setOpenModal(false)}
          buttonAlignment="center"
        >
          <Text fontWeight="400" textAlign={"center"}>
            Are you sure to turn {checked ? "off" : "on"} Auto- renewal?
          </Text>
        </Confirm>
        <Change
          open={openModalChange}
          onClose={() => setOpenModalChange(false)}
        />
      </Box>
      {/* )} */}
      {/* Admin */}
      {/* {(roleUser && roleUser?.includes(Permission.SA)) ||
        (roleUser?.includes(Permission.AM) && (
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingRight: "63px",
                borderRight: "1px solid #EFEFEF",
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
              <ButtonCustom
                buttonDefault
                onClick={() => setOpenModalConfirm(true)}
                text={packageT("button.requestUpgrade")}
              />
            </Box>
            <Box
              sx={{
                padding: "0 63px",
                display: "flex",
                flexDirection: "column",
                gap: "23px",
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
        ))} */}
      {/* Email cá nhân */}
      {roleUser && roleUser?.includes(Permission.CL) && (
        <Box>
          <Box
            sx={{
              display: "flex",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                paddingRight: "63px",
                borderRight: "1px solid #EFEFEF",
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
              <ButtonCustom
                onClick={onClickUpgradePackage}
                text={packageT("button.upgradePackage")}
              />
            </Box>
            <Box
              sx={{
                padding: "0 63px",
                borderRight: "1px solid #EFEFEF",
                display: "flex",
                flexDirection: "column",
                gap: "23px",
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
          </Box>
          <ModalUpgradePackage
            open={openModalUpgradePackage}
            onClose={() => {
              setOpenUpgradePackage(false);
            }}
          />
          <Confirm
            title={packageT("button.confirm")}
            open={openModal}
            onSubmit={onChangeCheckPackage}
            onCancel={() => setOpenModal(false)}
            buttonAlignment="center"
          >
            <Text fontWeight="400" textAlign={"center"}>
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
