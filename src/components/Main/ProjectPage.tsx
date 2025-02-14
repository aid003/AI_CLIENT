"use client";
import { Project, Property } from "@/types";
import styles from "./ProjectPage.module.css";
import { useEffect, useState, useCallback, useMemo } from "react";
import PropertyComponent from "../Base/PropertyComponent";
import { Block, blocksConfig } from "./blocksConfig";
import TelegramSection from "./TelegramSection";
import RagSection from "./RagSection";
import PropmtsSection from "./PropmtsSection";

export default function ProjectPage({
  currentProjectId,
}: {
  currentProjectId: number;
}) {
  const [project, setProject] = useState<Project | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [currentBlock, setCurrentBlock] = useState<Block>({
    name: "Настройки",
    key: "settings",
  });

  const memoizedBlocks = useMemo(() => blocksConfig, []);

  const revalidateData = useCallback(async () => {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}get-project/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: currentProjectId }),
    });

    const properties = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}get-properties/`
    );
    setProject(await data.json());
    setProperties(await properties.json());
  }, [currentProjectId]);

  useEffect(() => {
    revalidateData();
  }, [currentProjectId, revalidateData]);

  return (
    <>
      <div className={styles.blockContainer}>
        {memoizedBlocks.map((block: Block) => (
          <p
            className={styles.blockItem}
            style={
              currentBlock.key === block.key
                ? {
                    backgroundColor: "white",
                    color: "black",
                    borderRadius: "5px",
                    fontWeight: "bold",
                  }
                : {}
            }
            key={block.key}
            onClick={() => {
              setCurrentBlock(block);
            }}
          >
            {block.name}
          </p>
        ))}
      </div>

      {currentBlock.key === "settings" && (
        <div className={styles.projectContainer}>
          {project &&
            properties &&
            properties.length > 0 &&
            properties.map((property: Property) => {
              const currentValue = project[property.key as keyof Project];

              if (currentValue == null) return null;

              return (
                <PropertyComponent
                  key={property.id}
                  property={property}
                  currentValue={currentValue as string}
                  projectId={project.id ?? 0}
                  revalidateData={revalidateData}
                />
              );
            })}
        </div>
      )}
      {currentBlock.key === "telegram" && <TelegramSection project={project} />}
      {currentBlock.key === "rag" && (
        <RagSection project={project} revalidateData={revalidateData} />
      )}
      {currentBlock.key === "prompts" && project && (
        <PropmtsSection
          project={project}
          revalidateData={revalidateData}
        ></PropmtsSection>
      )}
      {currentBlock.key === "users" && (
        <div className={styles.projectContainer}>users</div>
      )}
    </>
  );
}
