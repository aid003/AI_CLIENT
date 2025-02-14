export interface Project {
  id?: number;
  name?: string;
  description?: string;
  status?: boolean;
  fallbackMessage?: string;
  gptModel?: string;
  gptTemperature?: string;
  gptTop_p?: string;
  openaiApiToken?: string;
  isUsingRag?: boolean;
  embeddingModel?: string;
  modelSearch?: string;
  tgBusinessConnectionId?: string;
  avitoClientId?: string;
  avitoClientSecret?: string;
  avitoUserId?: string;
  timeCreated?: string;

  prompts: Array<Prompt>;
  vectorCollections: Array<VectorCollection>;
  users: Array<User>;
}

export interface Prompt {
  id: number;
  name: string;
  type: string;
  content: string;
  timestamp: string;
  projectId: number;
}

export interface VectorCollection {
  id: number;
  name: string;
  description: string;
  type: string;
  timestamp: string;
  projectId: number;
}

export interface User {
  userId: number;
  name: string;
  sourceCreation: string;
  avitoId: string;
  tgId: string;
  otherId: string;
  projectId: number;
  timeCreated: string;
}

export interface Property {
  id: number;
  name: string;
  key: string;
  type: string;
  isEditable: boolean;
  options?: string[];
}
