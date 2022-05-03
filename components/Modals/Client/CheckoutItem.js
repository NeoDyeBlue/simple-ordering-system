import styles from "./CheckoutItem.module.scss";
import Image from "next/image";

export default function CheckoutItem(props) {
  return (
    <li className={styles["checkout-item"]}>
      <div className={styles["checkout-item__image-wrap"]}>
        <Image
          src={props.phone.image}
          alt="model-image"
          layout="fill"
          className={styles["checkout-item__image"]}
        />
      </div>
      <div className={styles["checkout-item__info-wrap"]}>
        <h2 className={styles["checkout-item__name"]}>{props.phone.name}</h2>
        <div className={styles["checkout-item__selected-variation"]}>
          <p className={styles["checkout-item__selected-variation-text"]}>
            {props.variation.rom >= 1000
              ? `${props.variation.rom / 1000}TB`
              : `${props.variation.rom}GB`}{" "}
            / {props.variation.ram}GB
          </p>
        </div>
        <div className={styles["checkout-item__selected-color"]}>
          <div
            style={{ backgroundColor: `${props.color.hexValue}` }}
            className={styles["checkout-item__selected-color-circ"]}
          ></div>
          <p className={styles["checkout-item__selected-color-text"]}>
            {props.color.colorName}
          </p>
        </div>
        <p className={styles["checkout-item__price"]}>
          ₱{props.variation.price.toLocaleString()}
        </p>
      </div>
    </li>
  );
}
