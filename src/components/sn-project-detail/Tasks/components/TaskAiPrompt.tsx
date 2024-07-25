import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  MenuList,
  Stack,
  SvgIcon,
  SvgIconProps,
  TextField,
  Typography,
  SxProps,
  InputAdornment,
} from "@mui/material";
import PresetMenuItem from "components/sn-projects/components/PresetMenuItem";
import { Locale } from "constant/types";
import { useFormik } from "formik";
import AIGradientIcon from "icons/AIGradientIcon";
import PersonaIcon from "icons/PersonaIcon";
import ToneIcon from "icons/ToneIcon";
import { useLocale } from "next-intl";
import { SelectChatAI } from "store/aiChat/type";
import { CreateTaskPrompt } from "store/project/actions";
import * as Yup from "yup";

const TaskAiPrompt = (props: {
  tones: SelectChatAI[];
  personas: SelectChatAI[];
  content: string;
  commands: string[];
  onSubmit: (data: CreateTaskPrompt) => Promise<void>;
  onClose: () => void;
  sx?: SxProps;
}) => {
  const locale = useLocale() as Locale;

  const formik = useFormik({
    validationSchema: Yup.object().shape({
      tone: Yup.string().required(),
      persona: Yup.string().required(),
      method: Yup.string().required(),
      content: Yup.string().required(),
    }),
    initialValues: {
      tone: "",
      persona: "",
      content: props.content,
      method: "",
    },
    onSubmit: props.onSubmit,
  });

  return (
    <FormControl fullWidth sx={props.sx}>
      <Box
        bgcolor="background.paper"
        flexGrow={1}
        p={3}
        borderRadius="1em 1em 0 0"
      >
        <Box
          display="flex"
          gap={1}
          border="solid 1px dodgerblue"
          p={2}
          bgcolor="background.default"
          borderRadius="4px 4px 0 0"
        >
          <AIGradientIcon />
          <Typography>Choose an option below</Typography>
        </Box>
        <Stack
          direction="row"
          gap={1}
          py={1}
          borderLeft="solid 1px dodgerblue"
          borderRight="solid 1px dodgerblue"
          bgcolor="background.default"
          px={2}
        >
          <TextField
            select
            id="project-tone"
            name="tone"
            value={formik.values.tone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tone && Boolean(formik.errors.tone)}
            helperText={formik.touched.tone && formik.errors.tone}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "2rem",
                  borderColor: "dodgerblue",
                },
              },
            }}
            SelectProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ToneIcon sx={{ color: "transparent" }} />
                  <Typography sx={{ color: "dodgerblue" }}>Tone</Typography>
                </InputAdornment>
              ),
              IconComponent: () => <ExpandMore htmlColor="dodgerblue" />,
            }}
          >
            {props.tones.map((tone) => (
              <MenuItem key={tone.id} value={tone.id}>
                {tone.name[locale]}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            id="project-persona"
            name="persona"
            value={formik.values.persona}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.persona && Boolean(formik.errors.persona)}
            helperText={formik.touched.persona && formik.errors.persona}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "2rem",
                  borderColor: "dodgerblue",
                },
              },
            }}
            SelectProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonaIcon sx={{ color: "transparent" }} />
                  <Typography sx={{ color: "dodgerblue" }}>Persona</Typography>
                </InputAdornment>
              ),
              IconComponent: () => <ExpandMore htmlColor="dodgerblue" />,
            }}
          >
            {props.personas.map((persona) => (
              <MenuItem key={persona.id} value={persona.id}>
                {persona.name[locale]}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
        <MenuList
          sx={{
            border: "solid 1px dodgerblue",
            borderTop: "none",
            bgcolor: "background.default",
            p: 2,
            borderRadius: "0 0 4px 4px",
          }}
        >
          {props.commands.map((preset) => (
            <PresetMenuItem
              key={preset}
              preset={preset}
              type="command"
              onClick={async () => {
                await formik.setFieldValue("method", preset);
                await formik.submitForm();
              }}
              isLoading={formik.values.method === preset && formik.isSubmitting}
            />
          ))}
        </MenuList>
      </Box>
      <Box
        bgcolor="#d9f0fd"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        borderRadius="0 0 4px 4px"
        p={2}
      >
        <Button
          sx={{
            bgcolor: "transparent",
            color: "white",
            background:
              "linear-gradient(90deg, rgba(1,160,250,1) 0%, rgba(41,242,155,1) 100%)",
            px: 3,
            gap: 1,
            textTransform: "none",
          }}
          onClick={props.onClose}
        >
          Close
          <Typography fontSize={12} fontWeight="50">
            ESC
          </Typography>
        </Button>
        <Box display="flex" gap={1}>
          <Typography>Learn more</Typography>
          <MessageQuestionIcon sx={{ color: "transparent" }} />
        </Box>
      </Box>
    </FormControl>
  );
};

export default TaskAiPrompt;

const MessageQuestionIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M17 18.4297H13L8.54999 21.3897C7.88999 21.8297 7 21.3598 7 20.5598V18.4297C4 18.4297 2 16.4297 2 13.4297V7.42969C2 4.42969 4 2.42969 7 2.42969H17C20 2.42969 22 4.42969 22 7.42969V13.4297C22 16.4297 20 18.4297 17 18.4297Z"
      stroke="#252937"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.9998 11.3594V11.1494C11.9998 10.4694 12.4198 10.1094 12.8398 9.8194C13.2498 9.5394 13.6598 9.17941 13.6598 8.51941C13.6598 7.59941 12.9198 6.85938 11.9998 6.85938C11.0798 6.85938 10.3398 7.59941 10.3398 8.51941"
      stroke="#252937"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M11.9955 13.75H12.0045"
      stroke="#252937"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </SvgIcon>
);
