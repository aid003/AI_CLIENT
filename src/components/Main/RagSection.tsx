import { Project, VectorCollection } from "@/types";
import styles from "./RagSection.module.css";
import { FaFileAlt } from "react-icons/fa";
import { useEffect, useState } from "react";

const RagSection = ({
  project,
  revalidateData,
}: {
  project: Project | null;
  revalidateData: () => void;
}) => {
  const [collectionData, setCollectionData] = useState<{
    name: string;
    type: string;
    structure: string;
  } | null>(null);

  const [currentCollections, setCurrentCollections] = useState<
    VectorCollection[] | null
  >(null);

  const [collectionForDelete, setCollectionForDelete] = useState<number | null>(
    null
  );

  const [collectionForUpload, setCollectionForUpload] = useState<{
    name: string;
    structure: string;
  } | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function getVectorCollections() {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}get-project/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: project?.id,
          }),
        }
      );

      const data: Project = await res.json();

      setCurrentCollections(data.vectorCollections);
      revalidateData();
    }

    getVectorCollections();
  }, [collectionData?.type, project?.id, collectionForDelete, revalidateData]);

  async function updateRagStatus() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}update-properties/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project?.id,
        propertyName: "isUsingRag",
        changeValue: !Boolean(project?.isUsingRag),
      }),
    });
    revalidateData();
  }

  async function createVectorCollections() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}create-vector-collection/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: collectionData?.name ? collectionData.name : null,
        description: null,
        type: collectionData?.type ? collectionData.type : null,
        projectId: project?.id,
        structure: collectionData ? collectionData.structure : null,
      }),
    });

    setCollectionData(null);
    revalidateData();
  }

  async function deleteVectorCollections() {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}delete-vector-collection/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId: project?.id,
        collectionId: collectionForDelete,
      }),
    });

    setCollectionForDelete(null);
    revalidateData();
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "collectionName",
      collectionForUpload ? collectionForUpload.name.toString() : ""
    );
    formData.append(
      "collectionStructure",
      collectionForUpload ? collectionForUpload.structure.toString() : ""
    );

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setMessage("File uploaded successfully!");
      } else {
        setMessage("File upload failed.");
      }
    } catch {
      setMessage("An error occurred while uploading the file.");
    }
  };

  return (
    <div className={styles.ragContainer}>
      <div className={styles.controlContainer}>
        <button
          className={styles.buttonUpdateStatus}
          onClick={updateRagStatus}
          style={
            project?.isUsingRag
              ? { backgroundColor: "rgb(39, 16, 16)" }
              : { backgroundColor: "rgb(12, 37, 22)" }
          }
        >
          {project?.isUsingRag ? "Отключить" : "Включить"}
        </button>
      </div>

      <div className={styles.createCollectionContainer}>
        <h3 className={styles.headingCreateCollection}>
          Создать векторную коллекцию
        </h3>
        <div className={styles.controlBlockContainer}>
          <input
            placeholder="Название"
            value={collectionData?.name || ""}
            onChange={(e) => {
              setCollectionData({
                ...collectionData,
                name: e.target.value.trim(),
                type: collectionData?.type || "",
                structure: "",
              });
            }}
            className={styles.createInput}
          />
          {collectionData?.name && (
            <div style={{ display: "flex", flexDirection: "row" }}>
              <select
                style={{ marginLeft: "3%" }}
                onChange={(e) => {
                  setCollectionData({
                    ...collectionData,
                    type: e.target.value,
                  });
                }}
                className={styles.createInput}
              >
                <option value={"default"}>Целевая площадка</option>
                <option value={"default"}>По умолчанию</option>
                <option value={"avito"}>Авито</option>
                <option value={"telegram"}>Telegram</option>
              </select>
              <select
                style={{ marginLeft: "3%" }}
                onChange={(e) => {
                  setCollectionData({
                    ...collectionData,
                    structure: e.target.value,
                  });
                }}
                className={styles.createInput}
              >
                <option value={"empty"}>Тип коллекции</option>
                <option value={"empty"}>Пустая</option>
                <option value={"properties"}>С свойствами</option>
              </select>
            </div>
          )}

          {collectionData?.name && (
            <button
              onClick={createVectorCollections}
              className={styles.createButton}
            >
              Сохранить
            </button>
          )}
        </div>
      </div>
      {currentCollections && currentCollections.length > 0 && (
        <div className={styles.createCollectionContainer}>
          <p className={styles.headingCreateCollection}>
            Удалить векторную коллекцию
          </p>
          <div className={styles.controlBlockContainer}>
            <select
              onChange={(e) => {
                setCollectionForDelete(Number(e.target.value));
              }}
              className={styles.createInput}
            >
              <option value={0}>Выбрать коллекцию</option>
              {currentCollections?.map((collection: VectorCollection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
            {collectionForDelete && collectionForDelete !== 0 ? (
              <button
                onClick={deleteVectorCollections}
                className={styles.createButton}
              >
                Удалить
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      {currentCollections && currentCollections.length > 0 && (
        <div className={styles.createCollectionContainer}>
          <p className={styles.headingCreateCollection}>
            Загрузить данные для дополненой генерации
          </p>
          <div className={styles.controlBlockContainer}>
            <select
              onChange={(e) => {
                setCollectionForUpload({
                  name: e.target.value,
                  structure: collectionForUpload?.structure || "",
                });
              }}
              className={styles.createInput}
            >
              <option value={0}>Выбрать коллекцию</option>
              {currentCollections?.map((collection: VectorCollection) => (
                <option key={collection.id} value={collection.name}>
                  {collection.name}
                </option>
              ))}
            </select>
            {collectionForUpload ? (
              <div style={{ display: "flex", alignItems: "center" }}>
                <select
                  onChange={(e) => {
                    setCollectionForUpload({
                      name: collectionForUpload?.name || "",
                      structure: e.target.value,
                    });
                  }}
                  style={{ marginLeft: "3%" }}
                  className={styles.createInput}
                >
                  <option value={"empty"}>Тип коллекции</option>
                  <option value={"empty"}>Пустая</option>
                  <option value={"properties"}>С свойствами</option>
                </select>
                <div className={styles.uploadContainer}>
                  <FaFileAlt className={styles.fileIcon} />
                  <input
                    type="file"
                    accept={
                      collectionForUpload.structure === "empty"
                        ? ".txt"
                        : ".json"
                    }
                    onChange={handleFileChange}
                  />
                  <button onClick={handleUpload}>Upload</button>
                  {message && <p>{message}</p>}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default RagSection;
