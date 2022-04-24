import Link from "next/link";
import Image from "next/image";
import styles from "./Featured.module.scss";

export default function Featured() {
  return (
    <div className={styles["c-featured-item"]}>
      <div className={styles["c-featured-item__image-wrap"]}>
        <Image
          className={styles["c-featured-item__image"]}
          src="/sample_images/samsung.png"
          alt="featured pic"
          layout="fill"
          priority={true}
        />
      </div>
      <div className={styles["c-featured-item__text-wrapper"]}>
        <h2 className={styles["c-featured-item__header"]}>
          Samsung Galaxy M53 5G
        </h2>
        <p className={styles["c-featured-item__subtext"]}>Available Now!</p>
        <p className={styles["c-featured-item__cta"]}>Get Here &gt;&gt;</p>
      </div>
    </div>
  );
}
