import Image from "next/image";
import Link from "next/link";
import styles from "./Card.module.scss";

export default function Card(props) {
  return (
    <div className={styles["c-card"]}>
      <div className={styles["c-card__tag"]}>
        <p className={styles["c-card__quantity"]}>1 left</p>
      </div>
      <div className={styles["c-card__image-wrap"]}>
        <Image
          className={styles["c-card__image"]}
          src="/sample_images/samsung.png"
          alt="phone pic"
          layout="fill"
          priority={true}
        />
      </div>
      <h2 className={styles["c-card__product-name"]}>Samsung Galaxy M53 5G</h2>
      <span className={styles["c-card__storages"]}>
        <span className={styles["c-card__storage-pill"]}>6GB / 128GB</span>
      </span>
      <p className={styles["c-card__price"]}>From ₱14, 340 to ₱15, 774</p>
    </div>
  );
}
