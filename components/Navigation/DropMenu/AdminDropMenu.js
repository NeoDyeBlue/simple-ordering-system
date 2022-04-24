import styles from "./DropMenu.module.scss";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
export default function AdminDropMenu() {
  return (
    <div className={`${styles["drop-menu"]} ${styles["drop-menu--dark"]}`}>
      <ul className={styles["drop-menu__list"]}>
        <li
          className={`${styles["drop-menu__item"]} ${styles["drop-menu__item--dark"]}`}
        >
          <div className={styles["drop-menu__icon-wrapper"]}>
            <AccountCircleOutlinedIcon
              className={`${styles["drop-menu__icon"]} ${styles["drop-menu__icon--dark"]}`}
            />
          </div>
          <p
            className={`${styles["drop-menu__item-text"]} ${styles["drop-menu__item-text--dark"]}`}
          >
            Account
          </p>
        </li>
        <li
          className={`${styles["drop-menu__item"]} ${styles["drop-menu__item--dark"]}`}
        >
          <div className={styles["drop-menu__icon-wrapper"]}>
            <LogoutOutlinedIcon
              className={`${styles["drop-menu__icon"]} ${styles["drop-menu__icon--dark"]}`}
            />
          </div>
          <p
            className={`${styles["drop-menu__item-text"]} ${styles["drop-menu__item-text--dark"]}`}
          >
            Logout
          </p>
        </li>
      </ul>
    </div>
  );
}
