import { Project } from "@/types";
import { FiCopy } from "react-icons/fi";
import styles from "./TelegramSection.module.css";
import { useState } from "react";

const TelegramSection = ({ project }: { project: Project | null }) => {
  const [currentText, setCurrentText] = useState<string>("Копировать текст");

  const textToCopy = `${process.env.NEXT_PUBLIC_TELEGRAM_BUSINESS_CONNECTION}${project?.id}`;
  const handleCopy = async () => {
    try {
      setCurrentText("Скопировано");
      await navigator.clipboard.writeText(textToCopy);

      setTimeout(() => {
        setCurrentText("Копировать текст");
      }, 3000);
    } catch (error) {
      console.error("Ошибка при копировании текста:", error);
    }
  };

  return (
    <div>
      <div className={styles.container}>
        <p className={styles.text}>{textToCopy}</p>
        <button className={styles.button} onClick={handleCopy}>
          <FiCopy className={styles.icon} /> {currentText}
        </button>
      </div>
    </div>
  );
};

export default TelegramSection;
