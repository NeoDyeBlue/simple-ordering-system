import styles from "./DropMenu.module.scss";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
export default function ClientDropMenu() {
  return (
    <div className={styles["drop-menu"]}>
      <ul className={styles["drop-menu__list"]}>
        <li className={styles["drop-menu__item"]}>
          <div className={styles["drop-menu__icon-wrapper"]}>
            <AccountCircleOutlinedIcon className={styles["drop-menu__icon"]} />
          </div>
          <p className={styles["drop-menu__item-text"]}>Account</p>
        </li>
        <li className={styles["drop-menu__item"]}>
          <div className={styles["drop-menu__icon-wrapper"]}>
            <ShoppingBagOutlinedIcon className={styles["drop-menu__icon"]} />
          </div>
          <p className={styles["drop-menu__item-text"]}>Orders</p>
          {/* <span className={styles["drop-menu__item-badge"]}>1</span> */}
        </li>
        <li className={styles["drop-menu__item"]}>
          <div className={styles["drop-menu__icon-wrapper"]}>
            <FavoriteOutlinedIcon className={styles["drop-menu__icon"]} />
          </div>
          <p className={styles["drop-menu__item-text"]}>Wishlist</p>
        </li>
      </ul>
      <div className={styles["drop-menu__account-actions"]}>
        <button
          className={`${styles["drop-menu__button"]} ${styles["drop-menu__button--no-fill"]}`}
        >
          sign in
        </button>
        <button className={`${styles["drop-menu__button"]}`}>sign up</button>
      </div>
    </div>
  );
}
