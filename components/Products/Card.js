import Image from "next/image";
import Link from "next/link";
import styles from "./Card.module.scss";

export default function Card(props) {
  const variationBadges = props.variations.map((variation, index) => (
    <span key={index} className={styles["c-card__memory"]}>
      {variation.rom >= 1000
        ? `${variation.rom / 1000}TB`
        : `${variation.rom}GB`}{" "}
      / {variation.ram}GB
    </span>
  ));
  const prices = [...props.variations.map((variation) => variation.price)];
  const totalQuantity = [
    ...props.variations.map((variation) => variation.quantity),
  ].reduce((a, b) => a + b, 0);
  return (
    <div className={styles["c-card"]}>
      {totalQuantity <= 10 && (
        <div className={styles["c-card__tag"]}>
          <p className={styles["c-card__quantity"]}>{totalQuantity}</p>
        </div>
      )}
      <div className={styles["c-card__image-wrap"]}>
        <Image
          className={styles["c-card__image"]}
          src={props.image}
          alt="phone pic"
          layout="fill"
        />
      </div>
      <h2 className={styles["c-card__product-name"]}>{props.name}</h2>
      <div className={styles["c-card__badges-wrap"]}>{variationBadges}</div>
      <p className={styles["c-card__price"]}>
        {prices.length > 1
          ? `From ₱${Math.min(...prices).toLocaleString()} to ₱${Math.max(
              ...prices
            ).toLocaleString()}`
          : `₱${prices[0].toLocaleString()}`}
      </p>
    </div>
  );
}
