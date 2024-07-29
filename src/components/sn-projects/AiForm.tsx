import { Modal, Paper } from "@mui/material";
import { Option } from "constant/types";
import { useEffect, useState } from "react";
import { useDocs } from "store/docs/selectors";
import { useProjects, useTasksOfProject } from "store/project/selectors";
import { useChatWithAI } from "store/aiChat/selectors";
import ProjectAiPrompt from "./components/ProjectAiPrompt";
import ProjectAiEdit from "./components/ProjectAiEdit";
import { AiProjectData, CreateProjectPrompt } from "store/project/actions";

const View = ["form", "edit"] as const;
type View = (typeof View)[number];

const CREATE_WITH_AI_PRESETS = [
  "Plan a project for",
  "Create a sprint for",
  "Create a project timeline for",
  "Create an editorial calendar for",
  "Create a team meeting agenda for",
  "Develop project risk management plan for",
  "Develop project team roles and responsibilities for",
];

const AiForm = (props: { isOpen: boolean; onClose: () => void }) => {
  const { onCreateProject, onCreateProjectWithAI } = useProjects();
  const { onCreateTaskList, onCreateTask } = useTasksOfProject();
  const { onCreateDoc } = useDocs();

  const {
    tone: tones,
    persona: personas,
    onGetTone,
    onGetPersona,
  } = useChatWithAI();
  useEffect(() => {
    Promise.allSettled([onGetTone({}), onGetPersona({})]);
  }, [onGetPersona, onGetTone]);

  const [tone, setTone] = useState("");
  const [persona, setPersona] = useState("");
  const [projectData, setProjectData] = useState<AiProjectData | null>(null);
  const [view, setView] = useState<View>("form");

  const onFormSubmit = async (data: CreateProjectPrompt) => {
    const result = await onCreateProjectWithAI(data);
    setProjectData(result);
    setTone(tone);
    setPersona(persona);
    setView("edit");
  };

  const generateProject = async () => {
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
          <ProjectAiPrompt
            tones={tones}
            personas={personas}
            presets={CREATE_WITH_AI_PRESETS}
            onSubmit={onFormSubmit}
          />
        ) : view === "edit" ? (
          <ProjectAiEdit
            tone={tone}
            persona={persona}
            projectData={projectData!}
            onSubmit={generateProject}
          />
        ) : null}
      </Paper>
    </Modal>
  );
};

export default AiForm;
