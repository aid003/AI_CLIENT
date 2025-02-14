"use client";
import { Project } from "@/types";
import styles from "./ProjectsList.module.css";
import { SetStateAction, Dispatch, useEffect, useState } from "react";

export default function ProjectsList({
  updateCurrentProjectId,
}: {
  updateCurrentProjectId: Dispatch<SetStateAction<number | null>>;
}) {
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [activeProjectId, setActiveProjectId] = useState<number | null>(null);

  useEffect(() => {
    async function getData() {
      const data = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}get-all-projects/`
      );
      setProjects(await data.json());
    }

    getData();
  }, []);

  function handleClickActiveProject(id: number): void {
    if (id === activeProjectId) {
      setActiveProjectId(null);
      updateCurrentProjectId(null);
    } else {
      setActiveProjectId(id);
      updateCurrentProjectId(id);
    }
  }

  return (
    <div className={styles.mainContainer}>
      <ul className={styles.ulContainer}>
        {projects?.map((project: Project) => (
          <li
            className={styles.liContainer}
            style={
              activeProjectId === project.id
                ? { backgroundColor: "aliceblue", color: "black" }
                : {}
            }
            onClick={() => {
              if (project.id !== undefined) {
                handleClickActiveProject(project.id);
              }
            }}
            key={project.id}
          >
            {project.name ? project.name.toUpperCase() : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}
