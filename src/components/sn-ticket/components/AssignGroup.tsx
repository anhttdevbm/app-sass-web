"use client";

import { ArrowDropDown } from "@mui/icons-material";
import { Box, Stack } from "@mui/material";
import { Text } from "components/shared";
import EditIcon from "icons/EditIcon";
import { memo, useEffect, useState } from "react";

type PropsAssgiGroup = {
  item: any;
};

const AssignGroup = (props: PropsAssgiGroup) => {
  const { item } = props || null;
  const [open, setOpen] = useState(false);
  const [list, setList] = useState([1, 2, 3, 4, 5, 6]);
  const [value, setValue] = useState(item?.assignUser?.fullname || "nothing");
  const hanldChange = (value) => {
    console.log("check value", value);
    setValue(value);
    setOpen(false);
  };
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      py={1}
      sx={{
        position: "relative",
        width: "164px",
        border: open ? "1px solid #14B9E5" : "",
        borderRadius: "6px",
      }}
    >
      <Box display="flex" alignItems="center" gap="5px" marginLeft="10px">
        <Box
          component="img"
          height="30px"
          width="30px"
          src="https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__"
          alt="Image description"
          sx={{ borderRadius: "100%" }}
        />
        <Text sx={{ fontSize: 13 }}>{value}</Text>
      </Box>
      {!open ? (
        <EditIcon
          onClick={() => setOpen(true)}
          sx={{
            width: "16px",
            height: "16px",
            color: "#666666",
            marginRight: "10px",
          }}
        />
      ) : (
        <Box sx={{ marginRight: "10px" }} onClick={() => setOpen(false)}>
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M7.37629 7.54035C7.18876 7.72782 6.93445 7.83314 6.66929 7.83314C6.40412 7.83314 6.14982 7.72782 5.96229 7.54035L0.305288 1.88335C0.209778 1.7911 0.133596 1.68076 0.0811869 1.55876C0.0287779 1.43675 0.00119157 1.30553 3.77564e-05 1.17275C-0.00111606 1.03997 0.0241859 0.908293 0.0744668 0.785397C0.124748 0.662501 0.199001 0.550848 0.292893 0.456956C0.386786 0.363063 0.498438 0.28881 0.621334 0.238529C0.744231 0.188248 0.87591 0.162946 1.00869 0.1641C1.14147 0.165254 1.27269 0.19284 1.39469 0.245249C1.5167 0.297658 1.62704 0.37384 1.71929 0.46935L6.66929 5.41935L11.6193 0.46935C11.8079 0.287192 12.0605 0.186398 12.3227 0.188676C12.5849 0.190955 12.8357 0.296124 13.0211 0.481532C13.2065 0.66694 13.3117 0.917753 13.314 1.17995C13.3162 1.44215 13.2154 1.69475 13.0333 1.88335L7.37629 7.54035Z"
              fill="#838195"
            />
          </svg>
        </Box>
      )}

      {open && (
        <Box
          sx={{
            position: "absolute",
            top: 50,
            backgroundColor: "#fff",
            width: "100%",
            height: "auto",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "3px 3px",
            zIndex: 10,
            "&:hover": {
              cursor: "pointer",
              borderRadius: "5px",
            },
          }}
        >
          {list?.map((item, index) => (
            <Box
              key={index}
              onClick={() => hanldChange(item)}
              display="flex"
              alignItems="center"
              gap="5px"
              padding="10px"
              sx={{
                "&:hover": {
                  backgroundColor: "#D9F0FD",
                  cursor: "pointer",
                  borderRadius: "5px",
                },
              }}
            >
              <Box
                component="img"
                height="30px"
                width="30px"
                src="https://s3-alpha-sig.figma.com/img/5744/3623/4932c1bee1f2c0e5132cc2c2470cb1cc?Expires=1725235200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=C0jCodgq3p3A3XqZ~TCmk9AaesXKIcjVStRcPhjnk48fjZcX65G~CB7j6bllmcpti6fGBzy1NIJ3pRsZWi5L-qz4li1b7q3wkiwm15Mipfs~8SyUlHR6A3EbvZBVHSuSKS5niOgMD0x12RT7darl2PYfNrjePrhzeqmoKlni~pOB0zpQ14buGfT1iScCIbl-l0JhdGHm7eYIAH6n43PAtAFijpeZsSyeYAjAHfyoviM1OlT84jX0Uo2-OlZv45IyBtV8hEhDny2ndwep~wO2lkFLZc2BGnjFnAMpU4zePZ5yOxaZvqUKPrO4C9AzeKtPpl3dpZJEznRJVSDBOyQ6bA__"
                alt="Image description"
                sx={{ borderRadius: "100%" }}
              />
              <Text sx={{ fontSize: 13 }}>{item}</Text>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default memo(AssignGroup);
