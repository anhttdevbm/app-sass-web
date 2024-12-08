/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import { People, Public } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Chip,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Endpoint, client } from "api";
import Avatar from "components/Avatar";
import FormLayout from "components/FormLayout";
import { Button } from "components/shared";
import { inter } from "components/sn-time-tracking/CalendarTracking/CalendarTracking.styles";
import { DocAccessibility } from "constant/enums";
import { DOCS_API_URL, NS_DOCS } from "constant/index";
import { useFormik } from "formik";
import useQueryParams from "hooks/useQueryParams";
import CloseIcon from "icons/CloseIcon";
import LockIcon from "icons/LockIcon";
import { useTranslations } from "next-intl";
import React, { SetStateAction, useEffect, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { useEmployees } from "store/company/selectors";
import { useDocs } from "store/docs/selectors";
import { useAppSelector } from "store/hooks";

interface ModalShareProps {
  setOpenShare: React.Dispatch<SetStateAction<boolean>>;
  openShare: boolean;
}

enum DocAccessibilityEnum {
  FULL_ACCESS = "Full access",
  VIE = "Can view",
  EDIT = "Can edit",
  COMMENT = "Can comment",
}

interface InitDataProps {
  type: "private" | "public" | "people";
  perm: DocAccessibilityEnum;
}

enum GeneralAccess {
  PUBLIC = "public",
  PEOPLE = "people",
  PRIVATE = "private",
}

const generalAccessOpts = [
  {
    icon: <Public />,
    title: "Public",
    desc: "Any one can access",
    code: GeneralAccess.PUBLIC,
  },
  {
    icon: <People />,
    title: "Only project members",
    desc: "Only people in the project can access",
    code: GeneralAccess.PEOPLE,
  },
  {
    icon: <LockIcon />,
    title: "Private",
    desc: "Only people with access",
    code: GeneralAccess.PRIVATE,
  },
];

const init: InitDataProps = {
  perm: DocAccessibilityEnum.FULL_ACCESS,
  type: "private",
};

const ModalShare = ({ openShare, setOpenShare }: ModalShareProps) => {
  const { user: me } = useAuth();
  const { items, onGetEmployees } = useEmployees();
  const { initQuery, isReady } = useQueryParams();
  const { id, docInfo } = useAppSelector((data) => data.doc);
  const [generalSelectedOpt, setGeneralSelectedOpt] = useState<GeneralAccess>(
    docInfo?.isPublic ? GeneralAccess.PUBLIC : GeneralAccess.PRIVATE,
  );

  const docsT = useTranslations(NS_DOCS);

  const { handleGetDocDetail } = useDocs();

  const fetApi = () => {
    onGetEmployees({ pageIndex: 1, pageSize: 50, ...initQuery });
  };

  const onSelectMember = (_, value) => {
    console.log(value);
  };

  const { onAddSnackbar } = useSnackbar();

  const onSubmit = async (values) => {
    const payload =
      values?.type === "public"
        ? {
            isPublic: true,
          }
        : {
            owner: docInfo?.owner,
            perm: values?.perm,
            isPublic: false,
          };

    await client
      .put(Endpoint.ADD_PERM_DOCS + id, payload, {
        baseURL: DOCS_API_URL,
      })
      .then(() => {
        onAddSnackbar("Thành Công", "success");
        handleGetDocDetail(id);
        setOpenShare(false);
      })
      .catch((err: any) => {
        onAddSnackbar(err?.message, "error");
      });
  };

  const formik = useFormik({
    initialValues: init as InitDataProps,
    enableReinitialize: true,
    onSubmit,
  });

  const options = items?.map((e) => ({
    value: e.id,
    label: e.fullname || "",
    avatar: e.avatar || "",
    subText: e.email,
  }));

  const optionAccess = Object.keys(DocAccessibility).map((key) => ({
    label: DocAccessibility[key],
    value: key,
  }));

  useEffect(() => {
    if (!isReady) return;
    fetApi();
  }, [initQuery, isReady, onGetEmployees]);

  const onChangeSearch = (name: string, value?: string | number) => {
    onGetEmployees({ pageIndex: 1, pageSize: 20, [name]: value ?? "" });
  };

  return (
    <FormLayout
      open={openShare}
      onClose={() => setOpenShare(false)}
      sx={{
        minWidth: { xs: "calc(100vw - 24px)", sm: "50%" },
        maxWidth: { xs: "calc(100vw - 24px)", sm: "50%" },
        minHeight: "auto",
        textAlign: "center",
      }}
      onSubmit={formik.handleSubmit}
      label={docsT("changeDocAccess")}
    >
      <Box
        position="relative"
        sx={{
          marginTop: "40px",
        }}
      >
        <Autocomplete
          onChange={onSelectMember}
          multiple
          id="checkboxes-tags-demo"
          options={options}
          disableCloseOnSelect
          getOptionLabel={(option) => option.label}
          popupIcon={null}
          sx={{
            "& .MuiInputBase-root": {
              pr: "100px !important",
            },
          }}
          renderOption={(props, option) => {
            return (
              <li
                key={option.value}
                {...props}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <Avatar src={option.avatar} size={24} alt={option.label} />
                <Box
                  sx={{
                    fontFamily: inter.style.fontFamily,
                  }}
                >
                  <Typography sx={{ fontFamily: "inherit" }}>
                    {option.label}
                  </Typography>
                  <Typography sx={{ fontFamily: "inherit", fontSize: "14px" }}>
                    {option.subText}
                  </Typography>
                </Box>
              </li>
            );
          }}
          renderInput={(params) => (
            <TextField {...params} placeholder="Add people or project group" />
          )}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option.value}
                label={
                  <Typography
                    sx={{
                      fontFamily: "inherit",
                      fontSize: "14px",
                      fontWeight: 500,
                    }}
                  >
                    {option.label}
                  </Typography>
                }
                avatar={
                  <Avatar
                    src={option.avatar}
                    alt={option.label}
                    size={24}
                    style={{
                      borderRadius: "50%",
                    }}
                  />
                }
                deleteIcon={
                  <CloseIcon
                    sx={{
                      width: "18px",
                      height: "18px",
                    }}
                  />
                }
                sx={{
                  backgroundColor: "#f0f0f0",
                  borderRadius: "16px",
                  height: "32px",
                  margin: "2px",
                  gap: "4",
                  "& .MuiChip-avatar": {
                    width: "24px",
                    height: "24px",
                    marginLeft: "4px",
                  },
                  "& .MuiChip-label": {
                    paddingLeft: "8px",
                    paddingRight: "8px",
                  },
                  "& .MuiChip-deleteIcon": {
                    color: "#888",
                    "&:hover": {
                      color: "#333",
                    },
                  },
                }}
              />
            ))
          }
        />
        <Button
          variant="primary"
          size="extraSmall"
          sx={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          Add
        </Button>
      </Box>
      {/* People section */}
      <Stack
        alignItems="flex-start"
        marginTop="20px"
        fontFamily={inter.style.fontFamily}
        spacing="12px"
      >
        <Typography sx={{ fontFamily: "inherit", fontWeight: 700 }}>
          People
        </Typography>
        <Box width="100%" pl="12px">
          {docInfo.member?.map((m) => {
            console.log("m", m);
            
            const user = items.find((e) => e.id === m.user);
            console.log("items", items);
            
            console.log("user", user);
            
            if (!user) return;
            return (
              <Box
                key={m.user}
                sx={{
                  width: "100%",
                  display: "flex",
                  gap: "10px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Avatar src={user.avatar} size={32} alt={user.fullname} />
                  <Box
                    sx={{
                      fontFamily: inter.style.fontFamily,
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "inherit",
                        fontWeight: 700,
                        lineHeight: "18px",
                        textAlign: "left",
                      }}
                    >
                      {`${user.fullname} ${user.id === me?.id ? "(Me)" : ""}`}
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "inherit",
                        fontSize: "14px",
                        textAlign: "left",
                      }}
                    >
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
                {m.user === docInfo.owner?.id ? (
                  <Typography
                    sx={{
                      fontFamily: "inherit",
                    }}
                  >
                    Owner
                  </Typography>
                ) : (
                  <Select
                    defaultValue={m.perm}
                    sx={{
                      "& fieldset": {
                        border: "none",
                      },
                    }}
                  >
                    {optionAccess.map((option) => (
                      <MenuItem
                        value={option.value}
                        key={option.value}
                        sx={{
                          fontFamily: "inherit",
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Box>
            );
          })}
        </Box>
      </Stack>

      {/* General section */}
      <Stack
        alignItems="flex-start"
        marginTop="20px"
        fontFamily={inter.style.fontFamily}
        spacing="12px"
      >
        <Typography sx={{ fontFamily: "inherit", fontWeight: 700 }}>
          General Access
        </Typography>
        <Box
          width="100%"
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: "center",
            pl: "12px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Avatar
              src={docInfo.owner?.avatar}
              size={32}
              alt={docInfo.owner?.fullname}
            />
            <Box textAlign="left">
              <Select
                sx={{
                  "& fieldset": {
                    border: "none",
                  },
                }}
                name="type"
                placeholder="Select Access"
                SelectDisplayProps={{
                  style: {
                    padding: "0 32px 0 0",
                    fontWeight: 700,
                    fontFamily: "inherit",
                  },
                }}
                value={generalSelectedOpt}
                onChange={(e) => {
                  setGeneralSelectedOpt(e.target.value as GeneralAccess);
                  formik.handleChange(e);
                }}
              >
                {generalAccessOpts.map((option) => (
                  <MenuItem
                    value={option.code}
                    key={option.title}
                    sx={{
                      fontFamily: "inherit",
                    }}
                  >
                    {option.title}
                  </MenuItem>
                ))}
              </Select>
              <Typography sx={{ fontFamily: "inherit" }}>
                {
                  generalAccessOpts.find(
                    (opt) => opt.code === generalSelectedOpt,
                  )?.desc
                }
              </Typography>
            </Box>
          </Box>
          <Select
            defaultValue={optionAccess[0].value}
            sx={{
              "& fieldset": {
                border: "none",
              },
            }}
            name="perm"
            onChange={formik.handleChange}
          >
            {optionAccess.map((option) => (
              <MenuItem
                value={option.value}
                key={option.value}
                sx={{
                  fontFamily: "inherit",
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Stack>
    </FormLayout>
  );
};

export default ModalShare;
