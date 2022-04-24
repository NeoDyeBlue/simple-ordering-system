import styles from "./AdminSidebar.module.scss";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import FeaturedVideoOutlinedIcon from "@mui/icons-material/FeaturedVideoOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import ArrowDropUpOutlinedIcon from "@mui/icons-material/ArrowDropUpOutlined";
import { AdminContext } from "../../contexts/Admin.context";
import { useContext, useState } from "react";
import Link from "next/link";

export default function AdminSidebar() {
  const { setMenuIsOpen, activePage, setActivePage } = useContext(AdminContext);
  const [dropdown, setDropdown] = useState({
    open: false,
    active: false,
  });
  function handleItemClick(event) {
    const { name } = event.target;
    if (name != activePage || name != "phones") {
      if (name == "phones") {
        setDropdown((prev) => ({
          active: true,
          open: !prev.open,
        }));
      } else if (name == "categories" || name == "models") {
        setDropdown((prev) => ({
          ...prev,
          active: true,
        }));
        setActivePage(name);
      } else {
        setDropdown((prev) => ({
          ...prev,
          active: false,
        }));
        setActivePage(name);
      }
    }
  }
  return (
    <div className={styles["sidebar"]}>
      <div className={styles["sidebar__logo-wrap"]}>
        <h2 className={styles["sidebar__logo"]}>
          Emphoneum<span className={styles["sidebar__role"]}>admin</span>
        </h2>
        <button
          onClick={() => setMenuIsOpen(false)}
          className={styles["sidebar__button"]}
        >
          <CloseOutlinedIcon className={styles["sidebar__button-icon"]} />
        </button>
      </div>
      <ul className={styles["sidebar__list"]}>
        <li
          className={`${styles["sidebar__item"]} ${
            activePage == "dashboard" && !dropdown.active
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
            activePage == "orders" && !dropdown.active
              ? styles["sidebar__item--active"]
              : ""
          }`}
        >
          <Link href={"/admin"}>
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
            name="phones"
          >
            <SmartphoneOutlinedIcon className={styles["sidebar__icon"]} />
            <p className={styles["sidebar__text"]}>Phones</p>
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
                activePage == "categories"
                  ? styles["sidebar__dropdown-item--active"]
                  : ""
              }`}
            >
              <Link href={"/admin"}>
                <a
                  className={`${styles["sidebar__link"]} ${styles["sidebar__link--dropdown"]}`}
                  onClick={handleItemClick}
                  name="categories"
                >
                  <p className={styles["sidebar__text"]}>Categories</p>
                </a>
              </Link>
            </li>
            <li
              className={`${styles["sidebar__dropdown-item"]} ${
                activePage == "models"
                  ? styles["sidebar__dropdown-item--active"]
                  : ""
              }`}
            >
              <Link href={"/admin"}>
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
            activePage == "featured" && !dropdown.active
              ? styles["sidebar__item--active"]
              : ""
          }`}
        >
          <Link href={"/admin"}>
            <a
              className={styles["sidebar__link"]}
              onClick={handleItemClick}
              name="featured"
            >
              <FeaturedVideoOutlinedIcon className={styles["sidebar__icon"]} />
              <p className={styles["sidebar__text"]}>Featured</p>
            </a>
          </Link>
        </li>
        <li
          className={`${styles["sidebar__item"]} ${
            activePage == "users" && !dropdown.active
              ? styles["sidebar__item--active"]
              : ""
          }`}
        >
          <Link href={"/admin"}>
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
