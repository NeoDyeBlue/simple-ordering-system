import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Image from "next/image";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import styles from "./AdminNavbar.module.scss";
import AdminDropMenu from "./DropMenu/AdminDropMenu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CSSTransition } from "react-transition-group";
import { AdminContext } from "../../contexts/Admin.context";
import { useState, useRef, useContext } from "react";

export default function AdminNavbar() {
  const screenMatches = useMediaQuery("(min-width:1024px)");
  const menuRef = useRef(null);
  const { setMenuIsOpen, activePage } = useContext(AdminContext);
  const [dropMenuIsOpen, setDropMenuIsOpen] = useState(false);
  useOnClickOutside(menuRef, () => setDropMenuIsOpen(false));
  return (
    <div className={styles["navbar"]}>
      <div className={styles["navbar__header-wrap"]}>
        {!screenMatches && (
          <button
            className={styles["navbar__button"]}
            onClick={() => setMenuIsOpen(true)}
          >
            <MenuOutlinedIcon className={styles["navbar__button-icon"]} />
          </button>
        )}
        <h1 className={styles["navbar__name"]}>{activePage}</h1>
      </div>
      <div ref={menuRef} className={styles["navbar__profile-wrap"]}>
        <button
          className={styles["navbar__account-button"]}
          onClick={() => setDropMenuIsOpen(!dropMenuIsOpen)}
        >
          <p className={styles["navbar__admin-name"]}>Admin User</p>
          <div className={styles["navbar__admin-image-wrap"]}>
            {/* <Image
              className={styles["navbar__admin-image"]}
              src={userInfo.image.url}
              alt="admin photo"
              layout="fill"
              priority={true}
            /> */}
          </div>
        </button>
        <CSSTransition
          in={dropMenuIsOpen}
          timeout={200}
          unmountOnExit
          classNames="menu-anim"
        >
          <div className={styles["navbar__dropmenu"]}>
            <AdminDropMenu />
          </div>
        </CSSTransition>
      </div>
    </div>
  );
}
