import AdminSidebar from "../Navigation/AdminSideBar";
import AdminNavbar from "../Navigation/AdminNavbar";
import styles from "./AdminNavLayout.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { useRef, useContext } from "react";
import { AdminContext } from "../../contexts/Admin.context";

export default function AdminNavLayout({ children }) {
  const { menuIsOpen, setMenuIsOpen } = useContext(AdminContext);
  const screenMatches = useMediaQuery("(min-width:1024px)");
  return (
    <div className={styles["admin"]}>
      <div className={styles["admin__topbar"]}>
        <AdminNavbar />
      </div>
      <div className={styles["admin__navbar"]}>
        <AdminSidebar />
      </div>
      <div className={styles["admin__content"]}>{children}</div>
    </div>
  );
}
