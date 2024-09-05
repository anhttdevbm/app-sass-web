"use client";

import { memo, useState } from "react";
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

const Title = styled.span`
  font-size: 25px;
  font-weight: 600;
`;

const Sumary = () => {
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  const [openModalUpgradePackage, setOpenUpgradePackage] =
    useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openModalChange, setOpenModalChange] = useState<boolean>(false);
  const onClickUpgradePackage = () => {
    setOpenUpgradePackage(true);
  };
  const onChangeCheckPackage = () => {
    setChecked(!checked);
    setOpenModal(false);
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
            <Text>Standard</Text>
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
    </>
  );
};

export default memo(Sumary);
