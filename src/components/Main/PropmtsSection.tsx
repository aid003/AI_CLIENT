import { Project } from "@/types";
import styles from "./PromptsSection.module.css";
import { useState, useMemo, useEffect } from "react";

const PromptsSection = ({
  project,
  revalidateData,
}: {
  project: Project;
  revalidateData: () => void;
}) => {
  const [promptForUpdate, setPromptForUpdate] = useState<{
    id: number;
    type: string;
    content: string;
  } | null>(null);
  const [currentTypeForCreate, setCurrentTypeForCreate] = useState<string>("");
  const [currentPromptForCreate, setCurrentPromptForCreate] =
    useState<string>("");
  const [currentPromptForDelete, setCurrentPromptForDelete] = useState<{
    id: number;
    type: string;
  } | null>(null);

  const promptTypes = useMemo(
    () => Array.from(new Set(project.prompts.map((prompt) => prompt.type))),
    [project.prompts],
  );

  useEffect(() => {
    if (promptForUpdate?.type) {
      const foundPrompt = project.prompts.find(
        (item) => item.type === promptForUpdate.type,
      );
      if (foundPrompt) {
        setPromptForUpdate({
          id: foundPrompt.id,
          type: foundPrompt.type,
          content: foundPrompt.content,
        });
      }
    }
  }, [promptForUpdate?.type, project.prompts]);

  const updatePrompt = async () => {
    if (!promptForUpdate) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}update-prompt/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project?.id,
          id: promptForUpdate.id,
          type: promptForUpdate.type,
          text: promptForUpdate.content,
        }),
      });
      revalidateData();
      alert("Промпт успешно обновлён!");
    } catch {
      alert("Ошибка при обновлении промпта");
    }
  };

  const createPrompt = async () => {
    if (!currentTypeForCreate || !currentPromptForCreate) return;
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}create-prompt/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project?.id,
          name: "defaultName",
          type: currentTypeForCreate,
          content: currentPromptForCreate,
        }),
      });
      setCurrentTypeForCreate("");
      setCurrentPromptForCreate("");
      revalidateData();
      alert("Промпт успешно создан!");
    } catch {
      alert("Ошибка при создании промпта");
    }
  };

  const deletePrompt = async () => {
    if (!currentPromptForDelete) return;

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}delete-prompt/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: project?.id,
          id: currentPromptForDelete.id,
        }),
      });
      setCurrentPromptForDelete(null);
      revalidateData();
      alert("Успешно удален");
    } catch {
      alert("Ошибка удаления");
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.updateContainer}>
        <div className={styles.selectTypeContainer}>
          <p className={styles.heading}>Изменить промпт</p>
          <select
            className={styles.select}
            onChange={(e) => {
              const selectedType = e.target.value;
              const foundPrompt = project.prompts.find(
                (item) => item.type === selectedType,
              );
              setPromptForUpdate(
                foundPrompt || { id: 0, type: selectedType, content: "" },
              );
            }}
          >
            <option value="">Тип промпта</option>
            {promptTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {promptForUpdate && promptForUpdate.type && (
          <div className={styles.updatePromptContainer}>
            <div className={styles.inputContainer}>
              <textarea
                className={styles.input}
                value={promptForUpdate.content}
                onChange={(e) =>
                  setPromptForUpdate({
                    ...promptForUpdate,
                    content: e.target.value,
                  })
                }
              />
              {promptForUpdate.content && (
                <button onClick={updatePrompt} className={styles.button}>
                  Сохранить
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      <div className={styles.createContainer}>
        <div className={styles.selectTypeContainer}>
          <p className={styles.heading}>Создать промпт</p>
          <select
            className={styles.select}
            value={currentTypeForCreate}
            onChange={(e) => setCurrentTypeForCreate(e.target.value)}
          >
            <option value="">Тип промпта</option>
            <option value="default">По умолчанию</option>
            <option value="avito">Авито</option>
            <option value="telegram">Telegram</option>
          </select>
        </div>
        {currentTypeForCreate && (
          <div className={styles.textContainer}>
            <textarea
              className={styles.input}
              value={currentPromptForCreate}
              onChange={(e) => setCurrentPromptForCreate(e.target.value)}
            />
            {currentPromptForCreate && (
              <div className={styles.createButtonContainer}>
                <button onClick={createPrompt} className={styles.button}>
                  Сохранить
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <div className={styles.updateContainer}>
        <div className={styles.selectTypeContainer}>
          <p className={styles.heading}>Удалить промпт</p>
          <select
            className={styles.select}
            onChange={(e) => {
              const selectedType = e.target.value;
              const foundPrompt = project.prompts.find(
                (item) => item.type === selectedType,
              );
              setCurrentPromptForDelete(
                foundPrompt || { id: 0, type: selectedType },
              );
            }}
          >
            <option value="">Тип промпта</option>
            {promptTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        {currentPromptForDelete && currentPromptForDelete.type && (
          <div className={styles.updatePromptContainer}>
            <div className={styles.inputContainer}>
              <button onClick={deletePrompt} className={styles.button}>
                Удалить
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptsSection;
