import { ReactNode } from "react";
import styles from "./Header.module.css";
import "./globals.css";

type HeaderProps = {
  children: ReactNode;
};

export default function Header({ children }: HeaderProps) {
  return (
    <html>
      <body className={styles.body}>
        <header className={styles.header}>
          <h1 className={styles.headerText}>Настройка проекта</h1>
        </header>
        <div className={styles.bodyContainer}>{children}</div>
      </body>
    </html>
  );
}
