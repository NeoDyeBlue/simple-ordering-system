import { useState, useEffect, useRef, useContext } from "react";
import useOnClickOutside from "../../../utils/useOnClickOutside";
import Image from "next/image";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useFilePicker } from "use-file-picker";
import { AdminContext } from "../../../contexts/Admin.context";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import styles from "./AdminModal.module.scss";
import useSWR, { mutate } from "swr";

const initialNameErrorState = false;
const initialFormData = {
  image: null,
  modelName: "",
  brand: "",
  variations: [{ rom: "", ram: "", price: "", quantity: "" }],
  colors: [{ colorName: "", hexValue: "" }],
  os: "",
  screenSizeInches: "",
  screenResolution: "",
  batteryCapacity: "",
  batteryType: "",
  cameraMain: "",
  cameraResolution: "",
  chipset: "",
  cpu: "",
  gpu: "",
  usb: "",
  cardSlot: "",
  sensors: "",
  network: "",
};

export default function ModelModal() {
  const { modelToEdit, setModelModalIsOpen } = useContext(AdminContext);
  const modalRef = useRef(null);
  // const [brandNames, setBrandNames] = useState([]);
  const [nameError, setNameError] = useState(initialNameErrorState);
  const [formData, setFormData] = useState(initialFormData);

  function handleInputVariationChange(event, index) {
    const { value, name } = event.target;
    setFormData((prev) => ({
      ...prev,
      variations: [
        ...prev.variations.map((item, idx) =>
          idx !== index ? item : { ...item, [name]: value }
        ),
      ],
    }));
  }

  function addVariation() {
    setFormData((prev) => ({
      ...prev,
      variations: [
        ...prev.variations,
        { rom: "", ram: "", price: "", quantity: "" },
      ],
    }));
  }

  function removeVariation(index) {
    setFormData((prev) => ({
      ...prev,
      variations: [...prev.variations.filter((item, idx) => idx !== index)],
    }));
  }

  const variationInputs = formData.variations.map((variation, index) => (
    <tr key={index} className={styles["form__table-row"]}>
      <td className={styles["form__td"]}>
        <input
          className={styles["form__input"]}
          required
          type="number"
          min={0}
          value={variation.rom}
          name="rom"
          onChange={(e) => {
            handleInputVariationChange(e, index);
          }}
          placeholder="ROM"
        ></input>
      </td>
      <td className={styles["form__td"]}>
        <input
          className={styles["form__input"]}
          required
          type="number"
          min={0}
          value={variation.ram}
          name="ram"
          onChange={(e) => {
            handleInputVariationChange(e, index);
          }}
          placeholder="RAM"
        ></input>
      </td>
      <td className={styles["form__td"]}>
        <input
          className={styles["form__input"]}
          required
          type="number"
          min={0}
          value={variation.price}
          name="price"
          onChange={(e) => {
            handleInputVariationChange(e, index);
          }}
          placeholder="Price"
        ></input>
      </td>
      <td className={styles["form__td"]}>
        <input
          className={styles["form__input"]}
          required
          type="number"
          min={0}
          value={variation.quantity}
          name="quantity"
          onChange={(e) => {
            handleInputVariationChange(e, index);
          }}
          placeholder="Quantity"
        ></input>
      </td>
      <td className={styles["form__td"]}>
        <button
          disabled={!(formData.variations.length > 1)}
          type="button"
          className={styles["form__table-button"]}
          onClick={() => removeVariation(index)}
        >
          <RemoveOutlinedIcon className={styles["form__table-button--icon"]} />
        </button>
      </td>
    </tr>
  ));

  function handleInputColorChange(event, index) {
    const { value, name } = event.target;
    setFormData((prev) => ({
      ...prev,
      colors: [
        ...prev.colors.map((item, idx) =>
          idx !== index ? item : { ...item, [name]: value }
        ),
      ],
    }));
  }

  function addColor() {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors, { colorName: "", hexValue: "" }],
    }));
  }

  function removeColor(index) {
    setFormData((prev) => ({
      ...prev,
      colors: [...prev.colors.filter((item, idx) => idx !== index)],
    }));
  }

  const colorInputs = formData.colors.map((color, index) => (
    <tr key={index} className={styles["form__table-row"]}>
      <td className={styles["form__td"]}>
        <input
          className={styles["form__input"]}
          required
          name="colorName"
          value={color.colorName}
          onChange={(e) => {
            handleInputColorChange(e, index);
          }}
          placeholder="Color Name"
        ></input>
      </td>
      <td className={`${styles["form__td"]} ${styles["form__td--flex-row"]}`}>
        <div
          style={{ backgroundColor: color.hexValue ? color.hexValue : "white" }}
          className={styles["form__color-indicator"]}
        ></div>
        <input
          className={styles["form__input"]}
          required
          name="hexValue"
          value={color.hexValue}
          onChange={(e) => {
            handleInputColorChange(e, index);
          }}
          placeholder="#fff"
        ></input>
      </td>
      <td className={styles["form__td"]}>
        <button
          disabled={!(formData.colors.length > 1)}
          onClick={() => removeColor(index)}
          type="button"
          className={styles["form__table-button"]}
        >
          <RemoveOutlinedIcon className={styles["form__table-button--icon"]} />
        </button>
      </td>
    </tr>
  ));

  useOnClickOutside(modalRef, () => setModelModalIsOpen(false));

  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 3,
  });

  const { data: brandNames, error } = useSWR("/api/admin/brands");

  // useEffect(() => {
  //   fetch("/api/admin/phones/brand")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setBrandNames(data.brands);
  //     })
  //     .catch((err) => console.log(err));
  // }, [brandNames]);

  useEffect(() => {
    if (modelToEdit) {
      setFormData({
        modelName: modelToEdit.name,
        image: modelToEdit.image,
        brand: modelToEdit.brand._id,
        variations: modelToEdit.variations,
        colors: modelToEdit.colors,
        os: modelToEdit.specs.operatingSystem,
        screenSizeInches: modelToEdit.specs.screenSize.inches,
        screenResolution: modelToEdit.specs.screenSize.resolution,
        batteryCapacity: modelToEdit.specs.battery.capacity,
        batteryType: modelToEdit.specs.battery.type,
        cameraMain: modelToEdit.specs.camera.main,
        cameraResolution: modelToEdit.specs.camera.resolution,
        chipset: modelToEdit.specs.chipset,
        cpu: modelToEdit.specs.cpu,
        gpu: modelToEdit.specs.gpu,
        usb: modelToEdit.specs.usb,
        cardSlot: modelToEdit.specs.cardSlot,
        sensors: modelToEdit.specs.sensors,
        network: modelToEdit.specs.network,
      });
    }

    return () => {
      setFormData(initialFormData);
    };
  }, [modelToEdit]);

  useEffect(() => {
    if (filesContent.length) {
      if (!modelToEdit) {
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
    }
  }, [filesContent, modelToEdit]);

  function inputChangeHandler(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const brandOptions = brandNames?.brands?.map((brand, index) => (
    <option className={styles["form__option"]} key={index} value={brand._id}>
      {brand.name}
    </option>
  ));

  function handleSubmit(event) {
    event.preventDefault();
    setNameError(initialNameErrorState);

    if (modelToEdit) {
      const asArray = Object.entries(formData);
      const filtered = asArray.filter(([key, value]) => {
        if (key == "image") {
          if (value.url == modelToEdit.image.url) {
            return false;
          }
        }
        if (key == "modelName") {
          if (value == modelToEdit.name) {
            return false;
          }
        }

        return true;
      });

      const filteredBody = Object.fromEntries(filtered);
      console.log(modelToEdit._id);
      fetch(`/api/admin/models/${modelToEdit._id}`, {
        method: "POST",
        body: JSON.stringify(filteredBody),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data.phone._id);
          if (data.success) {
            mutate("/api/admin/models");
            setModelModalIsOpen(false);
          } else {
            setNameError(data.exists);
          }
        })
        .catch((err) => console.log(err));
    } else {
      fetch(`/api/admin/models`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            mutate("/api/admin/models");
            setModelModalIsOpen(false);
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
            {modelToEdit ? "edit model" : "add model"}
          </h2>
          <button
            onClick={() => setModelModalIsOpen(false)}
            className={styles["modal__close-button"]}
          >
            <CloseOutlinedIcon className={styles["modal__close-button-icon"]} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className={styles["form"]}>
          <div className={styles["form__img-selector-wrap"]}>
            <button
              type="button"
              className={styles["form__img-selector-button"]}
              onClick={() => openFileSelector()}
            >
              {modelToEdit && formData.image ? (
                <Image
                  className={styles["form__selected-img"]}
                  src={formData.image.url}
                  alt="brand image"
                  layout="fixed"
                  width={120}
                  height={120}
                />
              ) : !modelToEdit && formData.image ? (
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
            <label className={styles["form__label"]} htmlFor="modelName">
              Model Name
            </label>
            <input
              type="text"
              name="modelName"
              value={formData.modelName}
              required
              placeholder="Enter model name"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
            {nameError && (
              <div className={styles["form__input-error-wrap"]}>
                <p className={`${styles["form__error"]}`}>
                  <span className={styles["form__error-icon-wrap"]}>
                    <ErrorOutlinedIcon className={styles["form__error-icon"]} />
                  </span>
                  Model name already exists
                </p>
              </div>
            )}
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="brandName">
              Brand
            </label>
            <select
              onChange={inputChangeHandler}
              required
              name="brand"
              value={formData.brand}
              className={styles["form__select"]}
            >
              <option className={styles["form__option"]} value="" disabled>
                Choose a brand...
              </option>
              {brandOptions}
            </select>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]}>Variations</label>
            <div className={styles["form__table-wrap"]}>
              <table className={styles["form__table"]}>
                <thead>
                  <tr className={styles["form__table-row-header"]}>
                    <th className={styles["form__th"]}>ROM</th>
                    <th className={styles["form__th"]}>RAM</th>
                    <th className={styles["form__th"]}>Price</th>
                    <th className={styles["form__th"]}>Quantity</th>
                    <th className={styles["form__th"]}>Action</th>
                  </tr>
                </thead>
                <tbody>{variationInputs}</tbody>
              </table>
              <button
                onClick={addVariation}
                type="button"
                className={styles["form__button"]}
              >
                <AddOutlinedIcon className={styles["form__button-icon"]} /> Add
                a variation
              </button>
            </div>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]}>Colors</label>
            <div className={styles["form__table-wrap"]}>
              <table className={styles["form__table"]}>
                <thead>
                  <tr className={styles["form__table-row-header"]}>
                    <th className={styles["form__th"]}>Color Name</th>
                    <th className={styles["form__th"]}>Hex Value</th>
                    <th className={styles["form__th"]}>Action</th>
                  </tr>
                </thead>
                <tbody>{colorInputs}</tbody>
              </table>
              <button
                onClick={addColor}
                type="button"
                className={styles["form__button"]}
              >
                <AddOutlinedIcon className={styles["form__button-icon"]} /> Add
                a Color
              </button>
            </div>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="os">
              Operating System
            </label>
            <input
              type="text"
              name="os"
              value={formData.os}
              required
              placeholder="Android, IOS, etc."
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="screenSizeInches">
              Screen Size in Inches
            </label>
            <input
              type="number"
              name="screenSizeInches"
              value={formData.screenSizeInches}
              required
              placeholder="e.g. 6.1"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="screenResolution">
              Screen resolution
            </label>
            <input
              type="text"
              name="screenResolution"
              value={formData.screenResolution}
              required
              placeholder="e.g. 1080x2408"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="batteryCapacity">
              Battery Capacity
            </label>
            <input
              type="number"
              name="batteryCapacity"
              value={formData.batteryCapacity}
              required
              placeholder="e.g. 50000"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="batteryType">
              Battery Type
            </label>
            <input
              type="text"
              name="batteryType"
              value={formData.batteryType}
              required
              placeholder="Li-Ion etc."
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="cameraMain">
              Main Camera Mega Pixel
            </label>
            <input
              type="number"
              name="cameraMain"
              value={formData.cameraMain}
              required
              placeholder="e.g. 108"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="cameraResolution">
              Camera resolution
            </label>
            <input
              type="number"
              name="cameraResolution"
              value={formData.cameraResolution}
              required
              placeholder="e.g. 2160"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="chipset">
              Chipset
            </label>
            <input
              type="text"
              name="chipset"
              value={formData.chipset}
              required
              placeholder="MediaTek, Snapdragon, etc."
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="cpu">
              CPU
            </label>
            <input
              type="text"
              name="cpu"
              value={formData.cpu}
              required
              placeholder="e.g. Octa-core"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="gpu">
              GPU
            </label>
            <input
              type="text"
              name="gpu"
              value={formData.gpu}
              required
              placeholder="e.g. Mali"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="usb">
              USB
            </label>
            <input
              type="text"
              name="usb"
              value={formData.usb}
              required
              placeholder="Micro, Type-C, etc."
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="cardSlot">
              Card Slot
            </label>
            <input
              type="text"
              name="cardSlot"
              value={formData.cardSlot}
              required
              placeholder="e.g. MicroSD"
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="sensors">
              Sensors
            </label>
            <input
              type="text"
              name="sensors"
              value={formData.sensors}
              required
              placeholder="Fingerprint, Accelerometer, etc."
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__input-wrap"]}>
            <label className={styles["form__label"]} htmlFor="network">
              Network
            </label>
            <input
              type="text"
              name="network"
              value={formData.network}
              required
              placeholder="Dual-Sim, GSM, etc."
              className={styles["form__input"]}
              onChange={inputChangeHandler}
            ></input>
          </div>
          <div className={styles["form__buttons-wrap"]}>
            {modelToEdit ? (
              <button type="submit" className={styles["form__submit-button"]}>
                Save Changes
              </button>
            ) : (
              <button
                type="submit"
                disabled={!filesContent.length}
                className={styles["form__submit-button"]}
              >
                Add Model
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
