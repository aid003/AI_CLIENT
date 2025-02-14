"use client";
import { Suspense, useState } from "react";
import ProjectsList from "./ProjectsList";
import ProjectPage from "./ProjectPage";
import styles from "./MainContainer.module.css";
import ProjectsListSkeleton from "./ProjectsListSkeleton";
import ProjectsPageSkeleton from "./ProjectsPageSkeleton";
import { CiSquarePlus } from "react-icons/ci";
import ModalWindow from "../Base/ModalWindow";

export default function MainContainer() {
  const [currentProjectId, setCurrentProjectId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.leftContainer}>
          <div className={styles.headingContainer}>
            <h1 className={styles.heading}>Проекты</h1>
            <div className={styles.iconContainer}>
              <CiSquarePlus onClick={openModal} className={styles.icon} />
            </div>
          </div>
          <Suspense fallback={<ProjectsListSkeleton />}>
            <ProjectsList updateCurrentProjectId={setCurrentProjectId} />
          </Suspense>
        </div>
        <div className={styles.rightContainer}>
          <Suspense fallback={<ProjectsPageSkeleton />}>
            {currentProjectId !== null && (
              <ProjectPage currentProjectId={currentProjectId} />
            )}
          </Suspense>
        </div>
      </div>
      {isModalOpen && <ModalWindow isOpen={isModalOpen} onClose={closeModal} />}
    </>
  );
}
