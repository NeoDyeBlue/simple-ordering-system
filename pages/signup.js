import ClientLayout from "../components/Layouts/ClientLayout";
import styles from "../styles/Form.module.scss";
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

export default function SignUp() {
  const [inputValues, setInputValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  return (
    <>
      <Head>
        <title>Sign Up | Emphoneum</title>
      </Head>
      <div className={styles["form-container"]}>
        <div className={styles["form-container__wrap"]}>
          <form className={styles["form"]}>
            <h2 className={styles["form__name"]}>Sign Up</h2>
            <div className={styles["form__field-wrap"]}>
              <div className={styles["form__input-wrap"]}>
                <label className={styles["form__label"]} htmlFor="firstname">
                  First Name
                </label>
                <input
                  className={styles["form__input"]}
                  name="firstname"
                  type="text"
                  placeholder="First Name"
                  required
                  value={inputValues.firstname}
                  onChange={handleInputChange}
                />
              </div>
              <div className={styles["form__input-wrap"]}>
                <label className={styles["form__label"]} htmlFor="lastname">
                  Last Name
                </label>
                <input
                  className={styles["form__input"]}
                  name="lastname"
                  type="text"
                  placeholder="Last Name"
                  required
                  value={inputValues.lastname}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className={styles["form__input-wrap"]}>
              <label className={styles["form__label"]} htmlFor="email">
                Email
              </label>
              <input
                className={styles["form__input"]}
                name="email"
                type="email"
                placeholder="sample@mail.com"
                required
                value={inputValues.email}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles["form__input-wrap"]}>
              <label className={styles["form__label"]} htmlFor="address">
                Address
              </label>
              <textarea
                className={styles["form__textarea"]}
                onChange={handleInputChange}
                value={inputValues.address}
                rows="2"
                required
                name="address"
                placeholder="Address"
              ></textarea>
            </div>
            <div className={styles["form__input-wrap"]}>
              <label className={styles["form__label"]} htmlFor="phone">
                Phone Number
              </label>
              <input
                className={styles["form__input"]}
                name="phone"
                type="number"
                placeholder="09123456789"
                required
                value={inputValues.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles["form__input-wrap"]}>
              <label className={styles["form__label"]} htmlFor="password">
                Password
              </label>
              <input
                className={styles["form__input"]}
                name="password"
                type="password"
                placeholder="Enter Password"
                required
                value={inputValues.password}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles["form__input-wrap"]}>
              <label
                className={styles["form__label"]}
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className={styles["form__input"]}
                name="password"
                type="password"
                placeholder="Confirm Password"
                required
                value={inputValues.confirmPassword}
                onChange={handleInputChange}
              />
            </div>
            <div className={styles["form__lnk-btn-wrap"]}>
              <p className={styles["form__link-text"]}>
                Already have an account?{" "}
                <Link href="/login">
                  <a className={styles["form__link"]}>Login Here</a>
                </Link>
              </p>
              <button className={styles["form__button"]}>Sign Up</button>
            </div>
          </form>
          <div className={styles["welcome"]}>
            <h1 className={styles["welcome__header"]}>Emphoneum</h1>
            <p
              className={`${styles["welcome__text"]} ${styles["welcome__text--20"]} ${styles["welcome__text--light"]}`}
            >
              Shop phones from major brands
            </p>
          </div>
          <a
            className={styles["bg-link"]}
            href="https://www.freepik.com/vectors/minimalist-background"
          >
            Minimalist background vector created by freepik - www.freepik.com
          </a>
        </div>
      </div>
    </>
  );
}

SignUp.getLayout = function getLayout(page) {
  return <ClientLayout>{page}</ClientLayout>;
};
