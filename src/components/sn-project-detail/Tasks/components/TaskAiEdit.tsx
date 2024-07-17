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
import PresetMenuItem from "components/sn-projects/components/PresetMenuItem";
import { useFormik } from "formik";
import SendIcon from "icons/SendIcon";
import { useState } from "react";
import { AiTaskData } from "store/project/actions";
import * as Yup from "yup";
import Markdown from "react-markdown";

const COMMANDS = ["Insert", "Replace", "Regenerate"] as const;
type Commands = (typeof COMMANDS)[number];

const TaskAiEdit = (props: {
  tone: string;
  persona: string;
  taskData: AiTaskData;
  onInsert: (data: AiTaskData) => Promise<void>;
  onReplace: (data: AiTaskData) => Promise<void>;
  onRegenerate: () => Promise<AiTaskData>;
  sx?: SxProps;
}) => {
  const [taskData, setTaskData] = useState(props.taskData);
  const [isGenerating, setIsGenerating] = useState<Commands | null>(null);

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
    <FormControl fullWidth sx={{ gap: 2, ...props.sx }}>
      <Box overflow="auto" maxHeight="30vh" p={2}>
        {taskData.content ? (
          <Markdown>{taskData.content}</Markdown>
        ) : (
          taskData.subtask.map((_task) => (
            <Box display="flex" alignItems="center" key={_task} sx={{ ml: 2 }}>
              <CheckBoxOutlineBlank fontSize="small" />
              <Typography>{_task}</Typography>
            </Box>
          ))
        )}
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
          preset="Insert"
          type="command"
          onClick={async () => {
            setIsGenerating("Insert");
            await props.onInsert(taskData);
            setIsGenerating(null);
          }}
          isLoading={isGenerating === "Insert"}
        />
        <PresetMenuItem
          preset="Replace"
          type="command"
          onClick={async () => {
            setIsGenerating("Replace");
            await props.onReplace(taskData);
            setIsGenerating(null);
          }}
          isLoading={isGenerating === "Replace"}
        />
        <PresetMenuItem
          preset="Regenerate"
          type="command"
          onClick={async () => {
            setIsGenerating("Regenerate");
            setTaskData(await props.onRegenerate());
            setIsGenerating(null);
          }}
          isLoading={isGenerating === "Regenerate"}
        />
      </MenuList>
    </FormControl>
  );
};

export default TaskAiEdit;
