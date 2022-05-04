import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Image from "next/image";
import useOnClickOutside from "../../utils/useOnClickOutside";
import styles from "./AdminNavbar.module.scss";
import AdminDropMenu from "./DropMenu/AdminDropMenu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CSSTransition } from "react-transition-group";
import { AdminContext } from "../../contexts/Admin.context";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useState, useRef, useContext } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function AdminNavbar() {
  const router = useRouter();
  const screenMatches = useMediaQuery("(min-width:1024px)");
  const menuRef = useRef(null);
  const { setMenuIsOpen } = useContext(AdminContext);
  const [dropMenuIsOpen, setDropMenuIsOpen] = useState(false);
  const pathName = router.pathname.split("/");
  useOnClickOutside(menuRef, () => setDropMenuIsOpen(false));
  const { data, error } = useSWR("/api/user", { revalidateOnMount: true });
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
        <h1 className={styles["navbar__name"]}>
          {pathName.length <= 2
            ? "Dashboard"
            : pathName[2].charAt(0).toUpperCase() + pathName[2].slice(1)}
        </h1>
      </div>
      <div ref={menuRef} className={styles["navbar__profile-wrap"]}>
        <button
          className={styles["navbar__account-button"]}
          onClick={() => setDropMenuIsOpen(!dropMenuIsOpen)}
        >
          <p className={styles["navbar__admin-name"]}>
            {data?.userData?.fullname}
          </p>
          <div className={styles["navbar__admin-image-wrap"]}>
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
        <CSSTransition
          in={dropMenuIsOpen}
          timeout={200}
          unmountOnExit
          classNames="menu-anim"
        >
          <div className={styles["navbar__dropmenu"]}>
            <AdminDropMenu onItemClick={() => setDropMenuIsOpen(false)} />
          </div>
        </CSSTransition>
      </div>
    </div>
  );
}
