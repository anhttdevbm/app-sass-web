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
  };
  commands: {
    header: {
      title: string;
    };
  };
  promptTemplates: {
    header: {
      title: string;
    };
  };
};
