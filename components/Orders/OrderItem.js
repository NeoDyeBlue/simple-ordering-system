import styles from "./OrderItem.module.scss";
import Image from "next/image";

export default function OrderItem(props) {
  const orderVariation = props.phone.variations.find(
    (variation) => variation._id == props.variation
  );
  const orderColor = props.phone.colors.find(
    (color) => color._id == props.color
  );
  return (
    <li className={styles["order-item"]}>
      <div className={styles["order-item__image-wrap"]}>
        <Image
          src={props.phone.image.url}
          alt="model-image"
          layout="fill"
          className={styles["order-item__image"]}
        />
      </div>
      <div className={styles["order-item__flex-wrap"]}>
        <div className={styles["order-item__info-wrap"]}>
          <h2 className={styles["order-item__name"]}>{props.phone.name}</h2>
          <div className={styles["order-item__selected-variation"]}>
            <p className={styles["order-item__selected-variation-text"]}>
              {orderVariation.rom >= 1000
                ? `${orderVariation.rom / 1000}TB`
                : `${orderVariation.rom}GB`}{" "}
              / {orderVariation.ram}GB
            </p>
          </div>
          <div className={styles["order-item__selected-color"]}>
            <div
              style={{ backgroundColor: `${orderColor.hexValue}` }}
              className={styles["order-item__selected-color-circ"]}
            ></div>
            <p className={styles["order-item__selected-color-text"]}>
              {orderColor.colorName}
            </p>
          </div>
        </div>
        <p className={styles["order-item__price"]}>
          ₱{orderVariation.price.toLocaleString()}
        </p>
      </div>
    </li>
  );
}
