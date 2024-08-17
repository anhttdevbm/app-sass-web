import { CircularProgress, Modal, Paper } from "@mui/material";
import { Option } from "constant/types";
import { Suspense, useEffect, useState } from "react";
import { useDocs } from "store/docs/selectors";
import { useProjects, useTasksOfProject } from "store/project/selectors";
import { useChatWithAI } from "store/aiChat/selectors";
import ProjectAiPrompt from "./components/ProjectAiPrompt";
import ProjectAiEdit from "./components/ProjectAiEdit";
import { AiProjectData, CreateProjectPrompt } from "store/project/actions";
import { convertFromHTML, RawDraftContentBlock } from "draft-js";
import { useRouter } from "next/navigation";

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
  const { push } = useRouter();

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
    if (projectData) {
      const project = await onCreateProject({
        name: projectData.title,
        owner: "",
        start_date: "",
        end_date: "",
        type_project: "" as unknown as Option,
        description: projectData.description,
      });

      let docData = "";
      docData += `<h1>${projectData.title}</h1>`;
      docData += "<h2>Project Overview</h2>";
      docData += `<p>${projectData.description}</p>`;
      docData += "<h2>Milestones</h2>";
      for (const _taskList of projectData.taskList) {
        docData += `<h3>${_taskList.title}</h3>`;

        docData += "<ul>";
        for (const _task of _taskList.tasks) {
          docData += `<li>${_task}</li>`;
        }
        docData += "</ul>";
      }

      const docBlocks = convertFromHTML(docData);
      const doc = await onCreateDoc(
        project.id,
        JSON.stringify(docBlocks.contentBlocks),
        projectData.title,
        projectData.description,
      );
      push(`/documents/${doc.id}`);
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
          width: { xs: "80%", md: "50%" },
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
