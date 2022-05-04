import styles from "./CheckoutModal.module.scss";
import { useContext, useEffect } from "react";
import { ClientContext } from "../../../contexts/Client.context";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CheckoutItem from "./CheckoutItem";
import { useState, useRef } from "react";
import { useRouter } from "next/router";
import { CSSTransition } from "react-transition-group";
import { toast } from "react-toastify";

export default function CheckoutModal() {
  const { setCheckoutModalIsOpen, checkoutModalIsOpen, checkoutItems } =
    useContext(ClientContext);
  const modalRef = useRef(null);
  const router = useRouter();
  const [totalPrice, setTotalPrice] = useState(0);

  const items = checkoutItems.map((item) => (
    <CheckoutItem
      key={item.phone.id}
      phone={item.phone}
      variation={item.variation}
      color={item.color}
    />
  ));

  useEffect(() => {
    if (checkoutItems.length) {
      let total = 0;
      if (checkoutItems.length > 1) {
        total = checkoutItems.reduce((prevItem, currItem) => {
          return prevItem.variation.price + currItem.variation.price;
        }, 0);
      } else {
        total = checkoutItems[0].variation.price;
      }
      setTotalPrice(total);
    }
  }, [checkoutItems]);

  function checkOut() {
    const formBody = {
      phone: checkoutItems[0].phone.id,
      variation: checkoutItems[0].variation,
      color: checkoutItems[0].color,
    };

    fetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(formBody),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated) {
          router.push("/login");
        }
        if (data.success && data.authenticated) {
          router.push("/orders");
          setCheckoutModalIsOpen(false);
        } else {
          if (data.orderExists)
            toast.error("Order already placed", {
              position: "bottom-center",
              autoClose: 5000,
              containerId: "modal",
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <CSSTransition
      in={checkoutModalIsOpen}
      timeout={200}
      unmountOnExit
      classNames="menu-anim"
    >
      <div className={styles["modal"]}>
        <div ref={modalRef} id="modal" className={styles["modal__border-wrap"]}>
          <div className={styles["modal__wrap"]}>
            <div className={styles["modal__header-wrap"]}>
              <h2 className={styles["modal__name"]}>Check Out</h2>
              <button
                onClick={() => setCheckoutModalIsOpen(false)}
                className={styles["modal__close-button"]}
              >
                <CloseOutlinedIcon
                  className={styles["modal__close-button-icon"]}
                />
              </button>
            </div>
            <ul className={styles["modal__checkout-items"]}>{items}</ul>
            <div className={styles["modal__checkout-info"]}>
              <LocationOnOutlinedIcon
                className={styles["modal__checkout-info-icon"]}
              />
              <p className={styles["modal__checout-info-address"]}>Bulacan</p>
            </div>
            <div className={styles["modal__checkout-info"]}>
              <PaymentsOutlinedIcon
                className={styles["modal__checkout-info-icon"]}
              />
              <div className={styles["modal__payment-option"]}>
                <p className={styles["modal__payment-option-text"]}>
                  Cash on Delivery
                </p>
              </div>
            </div>
            <div className={styles["modal__buttons-wrap"]}>
              <p className={styles["modal__checkout-price"]}>
                ₱{totalPrice?.toLocaleString()}
              </p>
              <button onClick={checkOut} className={styles["modal__button"]}>
                Check Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  );
}
