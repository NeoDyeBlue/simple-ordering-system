import styles from "./Categories.module.scss";
import Image from "next/image";

export default function CategoryItem(props) {
  return (
    <li className={styles["c-category"]}>
      <div className="c-category__image-icon-wrap">
        <Image
          className={styles["c-category__image"]}
          src={props.image}
          alt="category pic"
          layout="fill"
          priority={true}
        />
      </div>
      <p className={styles["c-category__name"]}>{props.name}</p>
    </li>
  );
}
