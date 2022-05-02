import styles from "./DropMenu.module.scss";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Link from "next/link";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
export default function ClientDropMenu(props) {
  const matches = useMediaQuery("(min-width:768px)");
  return (
    <div className={styles["drop-menu"]}>
      <ul className={styles["drop-menu__list"]}>
        <li className={styles["drop-menu__item"]}>
          <Link href={"/account"}>
            <a className={styles["drop-menu__link"]}>
              <div className={styles["drop-menu__icon-wrapper"]}>
                <AccountCircleOutlinedIcon
                  className={styles["drop-menu__icon"]}
                />
              </div>
              <p className={styles["drop-menu__item-text"]}>Account</p>
            </a>
          </Link>
        </li>
        {!matches && (
          <>
            <li className={styles["drop-menu__item"]}>
              <Link href={"/cart"}>
                <a className={styles["drop-menu__link"]}>
                  <div className={styles["drop-menu__icon-wrapper"]}>
                    <ShoppingCartOutlinedIcon
                      className={styles["drop-menu__icon"]}
                    />
                  </div>
                  <p className={styles["drop-menu__item-text"]}>My Cart</p>
                </a>
              </Link>
            </li>
            <li className={styles["drop-menu__item"]}>
              <Link href={"/orders"}>
                <a className={styles["drop-menu__link"]}>
                  <div className={styles["drop-menu__icon-wrapper"]}>
                    <ShoppingBagOutlinedIcon
                      className={styles["drop-menu__icon"]}
                    />
                  </div>
                  <p className={styles["drop-menu__item-text"]}>Orders</p>
                </a>
              </Link>
              {/* <span className={styles["drop-menu__item-badge"]}>1</span> */}
            </li>
            <li className={styles["drop-menu__item"]}>
              <Link href={"/wishlist"}>
                <a className={styles["drop-menu__link"]}>
                  <div className={styles["drop-menu__icon-wrapper"]}>
                    <FavoriteOutlinedIcon
                      className={styles["drop-menu__icon"]}
                    />
                  </div>
                  <p className={styles["drop-menu__item-text"]}>Wishlist</p>
                </a>
              </Link>
            </li>
          </>
        )}
      </ul>
      <div className={styles["drop-menu__account-actions"]}>
        {!props.authData?.authenticated ? (
          <>
            <Link href={"/login"}>
              <a
                className={`${styles["drop-menu__button-link"]} ${styles["drop-menu__button-link--no-fill"]}`}
              >
                login
              </a>
            </Link>
            <Link href={"/signup"}>
              <a className={`${styles["drop-menu__button-link"]}`}>sign up</a>
            </Link>
          </>
        ) : (
          <Link href={"/logout"}>
            <a className={`${styles["drop-menu__button-link"]}`}>logout</a>
          </Link>
        )}
      </div>
    </div>
  );
}
