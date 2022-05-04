import styles from "./DropMenu.module.scss";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Link from "next/link";
import { useRouter } from "next/router";
import { mutate } from "swr";

export default function AdminDropMenu(props) {
  const router = useRouter();
  function logout() {
    props.onItemClick();
    fetch("/api/auth/logout").finally(() => {
      router.push("/login");
      mutate("/api/user");
    });
  }
  return (
    <div className={`${styles["drop-menu"]} ${styles["drop-menu--dark"]}`}>
      <ul className={styles["drop-menu__list"]}>
        <li
          className={`${styles["drop-menu__item"]} ${styles["drop-menu__item--dark"]}`}
        >
          <Link href={"/admin/account"}>
            <a
              className={`${styles["drop-menu__link"]} ${styles["drop-menu__link--dark"]}`}
              onClick={props.onItemClick}
            >
              <div className={styles["drop-menu__icon-wrapper"]}>
                <AccountCircleOutlinedIcon
                  className={`${styles["drop-menu__icon"]} ${styles["drop-menu__icon--dark"]}`}
                />
              </div>
              <p
                className={`${styles["drop-menu__link-text"]} ${styles["drop-menu__link-text--dark"]}`}
              >
                Account
              </p>
            </a>
          </Link>
        </li>
      </ul>
      <div
        className={`${styles["drop-menu__account-actions"]} ${styles["drop-menu__account-actions--dark"]}`}
      >
        <button
          className={`${styles["drop-menu__button-link"]}`}
          onClick={logout}
        >
          logout
        </button>
      </div>
    </div>
  );
}
