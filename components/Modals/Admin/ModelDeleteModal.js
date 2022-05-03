import { useRef, useContext } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdminContext } from "../../../contexts/Admin.context";
import styles from "./AdminModal.module.scss";
import { mutate } from "swr";

export default function ModelDeleteModal() {
  const {
    modelToDelete,
    modelTableData,
    setModelTableData,
    setModelDeleteModalIsOpen,
  } = useContext(AdminContext);
  const modalRef = useRef(null);

  useOnClickOutside(modalRef, () => setModelDeleteModalIsOpen(false));
  function deleteHandler() {
    fetch(`/api/admin/models/${modelToDelete._id}`, {
      method: "DELETE",
      body: JSON.stringify(modelToDelete.image),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deleted) {
          mutate("/api/admin/models");
          setModelDeleteModalIsOpen(false);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles["modal"]}>
      <div ref={modalRef} className={styles["modal__wrap"]}>
        <div className={styles["modal__header-wrap"]}>
          <h2 className={styles["modal__name"]}>Delete model?</h2>
          <button
            onClick={() => setModelDeleteModalIsOpen(false)}
            className={styles["modal__close-button"]}
          >
            <CloseOutlinedIcon className={styles["modal__close-button-icon"]} />
          </button>
        </div>
        <p className={styles["modal__description"]}>
          {modelToDelete.name} will be removed from the database and will not be
          retrieved!
        </p>
        <div className={styles["modal__buttons-wrap"]}>
          <button
            onClick={() => setModelDeleteModalIsOpen(false)}
            className={`${styles["modal__button"]} ${styles["modal__button--text"]} `}
          >
            Cancel
          </button>
          <button onClick={deleteHandler} className={styles["modal__button"]}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
