import Link from "next/link";
import Image from "next/image";
import styles from "./MainFeatured.module.scss";

export default function MainFeatured() {
  return (
    <div className={styles["c-main-featured"]}>
      <div className={styles["c-main-featured__image-wrap"]}>
        <Image
          className={styles["c-main-featured__image"]}
          src="/sample_images/main-featured.png"
          alt="featured pic"
          layout="fill"
          priority={true}
        />
      </div>
      <div className={styles["c-main-featured__innerwrap"]}>
        <h1 className={styles["c-main-featured__header"]}>
          New Samsung and Motorola Models Available Now!
        </h1>
        <button className={styles["c-main-featured__button"]}>shop now</button>
      </div>
    </div>
  );
}
