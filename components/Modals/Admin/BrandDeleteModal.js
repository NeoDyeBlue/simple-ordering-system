import { useRef, useContext } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdminContext } from "../../../contexts/Admin.context";
import styles from "./AdminModal.module.scss";

export default function BrandDeleteModal() {
  const {
    brandToDelete,
    brandTableData,
    setBrandTableData,
    setBrandDeleteModalIsOpen,
  } = useContext(AdminContext);
  const modalRef = useRef(null);

  useOnClickOutside(modalRef, () => setBrandDeleteModalIsOpen(false));
  function deleteHandler() {
    fetch(`/api/admin/phones/brand/${brandToDelete._id}`, {
      method: "DELETE",
      body: JSON.stringify(brandToDelete.image),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deleted) {
          setBrandTableData(
            brandTableData.filter((data) => data._id != brandToDelete._id)
          );
          setBrandDeleteModalIsOpen(false);
        }
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className={styles["modal"]}>
      <div ref={modalRef} className={styles["modal__wrap"]}>
        <div className={styles["modal__header-wrap"]}>
          <h2 className={styles["modal__name"]}>
            Delete {brandToDelete.name}?
          </h2>
          <button
            onClick={() => setBrandDeleteModalIsOpen(false)}
            className={styles["modal__close-button"]}
          >
            <CloseOutlinedIcon className={styles["modal__close-button-icon"]} />
          </button>
        </div>
        <p className={styles["modal__description"]}>
          Deleting this brand will also remove all the models associated with
          it!
        </p>
        <div className={styles["modal__buttons-wrap"]}>
          <button
            onClick={() => setBrandDeleteModalIsOpen(false)}
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
