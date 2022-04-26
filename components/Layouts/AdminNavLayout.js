import AdminSidebar from "../Navigation/AdminSideBar";
import AdminNavbar from "../Navigation/AdminNavbar";
import BrandModal from "../Modals/Admin/BrandModal";
import BrandDeleteModal from "../Modals/Admin/BrandDeleteModal";
import ModelModal from "../Modals/Admin/ModelModal";
import styles from "./AdminNavLayout.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import { useRef, useContext } from "react";
import { AdminContext } from "../../contexts/Admin.context";

export default function AdminNavLayout({ children }) {
  const menuRef = useRef(null);
  const {
    menuIsOpen,
    setMenuIsOpen,
    brandModalIsOpen,
    modelModalIsOpen,
    brandDeleteModalIsOpen,
  } = useContext(AdminContext);
  const screenMatches = useMediaQuery("(min-width:1024px)");
  useOnClickOutside(menuRef, () => setMenuIsOpen(false));
  return (
    <div className={styles["admin"]}>
      {modelModalIsOpen && <ModelModal />}
      {brandModalIsOpen && <BrandModal />}
      {brandDeleteModalIsOpen && <BrandDeleteModal />}
      {/* <div className={styles["admin__modals"]}></div> */}
      <div className={styles["admin__navbar"]}>
        <AdminNavbar />
      </div>
      <div
        ref={menuRef}
        className={`${styles["admin__sidebar"]} ${
          menuIsOpen ? styles["admin__sidebar--open"] : ""
        }`}
      >
        <AdminSidebar />
      </div>
      <div className={styles["admin__content"]}>{children}</div>
    </div>
  );
}
