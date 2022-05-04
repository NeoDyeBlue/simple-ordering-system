import styles from "./DropMenu.module.scss";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import Link from "next/link";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { useRouter } from "next/router";
import { mutate } from "swr";

export default function ClientDropMenu(props) {
  const router = useRouter();
  function logout() {
    props.onItemClick();
    fetch("/api/auth/logout").finally(() => {
      router.push("/login");
      mutate("/api/user");
    });
  }
  return (
    <div className={styles["drop-menu"]}>
      <ul className={styles["drop-menu__list"]}>
        <li className={styles["drop-menu__item"]}>
          <Link href={"/"}>
            <a
              className={styles["drop-menu__link"]}
              onClick={props.onItemClick}
            >
              <div className={styles["drop-menu__icon-wrapper"]}>
                <HomeOutlinedIcon className={styles["drop-menu__icon"]} />
              </div>
              <p className={styles["drop-menu__item-text"]}>Home</p>
            </a>
          </Link>
        </li>
        <li className={styles["drop-menu__item"]}>
          <Link href={"/account"}>
            <a
              className={styles["drop-menu__link"]}
              onClick={props.onItemClick}
            >
              <div className={styles["drop-menu__icon-wrapper"]}>
                <AccountCircleOutlinedIcon
                  className={styles["drop-menu__icon"]}
                />
              </div>
              <p className={styles["drop-menu__item-text"]}>Account</p>
            </a>
          </Link>
        </li>
        <li className={styles["drop-menu__item"]}>
          <Link href={"/orders"}>
            <a
              className={styles["drop-menu__link"]}
              onClick={props.onItemClick}
            >
              <div className={styles["drop-menu__icon-wrapper"]}>
                <ShoppingBagOutlinedIcon
                  className={styles["drop-menu__icon"]}
                />
              </div>
              <p className={styles["drop-menu__item-text"]}>Orders</p>
            </a>
          </Link>
        </li>
      </ul>
      <div className={styles["drop-menu__account-actions"]}>
        {!props.authData?.authenticated ? (
          <>
            <Link href={"/login"}>
              <a
                className={`${styles["drop-menu__button-link"]} ${styles["drop-menu__button-link--no-fill"]}`}
                onClick={props.onItemClick}
              >
                login
              </a>
            </Link>
            <Link href={"/signup"}>
              <a
                className={`${styles["drop-menu__button-link"]}`}
                onClick={props.onItemClick}
              >
                sign up
              </a>
            </Link>
          </>
        ) : (
          <Link href={"/logout"}>
            <a
              className={`${styles["drop-menu__button-link"]}`}
              onClick={logout}
            >
              logout
            </a>
          </Link>
        )}
      </div>
    </div>
  );
}
