export type AIAgentDictionary = {
  seo: {
    title: string;
  };
  header: {
    title: string;
    key: string;
  };
  layout: {
    header: {
      create: string;
      search: string;
      status: string;
      none: string;
      active: string;
      inactive: string;
      createAgent: string;
      agentName: string;
      avatar: string;
      upload: string;
    };
    table: {
      agent: string;
      status: string;
      creationDate: string;
      index: string;
    };
  };
  tabList: {
    general: string;
    tools: string;
    knowledge: string;
    commands: string;
    promptTemplates: string;
    chat: string;
  };
  detail: {
    header: {
      title: string;
    };
  };
  general: {
    header: {
      title: string;
    };
    title: string;
    cancel: string;
    update: string;
    agentName: string;
    viewPrompts: string;
    description: string;
    placeholderTextarea: string;
    tone: string;
    default: string;
  };
  tools: {
    header: {
      title: string;
    };
    title: string;
    description: string;
    webSearch: string;
    webSearchDescription: string;
  };
  knowledge: {
    header: {
      title: string;
    };
    title: string;
    description: string;
    enableKnowledge: string;
    addSource: string;
    dragOrSelect: string;
    addFromMedia: string;
    addLink: string;
    addYoutube: string;
    add: string;
    cancel: string;
    addLinkDescription: string;
    addLinkPlaceholder: string;
    addYoutubeDescription: string;
    addYoutubePlaceholder: string;
  };
  commands: {
    header: {
      title: string;
    };
    title: string;
    description: string;
    addCommand: string;
    createCommand: string;
    name: string;
    prompt: string;
    viewPrompts: string;
    backgroundTask: string;
    webSearch: string;
    useKnowledge: string;
    tools: string;
    settings: string;
    writeYourCommand: string;
    create: string;
  };
  promptTemplates: {
    header: {
      title: string;
    };
  };
};
