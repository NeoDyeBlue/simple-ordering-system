import { useRef, useContext } from "react";
import useOnClickOutside from "../../../utils/useOnClickOutside";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { AdminContext } from "../../../contexts/Admin.context";
import styles from "./AdminModal.module.scss";
import { mutate } from "swr";

export default function BrandDeleteModal() {
  const { brandToDelete, setBrandDeleteModalIsOpen } = useContext(AdminContext);
  const modalRef = useRef(null);

  useOnClickOutside(modalRef, () => setBrandDeleteModalIsOpen(false));
  function deleteHandler() {
    fetch(`/api/admin/brands/${brandToDelete._id}`, {
      method: "DELETE",
      body: JSON.stringify(brandToDelete.image),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.deleted) {
          mutate("/api/admin/brands");
          mutate("/api/admin/models");
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
