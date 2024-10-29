"use client";

import { memo, ReactNode, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  Paper,
  IconButton,
  Avatar,
} from "@mui/material";
import CloseIcon from "icons/CloseIcon";
import ButtonCustom from "../components/Button";
import SearchPackageManagement from "../components/Search";
import { Text } from "components/shared";
import { useTranslations } from "next-intl";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { changeBillOwner, getAllAccountAdmin } from "store/payment/actions";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "store/configureStore";
import UserPlaceholderImage from "public/images/img-user-placeholder.webp";
import { useSelector } from "react-redux";
import Image from "next/image";
import { getProfile } from "store/app/actions";

type Props = {
  open: boolean;
  onClose: () => void;
};

type account = {
  email?: string;
  fullName?: string;
  roles?: string;
  avatar: {
    link: string;
    name: string;
    object: string;
  };
};

const Change = (props: Props) => {
  const { open, onClose } = props;

  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);
  const dispatch = useDispatch<AppDispatch>();
  const { data: listAccount } = useSelector(
    (state: RootState) => state.payment.listAccountAdmin,
  );
  const [query, setQuery] = useState();

  const [step, setStep] = useState<number>(0);
  const [accountChange, setAccountChange] = useState<account>();
  const onSubmit = async () => {
    if (step === 1) {
      setStep((prevStep) => prevStep + 1);
    } else {
      const payload = {
        email: accountChange?.email ?? "",
      };
      const resultAction = await dispatch(changeBillOwner(payload));
      handleClose();
      dispatch(getProfile());

      if (changeBillOwner.fulfilled.match(resultAction)) {
        handleClose();
      } else {
        console.error("Error");
      }
    }
  };
  useEffect(() => {
    dispatch(
      getAllAccountAdmin({
        searchKey: query,
      }),
    );
  }, [open, query]);
  const handleClose = () => {
    onClose();
    setStep(0);
  };

  const onClickChangeAccount = (account) => {
    setAccountChange(account);
    setStep((prevStep) => prevStep + 1);
  };

  const handleSearch = (value) => {
    setQuery(value.toString());
  };

  return (
    <Modal
      open={open}
      // onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 3,
          maxHeight: "500px",
        }}
        width={{
          xs: 342,
          sm: 774,
        }}
        padding={{
          xs: "55px 24px",
          sm: "33px 100px 58px 100px",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {step === 2 ? (
            <Text
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                textAlign: "center",
                flexGrow: 1,
              }}
            >
              {packageT("title.confirmToChange")}
            </Text>
          ) : (
            <Text
              id="modal-title"
              variant="h6"
              sx={{
                fontSize: "20px",
                fontWeight: 600,
                flexGrow: 1,
              }}
              textAlign={{ xs: "center", sm: "left" }}
            >
              {packageT("title.chooseBillingOwner")}
            </Text>
          )}
        </Box>
        <Box
          sx={{ position: "absolute" }}
          top={{ xs: "17px", sm: "35px" }}
          right={{ xs: "20px", sm: "60px" }}
        >
          <IconButton onClick={handleClose}>
            <CloseIcon sx={{ fontSize: "24px" }} />
          </IconButton>
        </Box>
        {step === 0 ? (
          <Box>
            <Box marginTop="20px">
              <Text color="#999999" textAlign={{ xs: "center", sm: "left" }}>
                {packageT("description.onlyAdmin")}
              </Text>
              <SearchPackageManagement width="100%" onSearch={handleSearch} />
              <Box overflow="auto" height="222px">
                {listAccount?.map((item) => (
                  <>
                    <Box
                      onClick={() => onClickChangeAccount(item)}
                      display="flex"
                      gap={2}
                      marginTop="15px"
                      sx={{
                        cursor: "pointer",
                      }}
                    >
                      <Image
                        alt={item?.avatar?.name || "Default alt text"}
                        src={item?.avatar ?? UserPlaceholderImage}
                        width={32}
                        height={32}
                        layout="fixed"
                      />
                      <Box>
                        {item?.fullname ?? ""} ({item?.email ?? ""}) <br />{" "}
                        {item?.roles ?? ""}
                      </Box>
                    </Box>
                  </>
                ))}
              </Box>
            </Box>
          </Box>
        ) : step === 1 ? (
          <Box
            marginTop="20px"
            display="flex"
            gap={2}
            border="1px solid #EFEFEF"
            borderRadius="100px"
            padding="14px "
            sx={{
              background:
                "linear-gradient(122.36deg, rgba(249, 241, 241, 0.41) -10.79%, #D8E4E4 222.02%)",
            }}
          >
            {accountChange && (
              <>
                <Image
                  alt={accountChange?.avatar?.name || "Default alt text"}
                  src={accountChange?.avatar ?? UserPlaceholderImage}
                  width={32}
                  height={32}
                  layout="fixed"
                />
                {accountChange?.fullName || ""} ({accountChange?.email || ""}){" "}
              </>
            )}
          </Box>
        ) : (
          <Box marginTop="20px" textAlign={"center"}>
            <Text fontWeight={400} marginBottom="20px">
              {packageT("description.confirm")}
            </Text>
            <Text color="#999999">{packageT("description.byAssigning")}</Text>
          </Box>
        )}
        {step !== 0 && (
          <Box
            display="flex"
            justifyContent={step === 2 ? "center" : "flex-end"}
            mt={5}
            gap={"10px"}
          >
            <ButtonCustom
              buttonDefault
              onClick={handleClose}
              text={packageT("button.cancel")}
              width={168}
              height={40}
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            />
            <ButtonCustom
              onClick={onSubmit}
              text={packageT("button.confirm")}
              width={{ xs: 292, sm: 168 }}
              height={40}
            />
          </Box>
        )}
      </Box>
    </Modal>
  );
};

export default memo(Change);
