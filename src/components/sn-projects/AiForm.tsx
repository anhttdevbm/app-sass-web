import {
  Modal,
  Paper,
  FormControl,
  TextField,
  Stack,
  MenuList,
  MenuItem,
  ListItemText,
  SvgIcon,
  SvgIconProps,
  InputAdornment,
  Box,
  ListItemIcon,
  IconButton,
  Typography,
  CircularProgress,
} from "@mui/material";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { useLocale } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Locale, Option } from "constant/types";
import { useProjects, useTasksOfProject } from "store/project/selectors";
import { useChatWithAI } from "store/aiChat/selectors";
import { useDocs } from "store/docs/selectors";
import { CheckBoxOutlineBlank } from "@mui/icons-material";
import * as Yup from "yup";

const CREATE_WITH_AI_PRESETS = [
  "Plan a project for",
  "Create a sprint for",
  "Create a project timeline for",
  "Create an editorial calendar for",
  "Create a team meeting agenda for",
  "Develop project risk management plan for",
  "Develop project team roles and responsibilities for",
];

type ScaffoldProjectData = {
  title: string;
  expectedCost: string;
  workingHours: string;
  description: string;
  taskList: {
    title: string;
    tasks: string[];
  }[];
};

const View = ["form", "edit"] as const;
type View = (typeof View)[number];

const scaffoldProjectSchema = Yup.object().shape({
  tone: Yup.string().trim().required(),
  persona: Yup.string().trim().required(),
  prompt: Yup.string().trim().required(),
});

const AiForm = (props: { isOpen: boolean; onClose: () => void }) => {
  const { tones, onGetTone, personas, onGetPersona } = useChatWithAI();
  const { onCreateProject, onCreateProjectWithAI } = useProjects();
  const { onCreateTaskList, onCreateTask } = useTasksOfProject();
  const { onCreateDoc } = useDocs();
  const locale = useLocale() as Locale;

  const [prompt, setPrompt] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [selectedPersona, setSelectedPersona] = useState("");
  const [projectData, setProjectData] = useState<ScaffoldProjectData | null>(
    null,
  );
  const [view, setView] = useState<View>("form");
  const [isScaffoldLoading, setIsScaffoldLoading] = useState(false);
  const [isFinalLoading, setIsFinalLoading] = useState(false);

  useEffect(() => {
    Promise.allSettled([onGetTone({}), onGetPersona({})]);
  }, [onGetTone, onGetPersona]);

  const onScaffoldSubmit = async () => {
    const validForm = await scaffoldProjectSchema.validate({
      tone: selectedTone,
      persona: selectedPersona,
      prompt,
    });
    setIsScaffoldLoading(true);
    const result = await onCreateProjectWithAI(validForm);
    setIsScaffoldLoading(false);
    setPrompt("");
    setSelectedTone("");
    setSelectedPersona("");
    setProjectData(result);
    setView("edit");
  };

  const onFinalSubmit = async () => {
    setIsFinalLoading(true);
    let docData = "";
    if (projectData) {
      const project = await onCreateProject({
        name: projectData.title,
        owner: "",
        start_date: "",
        end_date: "",
        type_project: "" as unknown as Option,
        description: projectData.description,
      });
      docData += `# ${projectData.title}\n\n`;
      docData += "## Project Overview\n\n";
      docData += `${projectData.description}\n\n`;
      docData += "## Milestones\n\n";
      for (const _taskList of projectData.taskList) {
        const taskList = await onCreateTaskList({
          name: _taskList.title,
          project: project.id,
        });
        docData += `### ${_taskList.title}\n\n`;

        for (const _task of _taskList.tasks) {
          await onCreateTask({ name: _task }, taskList.id);
          docData += `- [ ] ${_task}\n`;
        }
      }

      await onCreateDoc(project.id, docData);
    }
    setIsFinalLoading(false);
    props.onClose();
  };

  return (
    <Modal open={props.isOpen} onClose={props.onClose}>
      <Paper
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          padding: 3,
        }}
      >
        {view === "form" ? (
          <FormControl
            fullWidth
            sx={{
              border: "solid 1px dodgerblue",
              bgcolor: "background.default",
              borderRadius: 1,
            }}
          >
            <TextField
              placeholder="Enter your goal, task, or next big project ..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isScaffoldLoading}
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
                    {isScaffoldLoading ? (
                      <CircularProgress />
                    ) : (
                      <IconButton onClick={onScaffoldSubmit}>
                        <SendIcon sx={{ color: "transparent" }} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  onScaffoldSubmit();
                }
              }}
            />
            <Box display="flex" flexDirection="column" p={2} gap={1}>
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
                    label="Tone"
                    value={selectedTone}
                    disabled={isScaffoldLoading}
                    onChange={(e) => setSelectedTone(e.target.value)}
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
                      IconComponent: () => (
                        <ExpandMore htmlColor="dodgerblue" />
                      ),
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {tones.map((tone) => (
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
                    label="Persona"
                    disabled={isScaffoldLoading}
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value)}
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
                      IconComponent: () => (
                        <ExpandMore htmlColor="dodgerblue" />
                      ),
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {personas.map((persona) => (
                      <MenuItem key={persona.id} value={persona.id}>
                        {persona.name[locale]}
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>
              </Stack>
              {prompt.length === 0 && (
                <MenuList>
                  {CREATE_WITH_AI_PRESETS.map((preset) => (
                    <PresetMenuItem
                      key={preset}
                      preset={preset}
                      onClick={() => setPrompt(preset)}
                    />
                  ))}
                </MenuList>
              )}
            </Box>
          </FormControl>
        ) : view === "edit" ? (
          <FormControl sx={{ gap: 2 }}>
            <Box overflow="auto" maxHeight="30vh">
              <Typography variant="h3">{projectData?.title}</Typography>
              <Typography variant="h4">Project Overview</Typography>
              <Typography>{projectData?.description}</Typography>
              <Typography variant="h4">Milestones</Typography>
              {projectData?.taskList.map((_taskList, index) => (
                <Box key={_taskList.title}>
                  <Typography variant="h5">{_taskList.title}</Typography>
                  {_taskList.tasks.map((_task) => (
                    <Box
                      display="flex"
                      alignItems="center"
                      key={_task}
                      sx={{ ml: 2 }}
                    >
                      <CheckBoxOutlineBlank fontSize="small" />
                      <Typography>Task {_task}</Typography>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
            <TextField
              placeholder="What would you like to do next?"
              disabled={isFinalLoading}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
                    {isFinalLoading ? (
                      <CircularProgress />
                    ) : (
                      <IconButton onClick={onFinalSubmit}>
                        <SendIcon sx={{ color: "transparent" }} />
                      </IconButton>
                    )}
                  </InputAdornment>
                ),
              }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  //TODO: allow edit
                }
              }}
            />
            <MenuList>
              <PresetMenuItem
                preset="Create document"
                onClick={onFinalSubmit}
              />
              <PresetMenuItem preset="Continue writing" />
              <PresetMenuItem preset="Make longer" />
            </MenuList>
          </FormControl>
        ) : null}
      </Paper>
    </Modal>
  );
};

export default AiForm;

const PresetMenuItem = (props: { preset: string; onClick?: () => void }) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <MenuItem
      sx={{
        "&:hover": {
          backgroundColor: "#ece6fd !important",
        },
        borderRadius: 2,
      }}
      onClick={props.onClick}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <ListItemIcon>
        {isHover ? (
          <PromptPresetHoverIcon sx={{ color: "transparent" }} />
        ) : (
          <PromptPresetIcon sx={{ color: "transparent" }} />
        )}
      </ListItemIcon>
      <ListItemText>{props.preset}...</ListItemText>
      {isHover && <EnterIcon sx={{ color: "transparent" }} />}
    </MenuItem>
  );
};

const SendIcon = (props: SvgIconProps) => (
  <svg
    width="24"
    height="25"
    viewBox="0 0 24 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18.0703 8.80945L9.51026 4.52945C3.76026 1.64945 1.40026 4.00945 4.28026 9.75945L5.15026 11.4995C5.40026 12.0095 5.40026 12.5995 5.15026 13.1095L4.28026 14.8395C1.40026 20.5895 3.75026 22.9495 9.51026 20.0695L18.0703 15.7895C21.9103 13.8695 21.9103 10.7295 18.0703 8.80945ZM14.8403 13.0495H9.44026C9.03026 13.0495 8.69026 12.7095 8.69026 12.2995C8.69026 11.8895 9.03026 11.5495 9.44026 11.5495H14.8403C15.2503 11.5495 15.5903 11.8895 15.5903 12.2995C15.5903 12.7095 15.2503 13.0495 14.8403 13.0495Z"
      fill="#3699FF"
    />
  </svg>
);

const ToneIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5 8.51562V12.0907"
      stroke="#3699FF"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.5 7.32422V13.2742"
      stroke="#3699FF"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M10 6.13281V14.4661"
      stroke="#3699FF"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M12.5 7.32422V13.2742"
      stroke="#3699FF"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M15 8.51562V12.0907"
      stroke="#3699FF"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M7.49984 18.6354H12.4998C16.6665 18.6354 18.3332 16.9688 18.3332 12.8021V7.80208C18.3332 3.63542 16.6665 1.96875 12.4998 1.96875H7.49984C3.33317 1.96875 1.6665 3.63542 1.6665 7.80208V12.8021C1.6665 16.9688 3.33317 18.6354 7.49984 18.6354Z"
      stroke="#3699FF"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </SvgIcon>
);

const PersonaIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.1331 9.36042C10.0498 9.35208 9.9498 9.35208 9.85814 9.36042C7.8748 9.29375 6.2998 7.66875 6.2998 5.66875C6.2998 3.62708 7.9498 1.96875 9.9998 1.96875C12.0415 1.96875 13.6998 3.62708 13.6998 5.66875C13.6915 7.66875 12.1165 9.29375 10.1331 9.36042Z"
      stroke="#3699FF"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5.9666 12.4328C3.94993 13.7828 3.94993 15.9828 5.9666 17.3245C8.25827 18.8578 12.0166 18.8578 14.3083 17.3245C16.3249 15.9745 16.3249 13.7745 14.3083 12.4328C12.0249 10.9078 8.2666 10.9078 5.9666 12.4328Z"
      stroke="#3699FF"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </SvgIcon>
);

const PromptPresetIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.6466 5.39572L12.0068 6.0355L10.7139 4.7426L11.3537 4.10282C11.5347 3.92188 11.7651 3.83594 12.0002 3.83594C12.2352 3.83594 12.4657 3.92188 12.6466 4.10282C13.0047 4.4609 13.0047 5.03765 12.6466 5.39572Z"
      fill="#666666"
      stroke="#666666"
    />
    <path
      d="M10.8329 7.21468L3.98007 14.0611L3.9799 14.0613C3.62183 14.4194 3.04508 14.4194 2.68701 14.0613C2.32899 13.7033 2.32894 13.1266 2.68685 12.7686C2.68687 12.7685 2.6869 12.7685 2.68692 12.7685C2.68695 12.7685 2.68698 12.7684 2.68701 12.7684L9.53996 5.92179L10.8329 7.21468Z"
      fill="#666666"
      stroke="#666666"
    />
    <path
      d="M6.15393 2.94091L6.11236 3.08186L6.15366 3.22289L6.29741 3.71373L5.8083 3.56946L5.66906 3.52839L5.52948 3.56827L5.03661 3.70909L5.17975 3.22382L5.22082 3.08459L5.18094 2.94501L5.04012 2.45214L5.52538 2.59527L5.66684 2.637L5.8083 2.59527L6.29854 2.45067L6.15393 2.94091Z"
      fill="#666666"
      stroke="#666666"
    />
    <path
      d="M3.48694 6.94091L3.44558 7.08114L3.48628 7.22157L3.62731 7.70812L3.13464 7.5628L2.99318 7.52107L2.85172 7.5628L2.37094 7.70461L2.51275 7.22382L2.55382 7.08459L2.51394 6.94501L2.37312 6.45214L2.85839 6.59527L2.99763 6.63634L3.13721 6.59646L3.63008 6.45564L3.48694 6.94091Z"
      fill="#666666"
      stroke="#666666"
    />
    <path
      d="M13.4869 10.2752L13.4445 10.4189L13.4881 10.5622L13.6337 11.0403L13.1479 10.8971L13.0065 10.8553L12.865 10.8971L12.3842 11.0389L12.5261 10.5581L12.5678 10.4166L12.5261 10.2752L12.3842 9.7944L12.865 9.93621L13.0065 9.97793L13.1479 9.93621L13.6287 9.7944L13.4869 10.2752Z"
      fill="#666666"
      stroke="#666666"
    />
  </SvgIcon>
);

const PromptPresetHoverIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="16"
    height="17"
    viewBox="0 0 16 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.6466 4.9465L12.0068 5.58628L10.7139 4.29339L11.3537 3.65361C11.5347 3.47266 11.7651 3.38672 12.0002 3.38672C12.2352 3.38672 12.4657 3.47266 12.6466 3.65361C13.0047 4.01168 13.0047 4.58843 12.6466 4.9465Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
    <path
      d="M10.8329 6.76546L3.98007 13.6119L3.9799 13.6121C3.62183 13.9701 3.04508 13.9701 2.68701 13.6121C2.32899 13.2541 2.32894 12.6774 2.68685 12.3193C2.68687 12.3193 2.6869 12.3193 2.68692 12.3193C2.68695 12.3192 2.68698 12.3192 2.68701 12.3192L9.53996 5.47257L10.8329 6.76546Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
    <path
      d="M6.15393 2.49169L6.11236 2.63264L6.15366 2.77368L6.29741 3.26451L5.8083 3.12024L5.66906 3.07917L5.52948 3.11905L5.03661 3.25987L5.17975 2.77461L5.22082 2.63537L5.18094 2.49579L5.04012 2.00292L5.52538 2.14606L5.66684 2.18778L5.8083 2.14606L6.29854 2.00145L6.15393 2.49169Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
    <path
      d="M3.48694 6.49169L3.44558 6.63192L3.48628 6.77235L3.62731 7.2589L3.13464 7.11358L2.99318 7.07185L2.85172 7.11358L2.37094 7.25539L2.51275 6.77461L2.55382 6.63537L2.51394 6.49579L2.37312 6.00292L2.85839 6.14606L2.99763 6.18713L3.13721 6.14724L3.63008 6.00642L3.48694 6.49169Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
    <path
      d="M13.4869 9.82596L13.4445 9.96967L13.4881 10.113L13.6337 10.5911L13.1479 10.4478L13.0065 10.4061L12.865 10.4478L12.3842 10.5897L12.5261 10.1089L12.5678 9.96742L12.5261 9.82596L12.3842 9.34518L12.865 9.48699L13.0065 9.52872L13.1479 9.48699L13.6287 9.34518L13.4869 9.82596Z"
      fill="#8950FC"
      stroke="#8950FC"
    />
  </SvgIcon>
);

const EnterIcon = (props: SvgIconProps) => (
  <SvgIcon
    width="20"
    height="21"
    viewBox="0 0 20 21"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.94141 15.5599H12.6081C14.9081 15.5599 16.7747 13.6932 16.7747 11.3932C16.7747 9.09323 14.9081 7.22656 12.6081 7.22656H3.44141"
      stroke="#666666"
      stroke-width="1.5"
      stroke-miterlimit="10"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M5.35794 9.30964L3.22461 7.1763L5.35794 5.04297"
      stroke="#666666"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </SvgIcon>
);
