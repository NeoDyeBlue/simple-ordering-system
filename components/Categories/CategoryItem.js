import styles from "./Categories.module.scss";
import Image from "next/image";
import { useRouter } from "next/router";
import Link from "next/link";

export default function CategoryItem(props) {
  const router = useRouter();
  return (
    <li className={styles["c-category"]} onClick={props.onclick}>
      <Link href={`/${props.name.split(" ").join("-").toLowerCase()}`}>
        <a
          className={`${styles["c-category__link"]} ${
            router.query.brand?.split("-").join(" ").toLowerCase() ==
            props.name.toLowerCase()
              ? styles["c-category__link--active"]
              : ""
          }`}
        >
          <div className="c-category__image-icon-wrap">
            <Image
              className={styles["c-category__image"]}
              src={props.image}
              alt="category pic"
              layout="fill"
            />
          </div>
          <p className={styles["c-category__name"]}>{props.name}</p>
        </a>
      </Link>
    </li>
  );
}
