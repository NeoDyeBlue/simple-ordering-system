import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { useState, useRef } from "react";
import useOnClickOutside from "../../utils/useOnClickOutside";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { CSSTransition } from "react-transition-group";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import ClientDropMenu from "./DropMenu/ClientDropMenu";
import styles from "./Navbar.module.scss";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useSWR from "swr";

export default function Navbar() {
  const [dropMenuIsOpen, setDropMenuIsOpen] = useState(false);
  const [inputData, setInputData] = useState("");
  const [searchBoxVisible, setSearchBoxVisible] = useState(false);
  const menuRef = useRef(null);
  const searchBoxRef = useRef(null);
  const matches = useMediaQuery("(min-width:768px)");
  useOnClickOutside(menuRef, () => setDropMenuIsOpen(false));
  useOnClickOutside(searchBoxRef, () => setSearchBoxVisible(false));
  const router = useRouter();
  const { data, error } = useSWR("/api/user", { revalidateOnMount: true });

  function handleInputChange(event) {
    setInputData(event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (inputData.length) {
      const formatted = inputData.split(" ").join("+");
      router.push(`/search?q=${formatted}`);
    }
  }
  return (
    <div className={styles["c-navbar"]}>
      <div className={styles["c-navbar__wrap"]}>
        <Link href="/">
          <a className={styles["c-navbar__logo"]}>Emphoneum</a>
        </Link>
        <form
          onSubmit={handleSubmit}
          ref={searchBoxRef}
          className={`${styles["c-navbar__searchbox-wrap"]} ${
            searchBoxVisible ? styles["c-navbar__searchbox-wrap--visible"] : ""
          }`}
        >
          <input
            className={`${styles["c-navbar__searchbox-input"]} ${
              searchBoxVisible
                ? styles["c-navbar__searchbox-input--visible"]
                : ""
            }`}
            name="search"
            value={inputData}
            autoComplete="off"
            placeholder="Search in Emphoneum"
            onChange={handleInputChange}
          />
          {searchBoxVisible && !matches ? (
            <button
              className={styles["c-navbar__button"]}
              onClick={() => setSearchBoxVisible(false)}
            >
              <CloseOutlinedIcon className={styles["c-navbar__icon"]} />
            </button>
          ) : (
            !matches && (
              <button
                className={styles["c-navbar__button"]}
                onClick={() => setSearchBoxVisible(true)}
              >
                <SearchOutlinedIcon className={styles["c-navbar__icon"]} />
              </button>
            )
          )}
          {matches && (
            <SearchOutlinedIcon
              className={`${styles["c-navbar__icon"]} ${styles["c-navbar__icon--gray"]}`}
            />
          )}
        </form>
        <div ref={menuRef} className={styles["c-navbar__menu-wrap"]}>
          {matches && (
            <ul className={styles["c-navbar__menu-list"]}>
              <li className={styles["c-navbar__menu-list-item"]}>
                <Link href="/">
                  <a className={styles["c-navbar__menu-link"]}>
                    <HomeOutlinedIcon
                      className={styles["c-navbar__menu-link-icon"]}
                    />
                  </a>
                </Link>
              </li>
              <li className={styles["c-navbar__menu-list-item"]}>
                <Link href="/orders">
                  <a className={styles["c-navbar__menu-link"]}>
                    <ShoppingBagOutlinedIcon
                      className={styles["c-navbar__menu-link-icon"]}
                    />
                  </a>
                </Link>
              </li>
              {!data?.authenticated && (
                <li
                  className={`${styles["c-navbar__menu-list-item"]} ${styles["c-navbar__menu-list-item--auth-links"]}`}
                >
                  <Link href="/login">
                    <a
                      className={`${styles["c-navbar__menu-auth-link"]} ${styles["c-navbar__menu-auth-link--no-fill"]}`}
                    >
                      Login
                    </a>
                  </Link>
                  <Link href="/signup">
                    <a className={styles["c-navbar__menu-auth-link"]}>
                      Sign Up
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          )}
          {!matches && (
            <button
              className={`${styles["c-navbar__button"]} ${
                dropMenuIsOpen ? styles["c-navbar__button--active"] : ""
              }`}
              onClick={() => setDropMenuIsOpen(!dropMenuIsOpen)}
            >
              <MenuOutlinedIcon
                className={`${styles["c-navbar__icon"]} ${
                  dropMenuIsOpen ? styles["c-navbar__icon--active"] : ""
                }`}
              />
            </button>
          )}
          {matches && data?.authenticated && (
            <button
              className={`${styles["c-navbar__button"]} ${
                dropMenuIsOpen ? styles["c-navbar__button--active"] : ""
              }`}
              onClick={() => setDropMenuIsOpen(!dropMenuIsOpen)}
            >
              <div className={styles["c-navbar__account-image-wrap"]}>
                {data?.userData?.image?.url ? (
                  <Image
                    src={data.userData.image.url}
                    alt="user pic"
                    layout="fill"
                    className={styles["c-navbar__account-image"]}
                  />
                ) : (
                  <Skeleton circle={true} width={36} height={36} />
                )}
              </div>
            </button>
          )}
          <CSSTransition
            in={dropMenuIsOpen}
            timeout={200}
            unmountOnExit
            classNames="menu-anim"
          >
            <div className={styles["c-navbar__dropmenu"]}>
              <ClientDropMenu
                authData={data}
                onItemClick={() => setDropMenuIsOpen(false)}
              />
            </div>
          </CSSTransition>
        </div>
      </div>
    </div>
  );
}
