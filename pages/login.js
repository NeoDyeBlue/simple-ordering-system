import ClientLayout from "../components/Layouts/ClientLayout";
import styles from "../styles/Form.module.scss";
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

export default function SignUp() {
  const [inputValues, setInputValues] = useState({
    emailPhone: "",
    password: "",
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
        <title>Login | Emphoneum</title>
      </Head>
      <div className={styles["form-container"]}>
        <div className={styles["form-container__wrap"]}>
          <form className={styles["form"]}>
            <h2 className={styles["form__name"]}>Login</h2>
            <div className={styles["form__input-wrap"]}>
              <label className={styles["form__label"]} htmlFor="phoneEmail">
                Phone or Email
              </label>
              <input
                className={styles["form__input"]}
                name="phoneEmail"
                type="text"
                placeholder="Phone or Email"
                required
                value={inputValues.phoneEmail}
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
            <div className={styles["form__lnk-btn-wrap"]}>
              <p className={styles["form__link-text"]}>
                Don&apos;t have an account?{" "}
                <Link href="/signup">
                  <a className={styles["form__link"]}>Sign Up Here</a>
                </Link>
              </p>
              <button className={styles["form__button"]}>Login</button>
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
