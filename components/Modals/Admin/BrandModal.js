import { useState, useEffect, useRef, useContext } from "react";
import useOnClickOutside from "../../../hooks/useOnClickOutside";
import Image from "next/image";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useFilePicker } from "use-file-picker";
import { AdminContext } from "../../../contexts/Admin.context";
import styles from "./AdminModal.module.scss";
import useSWR from "swr";

const initialNameErrorState = false;

export default function BrandModal() {
  const {
    brandToEdit,
    brandTableData,
    setBrandTableData,
    setBrandModalIsOpen,
  } = useContext(AdminContext);
  const modalRef = useRef(null);
  const [nameError, setNameError] = useState(initialNameErrorState);
  const [formData, setFormData] = useState({
    image: null,
    brandName: "",
  });

  useOnClickOutside(modalRef, () => setBrandModalIsOpen(false));

  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 3,
  });

  useEffect(() => {
    if (brandToEdit) {
      setFormData({
        image: brandToEdit.image,
        brandName: brandToEdit.name,
      });
    }
  }, [brandToEdit]);

  useEffect(() => {
    if (filesContent.length) {
      if (!brandToEdit) {
        setFormData((prev) => ({
          ...prev,
          image: filesContent[0].content,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          image: { ...prev.image, url: filesContent[0].content },
        }));
      }
      // setSaveDisabled(false);
    }
  }, [filesContent]);

  function inputChangeHandler(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setNameError(initialNameErrorState);

    if (brandToEdit) {
      const asArray = Object.entries(formData);
      const filtered = asArray.filter(([key, value]) => {
        if (key == "image") {
          if (value.url == brandToEdit.image.url) {
            return false;
          }
        }
        if (key == "brandName") {
          if (value == brandToEdit.name) {
            return false;
          }
        }

        return true;
      });

      const filteredBody = Object.fromEntries(filtered);

      fetch(`/api/admin/brands/${brandToEdit._id}`, {
        method: "POST",
        body: JSON.stringify(filteredBody),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBrandTableData([
              ...(!brandTableData.some((item) => {
                if (item._id == data.brand._id) return true;
              })
                ? data.brand
                : []),
              ...brandTableData.map((item) =>
                item._id == data.brand._id ? data.brand : item
              ),
            ]);
            setBrandModalIsOpen(false);
          } else {
            setNameError(data.exists);
          }
        })
        .catch((err) => console.log(err));
    } else {
      fetch(`/api/admin/brands`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setBrandTableData([data.brand, ...brandTableData]);
            setBrandModalIsOpen(false);
          } else {
            setNameError(data.exists);
          }
        })
        .catch((err) => console.log(err));
    }
  }

  return (
    <div className={styles["modal"]}>
      <div ref={modalRef} className={styles["modal__wrap"]}>
        <div className={styles["modal__header-wrap"]}>
          <h2 className={styles["modal__name"]}>
            {brandToEdit ? "edit brand" : "add brand"}
          </h2>
          <button
            onClick={() => setBrandModalIsOpen(false)}
            className={styles["modal__close-button"]}
          >
            <CloseOutlinedIcon className={styles["modal__close-button-icon"]} />
          </button>
        </div>
        <form className={styles["form"]} onSubmit={handleSubmit}>
          <div className={styles["form__img-selector-wrap"]}>
            <button
              type="button"
              className={styles["form__img-selector-button"]}
              onClick={() => openFileSelector()}
            >
              {brandToEdit && formData.image ? (
                <Image
                  className={styles["form__selected-img"]}
                  src={formData.image.url}
                  alt="brand image"
                  layout="fixed"
                  width={120}
                  height={120}
                />
              ) : !brandToEdit && formData.image ? (
                <Image
                  className={styles["form__selected-img"]}
                  src={formData.image}
                  alt="brand image"
                  layout="fixed"
                  width={120}
                  height={120}
                />
              ) : (
                <AddPhotoAlternateOutlinedIcon
                  className={styles["form__img-selector-button-icon"]}
                />
              )}
            </button>
            {errors.length ? (
              <div className={styles["form__img-errors-wrap"]}>
                <p
                  className={`${styles["form__error"]} ${styles["form__error--centered"]}`}
                >
                  <span className={styles["form__error-icon-wrap"]}>
                    <ErrorOutlinedIcon className={styles["form__error-icon"]} />
                  </span>
                  {errors[0].fileSizeToolarge &&
                    "File is too large, please choose a file that is less than 3mb"}
                  {errors[0].readerError &&
                    "Problem occured while reading file!"}
                  {errors[0].maxLimitExceeded && "Too many files"}
                </p>
              </div>
            ) : null}
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="brandName">
              Brand Name
            </label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              required
              placeholder="Enter brand name"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
            {nameError && (
              <div className={styles["form__input-error-wrap"]}>
                <p className={`${styles["form__error"]}`}>
                  <span className={styles["form__error-icon-wrap"]}>
                    <ErrorOutlinedIcon className={styles["form__error-icon"]} />
                  </span>
                  Brand name already exists
                </p>
              </div>
            )}
          </div>
          <div className={styles["form__buttons-wrap"]}>
            {brandToEdit ? (
              <button
                type="submit"
                disabled={
                  !(
                    (formData.image &&
                      formData.image.url !== brandToEdit.image.url) ||
                    (formData.brandName.length &&
                      formData.brandName !== brandToEdit.name)
                  )
                }
                className={styles["form__submit-button"]}
              >
                Save Changes
              </button>
            ) : (
              <button
                type="submit"
                disabled={!(filesContent.length && formData.brandName.length)}
                className={styles["form__submit-button"]}
              >
                Add Brand
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
