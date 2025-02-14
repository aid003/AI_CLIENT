import styles from "./PropertyComponent.module.css";
import { FaPencilAlt } from "react-icons/fa";
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import { Property } from "@/types";
import { useState } from "react";
import ModalWindowUpdate from "./ModalWindowUpdate";

const PropertyComponent = ({
  property,
  currentValue,
  projectId,
  revalidateData,
}: {
  property: Property;
  currentValue: string;
  projectId: number;
  revalidateData: () => void;
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.propertyContainer}>
          <div className={styles.propertyBox}>
            <p className={styles.name}>{property.name}:</p>
            {property.type === "boolean" ? (
              currentValue ? (
                <p className={styles.property}>
                  <IoCheckmarkDoneSharp
                    style={{ color: "green", fontSize: "25px" }}
                  />
                </p>
              ) : (
                <p className={styles.property}>
                  <IoMdClose style={{ color: "red", fontSize: "35px" }} />
                </p>
              )
            ) : (
              <p className={styles.property}>{currentValue}</p>
            )}
          </div>
          {property.isEditable && (
            <div className={styles.pensilSvg} onClick={openModal}>
              <FaPencilAlt />
            </div>
          )}
        </div>
      </div>
      <ModalWindowUpdate
        isOpen={isModalOpen}
        onClose={closeModal}
        property={property}
        currentValue={currentValue}
        projectId={projectId}
        revalidateData={revalidateData}
      />
    </>
  );
};

export default PropertyComponent;
