import { CheckBoxOutlineBlank } from "@mui/icons-material";
import {
  FormControl,
  Box,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
  IconButton,
  MenuList,
  SxProps,
} from "@mui/material";
import { useFormik } from "formik";
import SendIcon from "icons/SendIcon";
import PresetMenuItem from "./PresetMenuItem";
import * as Yup from "yup";
import { AiProjectData, ProjectData } from "store/project/actions";
import { useMemo, useState } from "react";
import Markdown from "react-markdown";

const ProjectAiEdit = (props: {
  tone: string;
  persona: string;
  projectData: AiProjectData;
  onSubmit: (data: AiProjectData) => Promise<void>;
  sx?: SxProps;
}) => {
  const [projectData, setProjectData] = useState(props.projectData);
  const [isGenerating, setIsGenerating] = useState(false);
  const projectDataMarkdown = useMemo(
    () => projectDataJsonToMarkdown(projectData),
    [projectData],
  );

  const formik = useFormik({
    validationSchema: Yup.object().shape({
      prompt: Yup.string().notRequired().required("Must have a prompt"),
    }),
    initialValues: {
      prompt: "",
      tone: props.tone,
      persona: props.persona,
    },
    onSubmit: async (data) => {
      // TODO: add edit api
    },
  });

  return (
    <FormControl sx={{ gap: 2, ...props.sx }}>
      <Box overflow="auto" maxHeight="50vh" p={2}>
        <Markdown>{projectDataMarkdown}</Markdown>
      </Box>
      <TextField
        placeholder="What would you like to do next?"
        id="project-edit-prompt"
        name="prompt"
        value={formik.values.prompt}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched.prompt && Boolean(formik.errors.prompt)}
        helperText={formik.touched.prompt && formik.errors.prompt}
        sx={{
          bgcolor: "background.default",
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
      <MenuList>
        <PresetMenuItem
          preset="Create document"
          type="command"
          onClick={async () => {
            setIsGenerating(true);
            await props.onSubmit(projectData);
            setIsGenerating(false);
          }}
          isLoading={isGenerating}
        />
        <PresetMenuItem preset="Continue writing" type="command" />
        <PresetMenuItem preset="Make longer" type="command" />
      </MenuList>
    </FormControl>
  );
};

export default ProjectAiEdit;

function projectDataJsonToMarkdown(projectData: AiProjectData) {
  let text = `# ${projectData.title}\n\n`;

  text += "## Project Overview\n\n";
  text += `${projectData.description}\n\n`;

  text += `## Milestones\n\n`;
  for (const taskList of projectData.taskList) {
    text += `### ${taskList.title}\n\n`;
    for (const task of taskList.tasks) {
      text += `- [ ] ${task}\n`;
    }
  }

  return text;
}
