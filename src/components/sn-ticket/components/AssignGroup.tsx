"use client";
import { Avatar, Box, TextField } from "@mui/material";
import { Text } from "components/shared";
import EditIcon from "icons/EditIcon";
import useGetListAgent from "queries/ticket-agent/useGetAgent/useGetListAgent";
import useUpdateTicket from "queries/ticket/useTicketAction/useUpdateTicket";
import { memo, useEffect, useState } from "react";
import { useAuth, useSnackbar } from "store/app/selectors";
import { Permission } from "constant/enums";
import useDebounce from "hooks/useDebounce";
import { setKeySearchTicketAgent } from "store/ticket-agent/actions";
import { selectSearchTicketAgent } from "store/ticket-agent/selectors";
import { useAppDispatch, useAppSelector } from "store/hooks";


type PropsAssgiGroup = {
  item: any;
  type?: "detail";
  style?: React.CSSProperties;
  styledDropdown?: React.CSSProperties
  setAssign?: any;
  mobile?: boolean;
};

const AssignGroup = (props: PropsAssgiGroup) => {
  const { user } = useAuth();
  const checkRole = user?.roles?.some((item) => item == Permission.SA || item == Permission.SP)
  const { updateTicket } = useUpdateTicket()
  const { data: listAgent } = useGetListAgent();
  const { item, style, type, styledDropdown, setAssign, mobile } = props || null;
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(item?.assignUser?.fullname);
  const [urlAvatar, setUrlAvatar] = useState(item?.assignUser?.urlAvatar);
  const [keyword, setKeyword] = useState('');
  const { onAddSnackbar } = useSnackbar();
  const dataSearch = useAppSelector(selectSearchTicketAgent);
  const dispatch = useAppDispatch()


  const [keySearch] = useDebounce(() => {
    const payload = {
      ...dataSearch,
      keyword: keyword,
    };
    dispatch(setKeySearchTicketAgent(payload));
  }, 500)


  useEffect(() => {
    keySearch();
  }, [keyword]);




  const hanldChange = (value) => {
    console.log("check value", value);
    setValue(value?.fullname);
    setUrlAvatar(value?.urlAvatar);
    setOpen(false);
    setKeyword("");

    if (type == "detail") {
      setAssign(value?.id)

    }
    if (type !== "detail") {
      const payload = {
        id: item?.id,
        type: item?.type,
        priority: item?.priority,
        assign: value?.id,
        rootCause: item?.rootCause
      }
      updateTicket.mutate(payload, {
        onSuccess: (data) => {
          console.log("Success:", data);
          onAddSnackbar(`${data?.data?.errorMessage ? data?.data?.errorMessage : "Update Success"}`, "success");
        },
        onError: (err) => {
          onAddSnackbar("Create ticket error!", "error");
        },
      });
    }

  };
  const handleOpen = () => {
    if (!checkRole) return
    setOpen(prev => !prev)
  }
  return (
    <Box
      py={1}
      sx={{
        position: "relative",
        // width: "164px",
        border: open ? "1px solid #14B9E5" : "",
        borderRadius: "6px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        ...style,

      }}
    >
      <Box display="flex" alignItems="center" gap="5px" marginLeft="10px">
        {value &&
          <Avatar
            src={urlAvatar}
            alt="Image description"
            sx={{ borderRadius: "100%", height: 30, width: 30 }}
          />
        }
        <Text onClick={() => handleOpen()} sx={{ fontSize: 13 }}>{value || "nothing"}</Text>
      </Box>
      {
        type !== "detail" &&
        checkRole &&
        !mobile &&
        <>
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
            <Box sx={{ marginRight: "10px" }} onClick={() => { setOpen(false) }}>
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
        </>
      }


      {open && (
        <Box
          sx={{
            position: "absolute",
            top: 50,
            backgroundColor: "#fff",
            width: "100%",
            height: "150px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            padding: "3px 3px",
            overflow: "auto",
            zIndex: 10,
            "&:hover": {
              cursor: "pointer",
              borderRadius: "5px",
            },
            "&::-webkit-scrollbar": {
              display: "none",
            },
            ...styledDropdown,
          }}
        >
          <TextField
            placeholder="Search assign"
            onChange={(event) => setKeyword(event.target.value)}
            sx={{
              fontSize: 3,
              width: "100%",
              height: "auto",
              outline: "none",
              padding: "0 3px",
              '& .MuiInputBase-input': {
                fontSize: '0.75rem',
              },
              '& .MuiInputBase-input::placeholder': {
                fontSize: '0.75rem',
              },
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  border: 'none',
                },
                '&:hover fieldset': {
                  border: 'none',
                },
                '&.Mui-focused fieldset': {
                  border: 'none',
                },
              },
            }}
            variant="outlined"
          />
          {listAgent?.data?.data?.filter((item) => item?.detail?.fullname?.toLowerCase().includes(keyword.toLowerCase()))
            .map((item: any, index: number) => (
              <Box
                key={index}
                onClick={() => hanldChange(item?.detail)}
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
                <Avatar
                  src={item?.detail?.urlAvatar}
                  alt="Image description"
                  sx={{ borderRadius: "100%", height: 30, width: 30 }}
                />
                <Text sx={{ fontSize: 13 }}>{item?.detail?.fullname}</Text>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default memo(AssignGroup);
