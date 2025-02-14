import { useState } from "react";
import styles from "./ModalWindow.module.css";

const ModalWindow = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [projectName, setProjectName] = useState<string | null>(null);

  async function sendData(projectName: string | null) {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}create-project/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
        }),
      });

      onClose();
    } catch (error) {
      console.log(error);
    }
  }

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✖
        </button>
        <div className={styles.mainContainer}>
          <h1 className={styles.heading}>Название проекта</h1>
          <div className={styles.inputContainer}>
            <input
              onChange={(e) => {
                setProjectName(e.target.value);
              }}
              className={styles.input}
            />
          </div>
          {projectName && (
            <button
              onClick={() => sendData(projectName)}
              className={styles.button}
            >
              Создать
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalWindow;
