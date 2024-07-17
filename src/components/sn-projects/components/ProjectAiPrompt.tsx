import { ExpandMore } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  MenuList,
  Stack,
  SxProps,
  TextField,
} from "@mui/material";
import { Locale } from "constant/types";
import { useFormik } from "formik";
import PersonaIcon from "icons/PersonaIcon";
import SendIcon from "icons/SendIcon";
import ToneIcon from "icons/ToneIcon";
import { useLocale } from "next-intl";
import * as Yup from "yup";
import PresetMenuItem from "./PresetMenuItem";
import { SelectChatAI } from "store/aiChat/type";

const ProjectAiPrompt = (props: {
  tones: SelectChatAI[];
  personas: SelectChatAI[];
  presets: string[];
  onSubmit: (data: {
    tone: string;
    persona: string;
    prompt: string;
  }) => Promise<void>;
  sx?: SxProps;
}) => {
  const locale = useLocale() as Locale;

  const formik = useFormik({
    validationSchema: Yup.object().shape({
      tone: Yup.string().trim().required("Must select a tone"),
      persona: Yup.string().trim().required("Must select a persona"),
      prompt: Yup.string().trim().required("Must have a prompt"),
    }),
    initialValues: {
      prompt: "",
      tone: "",
      persona: "",
    },
    onSubmit: props.onSubmit,
  });

  return (
    <FormControl
      fullWidth
      sx={{
        border: "solid 1px dodgerblue",
        bgcolor: "background.default",
        borderRadius: 1,
        ...props.sx,
      }}
    >
      <TextField
        placeholder="Enter your goal, task, or next big project ..."
        id="project-prompt"
        name="prompt"
        value={formik.values.prompt}
        onChange={formik.handleChange}
        error={formik.touched.prompt && Boolean(formik.errors.prompt)}
        helperText={formik.touched.prompt && formik.errors.prompt}
        sx={{
          borderBottom: "solid 1px dodgerblue",
          "& .MuiOutlinedInput-root": {
            border: "none",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none",
            },
          },
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {formik.isSubmitting ? (
                <CircularProgress />
              ) : (
                <IconButton onClick={() => formik.submitForm()}>
                  <SendIcon sx={{ color: "transparent" }} />
                </IconButton>
              )}
            </InputAdornment>
          ),
        }}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === "Enter") {
            formik.submitForm();
          }
        }}
      />
      <Stack direction="row" gap={1}>
        <Box
          display="flex"
          alignItems="center"
          border="solid 1px dodgerblue"
          borderRadius="2rem"
          px={1}
        >
          <ToneIcon sx={{ color: "transparent" }} />
          <TextField
            select
            id="project-tone"
            name="tone"
            label="Tone"
            value={formik.values.tone}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.tone && Boolean(formik.errors.tone)}
            helperText={formik.touched.tone && formik.errors.tone}
            size="small"
            sx={{
              minWidth: 100,
              "& .MuiOutlinedInput-root": {
                border: "none",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
            InputLabelProps={{ sx: { color: "dodgerblue" } }}
            SelectProps={{
              IconComponent: () => <ExpandMore htmlColor="dodgerblue" />,
            }}
          >
            <MenuItem value="">None</MenuItem>
            {props.tones.map((tone) => (
              <MenuItem key={tone.id} value={tone.id}>
                {tone.name[locale]}
              </MenuItem>
            ))}
          </TextField>
        </Box>
        <Box
          display="flex"
          alignItems="center"
          border="solid 1px dodgerblue"
          borderRadius="2rem"
          px={1}
        >
          <PersonaIcon sx={{ color: "transparent" }} />
          <TextField
            select
            id="project-persona"
            name="persona"
            label="Persona"
            value={formik.values.persona}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.persona && Boolean(formik.errors.persona)}
            helperText={formik.touched.persona && formik.errors.persona}
            size="small"
            sx={{
              minWidth: 100,
              "& .MuiOutlinedInput-root": {
                border: "none",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              },
            }}
            InputLabelProps={{ sx: { color: "dodgerblue" } }}
            SelectProps={{
              IconComponent: () => <ExpandMore htmlColor="dodgerblue" />,
            }}
          >
            <MenuItem value="">None</MenuItem>
            {props.personas.map((persona) => (
              <MenuItem key={persona.id} value={persona.id}>
                {persona.name[locale]}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Stack>
      <Box display="flex" flexDirection="column" p={2} gap={1}>
        {formik.values.prompt.length === 0 && (
          <MenuList>
            {props.presets.map((preset) => (
              <PresetMenuItem
                key={preset}
                preset={preset}
                type="prompt"
                onClick={() => formik.setFieldValue("prompt", preset)}
              />
            ))}
          </MenuList>
        )}
      </Box>
    </FormControl>
  );
};

export default ProjectAiPrompt;
