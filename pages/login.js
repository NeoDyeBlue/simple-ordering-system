import ClientLayout from "../components/Layouts/ClientLayout";
import styles from "../styles/Form.module.scss";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";

const initialInputError = {
  userNotExists: false,
  credentialsNotMatch: false,
};

export default function SignUp() {
  const [inputValues, setInputValues] = useState({
    emailOrPhone: "",
    password: "",
  });
  const [inputError, setInputError] = useState(initialInputError);
  const router = useRouter();
  function handleInputChange(event) {
    const { name, value } = event.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setInputError({ ...initialInputError });
    fetch("/api/auth/login", {
      body: JSON.stringify(inputValues),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.userExists && data.credentialsMatch) {
          router.push("/");
        } else {
          if (!data.userExists) {
            setInputError((prev) => ({
              ...prev,
              userNotExists: true,
            }));
          } else if (!data.credentialsMatch) {
            setInputError((prev) => ({
              ...prev,
              credentialsNotMatch: true,
            }));
          }
        }
      });
  }

  return (
    <>
      <Head>
        <title>Login | Emphoneum</title>
      </Head>
      <div className={styles["form-container"]}>
        <div className={styles["form-container__wrap"]}>
          <form className={styles["form"]} onSubmit={handleSubmit}>
            <h2 className={styles["form__name"]}>Login</h2>
            <div className={styles["form__input-wrap"]}>
              <label className={styles["form__label"]} htmlFor="emailOrPhone">
                Phone or Email
              </label>
              <input
                className={styles["form__input"]}
                name="emailOrPhone"
                type="text"
                placeholder="Phone or Email"
                required
                value={inputValues.phoneEmail}
                onChange={handleInputChange}
              />
              {(inputError.userNotExists || inputError.credentialsNotMatch) && (
                <div className={styles["form__input-error-wrap"]}>
                  <p className={`${styles["form__error"]}`}>
                    <span className={styles["form__error-icon-wrap"]}>
                      <ErrorOutlinedIcon
                        className={styles["form__error-icon"]}
                      />
                    </span>
                    {inputError.userNotExists && "Account does not exist"}
                    {inputError.credentialsNotMatch &&
                      "Email/phone and password combination is incorrect"}
                  </p>
                </div>
              )}
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
