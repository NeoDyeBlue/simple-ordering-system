import ClientLayout from "../components/Layouts/ClientLayout";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import styles from "../styles/Form.module.scss";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

const initialInputErrors = {
  emailInUse: false,
  phoneInUse: false,
  passwordsNotMatch: false,
};

export default function SignUp() {
  const [inputValues, setInputValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();
  const [inputErrors, setInputErrors] = useState(initialInputErrors);

  function handleInputChange(event) {
    const { name, value } = event.target;
    setInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    setInputErrors({ ...initialInputErrors });

    if (inputValues.password == inputValues.confirmPassword) {
      const { confirmPassword, ...formBody } = inputValues;

      fetch("/api/auth/signup", {
        body: JSON.stringify(formBody),
        headers: { "Content-Type": "application/json" },
        method: "POST",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            console.log(data);
            router.push("/");
          } else {
            if (data.existing.email) {
              setInputErrors((prev) => ({
                ...prev,
                emailInUse: true,
              }));
            }
            if (data.existing.phoneNumber) {
              setInputErrors((prev) => ({
                ...prev,
                phoneInUse: true,
              }));
            }
          }
        })
        .catch((err) => console.log(err));
    } else {
      setInputErrors({
        ...initialInputErrors,
        passwordsNotMatch: !(
          inputValues.password == inputValues.confirmPassword
        ),
      });
    }
  }

  return (
    <>
      <Head>
        <title>Sign Up | Emphoneum</title>
      </Head>
      <div className={styles["form-container"]}>
        <div className={styles["form-container__wrap"]}>
          <form className={styles["form"]} onSubmit={handleSubmit}>
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
              {inputErrors.emailInUse && (
                <div className={styles["form__input-error-wrap"]}>
                  <p className={`${styles["form__error"]}`}>
                    <span className={styles["form__error-icon-wrap"]}>
                      <ErrorOutlinedIcon
                        className={styles["form__error-icon"]}
                      />
                    </span>
                    Email already in use
                  </p>
                </div>
              )}
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
              <label className={styles["form__label"]} htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                className={styles["form__input"]}
                name="phoneNumber"
                type="tel"
                pattern="[0-9]{11}"
                placeholder="09123456789"
                required
                value={inputValues.phone}
                onChange={handleInputChange}
              />
              {inputErrors.phoneInUse && (
                <div className={styles["form__input-error-wrap"]}>
                  <p className={`${styles["form__error"]}`}>
                    <span className={styles["form__error-icon-wrap"]}>
                      <ErrorOutlinedIcon
                        className={styles["form__error-icon"]}
                      />
                    </span>
                    Phone number already in use
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
              {inputErrors.passwordsNotMatch && (
                <div className={styles["form__input-error-wrap"]}>
                  <p className={`${styles["form__error"]}`}>
                    <span className={styles["form__error-icon-wrap"]}>
                      <ErrorOutlinedIcon
                        className={styles["form__error-icon"]}
                      />
                    </span>
                    Passwords do not match
                  </p>
                </div>
              )}
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
                name="confirmPassword"
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
