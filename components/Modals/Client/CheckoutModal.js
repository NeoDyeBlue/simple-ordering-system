// import Modal from "react-modal";
import styles from "./CheckoutModal.module.scss";
import { useContext, useEffect } from "react";
import { ClientContext } from "../../../contexts/Client.context";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import CheckoutItem from "./CheckoutItem";
import { useState } from "react";
// Modal.setAppElement("#__next");

export default function CheckoutModal() {
  const { checkoutModalIsOpen, setCheckoutModalIsOpen, checkoutItems } =
    useContext(ClientContext);

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
        console.log(data);
        if (data.success) {
          console.log("success");
        }
      })
      .catch((err) => console.log(err));
  }
  return (
    <div className={styles["modal"]}>
      <div className={styles["modal__border-wrap"]}>
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
  );
}
