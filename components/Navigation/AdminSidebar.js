import styles from "./AdminSidebar.module.scss";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import useMediaQuery from "@mui/material/useMediaQuery";
import { AdminContext } from "../../contexts/Admin.context";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminSidebar() {
  const router = useRouter();
  const { setMenuIsOpen } = useContext(AdminContext);
  const screenMatches = useMediaQuery("(min-width:1024px)");
  const [dropdown, setDropdown] = useState({
    open:
      router.pathname == "/admin/brands" || router.pathname == "/admin/models",
    active:
      router.pathname == "/admin/brands" || router.pathname == "/admin/models",
  });
  function handleItemClick(event) {
    const { name } = event.target;
    const pathName = name == "dashboard" ? "/admin" : `/admin/${name}`;
    console.log(pathName, name, router.pathname);
    if (pathName != router.pathname || name != "phone") {
      if (name == "phone") {
        setDropdown((prev) => ({
          active: false,
          open: !prev.open,
        }));
      } else if (name == "brands" || name == "models") {
        setDropdown((prev) => ({
          ...prev,
          active: true,
        }));
        setMenuIsOpen(false);
      } else {
        setDropdown((prev) => ({
          ...prev,
          active: false,
        }));
        setMenuIsOpen(false);
      }
    }
  }
  return (
    <div className={styles["sidebar"]}>
      <div className={styles["sidebar__logo-wrap"]}>
        <h2 className={styles["sidebar__logo"]}>
          Emphoneum<span className={styles["sidebar__role"]}>admin</span>
        </h2>
        {!screenMatches && (
          <button
            onClick={() => setMenuIsOpen(false)}
            className={styles["sidebar__button"]}
          >
            <CloseOutlinedIcon className={styles["sidebar__button-icon"]} />
          </button>
        )}
      </div>
      <ul className={styles["sidebar__list"]}>
        <li
          className={`${styles["sidebar__item"]} ${
            router.pathname == "/admin" && !dropdown.active
              ? styles["sidebar__item--active"]
              : ""
          }`}
        >
          <Link href={"/admin"}>
            <a
              className={styles["sidebar__link"]}
              onClick={handleItemClick}
              name="dashboard"
            >
              <DashboardOutlinedIcon className={styles["sidebar__icon"]} />
              <p className={styles["sidebar__text"]}>Dashboard</p>
            </a>
          </Link>
        </li>
        <li
          className={`${styles["sidebar__item"]} ${
            router.pathname == "/admin/orders" && !dropdown.active
              ? styles["sidebar__item--active"]
              : ""
          }`}
        >
          <Link href={"/admin/orders"}>
            <a
              className={styles["sidebar__link"]}
              onClick={handleItemClick}
              name="orders"
            >
              <ShoppingCartCheckoutOutlinedIcon
                className={styles["sidebar__icon"]}
              />
              <p className={styles["sidebar__text"]}>Orders</p>
            </a>
          </Link>
        </li>
        <li
          className={`${styles["sidebar__item"]} ${
            dropdown.active ? styles["sidebar__item--active"] : ""
          }`}
        >
          <button
            onClick={handleItemClick}
            className={styles["sidebar__dropdown-button"]}
            name="phone"
          >
            <SmartphoneOutlinedIcon className={styles["sidebar__icon"]} />
            <p className={styles["sidebar__text"]}>Phone</p>
            {dropdown.open ? (
              <ArrowDropUpOutlinedIcon
                className={styles["sidebar__drop-icon"]}
              />
            ) : (
              <ArrowDropDownOutlinedIcon
                className={styles["sidebar__drop-icon"]}
              />
            )}
          </button>
          <ul
            className={`${styles["sidebar__dropdown-menu"]} ${
              dropdown.open ? styles["sidebar__dropdown-menu--open"] : ""
            } ${
              dropdown.active ? styles["sidebar__dropdown-menu--active"] : ""
            }`}
          >
            <li
              className={`${styles["sidebar__dropdown-item"]} ${
                router.pathname == "/admin/brands"
                  ? styles["sidebar__dropdown-item--active"]
                  : ""
              }`}
            >
              <Link href={"/admin/brands"}>
                <a
                  className={`${styles["sidebar__link"]} ${styles["sidebar__link--dropdown"]}`}
                  onClick={handleItemClick}
                  name="brands"
                >
                  <p className={styles["sidebar__text"]}>Brands</p>
                </a>
              </Link>
            </li>
            <li
              className={`${styles["sidebar__dropdown-item"]} ${
                router.pathname == "/admin/models"
                  ? styles["sidebar__dropdown-item--active"]
                  : ""
              }`}
            >
              <Link href={"/admin/models"}>
                <a
                  className={`${styles["sidebar__link"]} ${styles["sidebar__link--dropdown"]}`}
                  onClick={handleItemClick}
                  name="models"
                >
                  <p className={styles["sidebar__text"]}>Models</p>
                </a>
              </Link>
            </li>
          </ul>
        </li>
        <li
          className={`${styles["sidebar__item"]} ${
            router.pathname == "/admin/users" && !dropdown.active
              ? styles["sidebar__item--active"]
              : ""
          }`}
        >
          <Link href={"/admin/users"}>
            <a
              className={styles["sidebar__link"]}
              onClick={handleItemClick}
              name="users"
            >
              <PeopleAltOutlinedIcon className={styles["sidebar__icon"]} />
              <p className={styles["sidebar__text"]}>Users</p>
            </a>
          </Link>
        </li>
      </ul>
    </div>
  );
}
