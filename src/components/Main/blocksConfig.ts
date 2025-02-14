export const blocksConfig = [
  {
    key: "settings",
    name: "Настройки",
  },
  {
    key: "telegram",
    name: "Telegram",
  },
  {
    key: "rag",
    name: "RAG",
  },
  {
    key: "prompts",
    name: "Промпты",
  },
  {
    key: "users",
    name: "Пользователи",
  },
];

export interface Block {
  key: string;
  name: string;
}
