import { AIAgentDictionary } from "dictionaries/types/AIAgentDictionary";

export const AIAgentLang: AIAgentDictionary = {
  seo: {
    title: "AI Agent | Taskcover",
  },
  header: {
    title: "AI Agent",
    key: "ai agent",
  },
  layout: {
    header: {
      create: "Create",
      search: "Search",
      status: "Status",
      none: "None",
      active: "Active",
      inactive: "Inactive",
      createAgent: "Create Agent",
      agentName: "Agent Name",
      avatar: "Avatar",
      upload: "Upload",
    },
    table: {
      agent: "Agent",
      status: "Status",
      creationDate: "Creation Date",
      index: "Index",
    },
  },
  tabList: {
    general: "General",
    tools: "Tools",
    knowledge: "Knowledge",
    commands: "Commands",
    promptTemplates: "Prompt Templates",
    chat: "Chat",
  },
  detail: {
    header: {
      title: "Detail | Taskcover",
    },
  },
  general: {
    header: {
      title: "General | Taskcover",
    },
    title: "General",
    cancel: "Cancel",
    update: "Update",
    agentName: "Agent name",
    viewPrompts: "View Prompts",
    description: "Description",
    placeholderTextarea: "Personalize your agent...",
    tone: "Tone",
    default: "Default",
  },
  tools: {
    header: {
      title: "Tools | Taskcover",
    },
    title: "Tools",
    description:
      "Enhance your agent with tools for comprehensive data gathering and preprocessing inside commands.",
    webSearch: "Web Search",
    webSearchDescription:
      "Can be enabled with each commands to access information from the web.",
  },
  knowledge: {
    header: {
      title: "Knowledge | Taskcover",
    },
    title: "Knowledge",
    description:
      "Enhance your agent's knowledge to improve its awareness and achieve better results.",
    enableKnowledge: "Enable Knowledge",
    addFromMedia: "Add from Media",
    dragOrSelect: "Drag file here or select to upload (.pdf, .csv, .txt)",
    addLink: "Add Link",
    addYoutube: "Add Youtube",
    addSource: "Add Source",
    add: "Add",
    cancel: "Cancel",
    addYoutubeDescription: "Add Youtube transcripts as knowledge",
    addYoutubePlaceholder: "Type or paste a Youtube link...",
    addLinkDescription: "Add knowledge from a URL to crawl the content",
    addLinkPlaceholder: "Type or paste a URL...",
  },
  commands: {
    header: {
      title: "Commands | Taskcover",
    },
    title: "Commands",
    description:
      "Create custom /commands to use in projects. Enable tools per command for more refined results.",
    addCommand: "Add Command",
    createCommand: "Create a new command",
    name: "Name",
    prompt: "Prompt",
    viewPrompts: "View Prompts",
    backgroundTask: "Background Task",
    webSearch: "Web Search",
    useKnowledge: "Use Knowledge",
    tools: "Tools",
    settings: "Settings",
    writeYourCommand: "Write your command prompt...",
    create: "Create",
  },
  promptTemplates: {
    header: {
      title: "Prompt Templates | Taskcover",
    },
    searchTemplate: "Search template...",
  },
};
