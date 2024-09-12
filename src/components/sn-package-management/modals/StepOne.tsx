"use client";

import { memo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import { IconButton, Text } from "components/shared";
import CheckIcon from "icons/CheckIcon";
import ButtonCustom from "../components/Button";
import CloseIcon from "icons/CloseIcon";
import { NS_PACKAGE_MANAGERMENT } from "constant/index";
import { useTranslations } from "next-intl";
import { DataStepOne } from ".";

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
  onClose: () => void;
  setDataStepOne: React.Dispatch<React.SetStateAction<DataStepOne>>;
};

const StepOne = (props: Props) => {
  const { setStep, onClose, setDataStepOne } = props;
  const packageT = useTranslations(NS_PACKAGE_MANAGERMENT);

  const handleClose = () => {
    onClose();
    setStep(0);
  };
  const list = [
    "General",
    "Billing",
    "Document 15GB",
    "Sale & Budgeting",
    "Task & Projects",
    "Optimized hashtags",
    "Standard using AI in writing script",
  ];

  const handleClickUprade = (value: string) => {
    setDataStepOne({
      newPackage: value,
      billingPlan: "monthly",
      numberOfUser: 0,
    });
    setStep((prevStep) => prevStep + 1);
  };
  return (
    <>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "1401px",
          bgcolor: "background.paper",
          borderRadius: "24px",
          background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
        }}
      >
        <Box
          bgcolor={"#fff"}
          borderRadius={"24px"}
          width="87%"
          display="flex"
          margin="146px auto 69px auto"
          padding="54px 50px"
          justifyContent="space-between"
          gap="60px"
        >
          <Box width="30%">
            <Box padding="20px">
              <Button
                sx={{
                  boxShadow: "none",
                  fontWeight: "700",
                  background: "#DDF7FE",
                  "&:hover": {
                    background: "#DDF7FE",
                  },
                  borderRadius: "100px",
                  height: 34,
                  width: 104,
                  color: "#0575E6",
                  textTransform: "none",
                  border: "1px solid  #1ACDFE ",
                  paddingBottom: "9px",
                }}
              >
                #bestdeal
              </Button>
              <Text
                sx={{
                  fontWeight: "700",
                  fontSize: "24px",
                  paddingBottom: "9px",
                }}
              >
                {packageT("title.standard")}
              </Text>
              <Text
                sx={{
                  fontWeight: "400",
                  fontSize: "16px",
                  color: "#5C98F6",
                  paddingBottom: "9px",
                }}
              >
                {packageT("description.saveOfMonth", { value: "2" })}
              </Text>
              <Text
                sx={{
                  fontWeight: "400",
                  fontSize: "16px",
                  paddingBottom: "9px",
                }}
              >
                {packageT("description.everyThing")}
              </Text>
              <Box
                sx={{
                  display: "flex",
                  paddingBottom: "9px",
                }}
              >
                <Text>$</Text>
                <Text
                  sx={{
                    fontWeight: "700",
                    fontSize: "48px",
                  }}
                >
                  11
                </Text>
                <Text
                  sx={{
                    fontWeight: "400",
                    fontSize: "16px",
                    color: "#5C98F6",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "7px",
                  }}
                >
                  Per user/monthly
                </Text>
              </Box>
            </Box>
            <Box padding="20px">
              {list?.map((item) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    <CheckIcon style={{ color: "#11C77F", fontSize: "16px" }} />
                    <Text>{item}</Text>
                  </Box>
                </>
              ))}
            </Box>
            <Box padding="20px" textAlign="center">
              <ButtonCustom
                buttonDefault
                text={packageT("button.buyNow")}
                height={56}
                width={169}
                onClick={() => handleClickUprade("Standard")}
              />
            </Box>
          </Box>
          <Box position={"absolute"} left={"calc(30% + 110px)"} top={100}>
            <Box
              marginBottom="20px"
              padding="20px"
              sx={{
                background: "linear-gradient(90deg, #2AF598 0%, #009EFD 100%)",
                borderRadius: "24px",
              }}
            >
              <Button
                sx={{
                  boxShadow: "none",
                  fontWeight: "700",
                  background: "#DDF7FE",
                  "&:hover": {
                    background: "#DDF7FE",
                  },
                  borderRadius: "100px",
                  height: 34,
                  width: 185,
                  color: "#0575E6",
                  textTransform: "none",
                  border: "1px solid  #1ACDFE ",
                  paddingBottom: "9px",
                }}
              >
                #highlyrecommended
              </Button>
              <Text
                sx={{
                  fontWeight: "700",
                  fontSize: "24px",
                  color: "#fff",
                  paddingBottom: "9px",
                }}
              >
                {packageT("title.bussiness")}
              </Text>
              <Text
                sx={{
                  fontWeight: "400",
                  fontSize: "16px",
                  color: "#fff",
                  paddingBottom: "9px",
                }}
              >
                {packageT("description.saveOfMonth", { value: "4" })}
              </Text>
              <Text
                sx={{
                  fontWeight: "400",
                  fontSize: "16px",
                  color: "#fff",
                  paddingBottom: "9px",
                }}
              >
                {packageT("description.everyThing")}
              </Text>
              <Box
                sx={{
                  display: "flex",
                  paddingBottom: "9px",
                }}
              >
                <Text
                  sx={{
                    color: "#fff",
                  }}
                >
                  $
                </Text>
                <Text
                  sx={{
                    fontWeight: "700",
                    fontSize: "48px",
                    color: "#fff",
                  }}
                >
                  23
                </Text>
                <Text
                  sx={{
                    fontWeight: "400",
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    color: "#fff",
                    marginLeft: "7px",
                  }}
                >
                  Per user/monthly
                </Text>
              </Box>
            </Box>
            <Box padding="20px">
              {list?.map((item) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    <CheckIcon style={{ color: "#11C77F", fontSize: "16px" }} />
                    <Text>{item}</Text>
                  </Box>
                </>
              ))}
            </Box>
            <Box padding="20px" textAlign="center">
              <ButtonCustom
                text={packageT("button.upgradeNow")}
                height={56}
                width={169}
                onClick={() => handleClickUprade("Business")}
              />
            </Box>
          </Box>
          <Box width="30%">
            <Box padding="20px">
              <Button
                sx={{
                  boxShadow: "none",
                  fontWeight: "700",
                  background: "#DDF7FE",
                  "&:hover": {
                    background: "#DDF7FE",
                  },
                  borderRadius: "100px",
                  height: 34,
                  width: 104,
                  color: "#0575E6",
                  textTransform: "none",
                  border: "1px solid  #1ACDFE ",
                  paddingBottom: "9px",
                }}
              >
                #valuable
              </Button>
              <Text
                sx={{
                  fontWeight: "700",
                  fontSize: "24px",
                  paddingBottom: "9px",
                }}
              >
                {packageT("title.enterPise")}
              </Text>
              <Text
                sx={{
                  fontWeight: "400",
                  fontSize: "16px",
                  color: "#5C98F6",
                  paddingBottom: "9px",
                }}
              >
                {packageT("description.saveOfMonth", { value: "6" })}
              </Text>
              <Text
                sx={{
                  fontWeight: "400",
                  fontSize: "16px",
                  paddingBottom: "9px",
                }}
              >
                {packageT("description.everyThing")}
              </Text>
              <Box
                sx={{
                  display: "flex",
                  paddingBottom: "9px",
                }}
              >
                <Text>$</Text>
                <Text
                  sx={{
                    fontWeight: "700",
                    fontSize: "48px",
                  }}
                >
                  35
                </Text>
                <Text
                  sx={{
                    fontWeight: "400",
                    fontSize: "16px",
                    color: "#5C98F6",
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "7px",
                  }}
                >
                  Per user/monthly
                </Text>
              </Box>
            </Box>

            <Box padding="20px">
              {list?.map((item) => (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      marginBottom: "8px",
                    }}
                  >
                    <CheckIcon style={{ color: "#11C77F", fontSize: "16px" }} />
                    <Text>{item}</Text>
                  </Box>
                </>
              ))}
            </Box>
            <Box padding="20px" textAlign="center">
              <ButtonCustom
                buttonDefault
                text={packageT("button.upgradeNow")}
                height={56}
                width={169}
                onClick={() => handleClickUprade("Enterprise")}
              />
            </Box>
          </Box>
        </Box>
        <IconButton
          onClick={handleClose}
          sx={{ position: "absolute", top: 50, right: 73 }}
        >
          <CloseIcon sx={{ fontSize: "24px" }} />
        </IconButton>
      </Paper>
    </>
  );
};

export default memo(StepOne);
