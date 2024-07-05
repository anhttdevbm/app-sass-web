import { Box, Typography, IconButton } from "@mui/material";
import useTheme from "hooks/useTheme";
import { useChat } from "store/chat/selectors";

interface AccountInfoProps {
  onClose: () => void;
  title?: string;
}

const InfoHeader: React.FC<AccountInfoProps> = (props) => {
  const  {isDarkMode} = useTheme()
  const {dataTransfer: currentConversation} = useChat();
  return (
    <Box
      sx={{
        display: "flex",
        height: "77px",
        alignItems: "center",
        justifyContent: "space-between",
        alignSelf: "stretch",
        padding: "16px 8px",
        backgroundColor:  isDarkMode ? "var(--mui-palette-grey-50)": "var(--White, #fff)",
        width: "100%",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            position: 'relative',
            justifyContent: "center",
            width: '100%'
          }}
        >
          <IconButton onClick={props.onClose} sx={{
            position: 'absolute',
            left: '-5px',
          }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
            >
              <path
                d="M9.5999 16C9.5999 15.0667 9.9599 14.1334 10.6666 13.4267L19.3599 4.73336C19.7466 4.34669 20.3866 4.34669 20.7732 4.73336C21.1599 5.12003 21.1599 5.76003 20.7732 6.14669L12.0799 14.84C11.4399 15.48 11.4399 16.52 12.0799 17.16L20.7732 25.8534C21.1599 26.24 21.1599 26.88 20.7732 27.2667C20.3866 27.6534 19.7466 27.6534 19.3599 27.2667L10.6666 18.5734C9.9599 17.8667 9.5999 16.9334 9.5999 16Z"
                fill={ isDarkMode ? 'white' :"#212121"}
              />
            </svg>
          </IconButton>
          <Typography
          variant="h5"
          color={isDarkMode ? 'white' :"var(--Black, #212121)"}
          sx={{ width: "180px", textAlign: "center" }}
        >
          {props?.title ? props?.title : currentConversation?.name as string}
        </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default InfoHeader;
