import styles from "../../styles/Account.module.scss";
import AdminLayout from "../../components/Layouts/AdminLayout";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { useFilePicker } from "use-file-picker";
import { useState, useEffect } from "react";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import { mutate } from "swr";
import Image from "next/image";
import Head from "next/head";
import BounceLoader from "react-spinners/BounceLoader";
import useSWR from "swr";

const initialInputErrors = {
  emailInUse: false,
  phoneInUse: false,
  passwordIncorrect: false,
  passwordsNotMatch: false,
};

export default function AdminAccount() {
  const [openFileSelector, { filesContent, errors }] = useFilePicker({
    readAs: "DataURL",
    accept: "image/*",
    multiple: false,
    limitFilesConfig: { max: 1 },
    maxFileSize: 3,
  });

  const { data, error } = useSWR("/api/user", { revalidateOnMount: true });
  const [changesSuccess, setChangesSuccess] = useState({
    imageForm: false,
    basicForm: false,
    addressForm: false,
    passwordForm: false,
  });
  const [loadingForm, setLoadingForm] = useState({
    imageForm: false,
    basicform: false,
    addressForm: false,
    passwordForm: false,
  });
  const [inputErrors, setInputErrors] = useState(initialInputErrors);

  const [image, setImage] = useState({
    id: "",
    url: "",
  });

  const [basicInputValues, setBasicInputValues] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNumber: "",
  });

  const [addressInputValue, setAddressInputValue] = useState("");

  const [passwordInputValues, setPasswordInputValues] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  function handleBasicInputChange(event) {
    const { name, value } = event.target;
    setBasicInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddressInputChange(event) {
    setAddressInputValue(event.target.value);
  }

  function handlePasswordInputChange(event) {
    const { name, value } = event.target;
    setPasswordInputValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  useEffect(() => {
    if (filesContent.length) {
      setImage((prev) => ({
        ...prev,
        url: filesContent[0].content,
      }));
    }
  }, [filesContent]);

  useEffect(() => {
    if (data) {
      setImage({
        ...data?.userData?.image,
      });
      setBasicInputValues({
        firstname: data?.userData?.firstname,
        lastname: data?.userData?.lastname,
        email: data?.userData?.email,
        phoneNumber: data?.userData?.phoneNumber,
      });
      setAddressInputValue(data?.userData?.address);
    }
  }, [data]);

  function handleImageFormSubmit() {
    setLoadingForm((prev) => ({
      ...prev,
      imageForm: true,
    }));
    setChangesSuccess((prev) => ({
      ...prev,
      imageForm: false,
    }));
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        toUpdate: "image",
        data: { image },
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result.success) {
          mutate("/api/user");
          setChangesSuccess((prev) => ({
            ...prev,
            imageForm: true,
          }));
        }
        setLoadingForm((prev) => ({
          ...prev,
          imageForm: false,
        }));
      })
      .catch((err) => console.log(err));
  }

  function handleBasicFormSubmit(event) {
    event.preventDefault();

    const asArray = Object.entries(basicInputValues);
    const filtered = asArray.filter(([key, value]) => {
      if (key == "firstname") {
        if (value == data.userData.firstname) {
          return false;
        }
      }
      if (key == "lastname") {
        if (value == data.userData.lastname) {
          return false;
        }
      }
      if (key == "email") {
        if (value == data.userData.email) {
          return false;
        }
      }
      if (key == "phoneNumber") {
        if (value == data.userData.phoneNumber) {
          return false;
        }
      }

      return true;
    });

    const filteredBody = Object.fromEntries(filtered);
    setLoadingForm((prev) => ({
      ...prev,
      basicform: true,
    }));
    setChangesSuccess((prev) => ({
      ...prev,
      basicForm: false,
    }));
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({ toUpdate: "basicInfo", data: filteredBody }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result.success) {
          mutate("/api/user");
          setChangesSuccess((prev) => ({
            ...prev,
            basicForm: true,
          }));
        } else {
          if (data.field == "email") {
            setInputErrors((prev) => ({
              ...prev,
              emailInUse: data.exists,
            }));
          } else if (data.field == "phoneNumber") {
            setInputErrors((prev) => ({
              ...prev,
              phoneInUse: data.exists,
            }));
          }
        }
        setLoadingForm((prev) => ({
          ...prev,
          basicform: false,
        }));
      })
      .catch((err) => console.log(err));
  }

  function handleAddressFormSubmit(event) {
    event.preventDefault();
    setLoadingForm((prev) => ({
      ...prev,
      addressform: true,
    }));
    setChangesSuccess((prev) => ({
      ...prev,
      addressForm: false,
    }));
    fetch("/api/user", {
      method: "POST",
      body: JSON.stringify({
        toUpdate: "address",
        data: { address: addressInputValue },
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result.success) {
          mutate("/api/user");
          setChangesSuccess((prev) => ({
            ...prev,
            addressForm: true,
          }));
        }
        setLoadingForm((prev) => ({
          ...prev,
          addressForm: false,
        }));
      })
      .catch((err) => console.log(err));
  }

  function handlePasswordFormSubmit(event) {
    event.preventDefault();
    console.log(passwordInputValues);
    setInputErrors((prev) => ({
      ...prev,
      passwordIncorrect: false,
      passwordsNotMatch: false,
    }));
    setChangesSuccess((prev) => ({
      ...prev,
      passwordForm: false,
    }));
    if (
      passwordInputValues.newPassword == passwordInputValues.confirmPassword
    ) {
      const { confirmPassword, ...formBody } = passwordInputValues;
      setLoadingForm((prev) => ({
        ...prev,
        passwordForm: true,
      }));
      fetch("/api/user", {
        method: "POST",
        body: JSON.stringify({
          toUpdate: "password",
          data: formBody,
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.result.success) {
            setInputErrors((prev) => ({
              ...prev,
              passwordIncorrect: true,
            }));
          } else {
            setChangesSuccess((prev) => ({
              ...prev,
              passwordForm: true,
            }));
          }
          setLoadingForm((prev) => ({
            ...prev,
            passwordForm: false,
          }));
        })
        .catch((err) => console.log(err));
    } else {
      setInputErrors((prev) => ({
        ...prev,
        passwordsNotMatch: true,
      }));
    }
  }

  return (
    <div className={styles["account"]}>
      <Head>
        <title>Account Settings | Emphoneum Admin</title>
      </Head>
      <div className={styles["account__page-header-wrap"]}>
        <h1 className={styles["account__page-header"]}>Account Settings</h1>
      </div>
      <div className={styles["account__image-change-wrap"]}>
        <div className={styles["account__image-change"]}>
          <div className={styles["account__image-selector-wrap"]}>
            <span className={styles["account__image-selector-icon-wrap"]}>
              <EditRoundedIcon
                className={styles["account__image-selector-icon"]}
              />
            </span>
            <button
              className={styles["account__image-selector-button"]}
              onClick={() => {
                openFileSelector();
                setChangesSuccess((prev) => ({
                  ...prev,
                  imageForm: false,
                }));
              }}
            >
              {image.url && (
                <Image
                  className={styles["account__image"]}
                  src={image.url}
                  alt="user image"
                  layout="fill"
                />
              )}
            </button>
          </div>
          {!!filesContent.length &&
            !loadingForm.imageForm &&
            !changesSuccess.imageForm && (
              <button
                onClick={handleImageFormSubmit}
                className={styles["form__submit-button"]}
              >
                Save Image
              </button>
            )}
          <BounceLoader
            color="#0082ff"
            loading={loadingForm.imageForm}
            size={36}
          />
          {changesSuccess.imageForm && (
            <div className={styles["form__success-icon-wrap"]}>
              <CheckOutlinedIcon className={styles["form__success-icon"]} />
            </div>
          )}
          {errors.length ? (
            <div className={styles["form__image-errors-wrap"]}>
              <p
                className={`${styles["form__error"]} ${styles["form__error--centered"]}`}
              >
                <span className={styles["form__error-icon-wrap"]}>
                  <ErrorOutlinedIcon className={styles["form__error-icon"]} />
                </span>
                {errors[0].fileSizeToolarge &&
                  "File is too large, please choose a file that is less than 3mb"}
                {errors[0].readerError && "Problem occured while reading file!"}
                {errors[0].maxLimitExceeded && "Too many files"}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div className={styles["account__form-wrap"]}>
        <form className={styles["form"]} onSubmit={handleBasicFormSubmit}>
          <h2 className={styles["form__name"]}>Basic Information</h2>
          <div
            className={`${styles["form__input-wrap"]} ${styles["form__input-wrap--grid"]}`}
          >
            <label
              className={`${styles["form__label"]} ${styles["form__label--grid"]}`}
              htmlFor="firstname"
            >
              First Name
            </label>
            <input
              className={`${styles["form__input"]} ${styles["form__input--grid"]}`}
              value={basicInputValues.firstname}
              name="firstname"
              type="text"
              placeholder="First Name"
              required
              onChange={handleBasicInputChange}
            ></input>
          </div>
          <div
            className={`${styles["form__input-wrap"]} ${styles["form__input-wrap--grid"]}`}
          >
            <label
              className={`${styles["form__label"]} ${styles["form__label--grid"]}`}
              htmlFor="lastname"
            >
              Last Name
            </label>
            <input
              className={`${styles["form__input"]} ${styles["form__input--grid"]}`}
              value={basicInputValues.lastname}
              name="lastname"
              type="text"
              placeholder="Last Name"
              required
              onChange={handleBasicInputChange}
            ></input>
          </div>
          <div
            className={`${styles["form__input-wrap"]} ${styles["form__input-wrap--grid"]}`}
          >
            <label
              className={`${styles["form__label"]} ${styles["form__label--grid"]}`}
              htmlFor="email"
            >
              Email
            </label>
            <input
              className={`${styles["form__input"]} ${styles["form__input--grid"]}`}
              value={basicInputValues.email}
              name="email"
              type="email"
              placeholder="sample@mail.com"
              required
              onChange={handleBasicInputChange}
            ></input>
            {inputErrors.emailInUse && (
              <div
                className={`${styles["form__input-error-wrap"]} ${styles["form__input-error-wrap--grid"]}`}
              >
                <p className={`${styles["form__error"]}`}>
                  <span className={styles["form__error-icon-wrap"]}>
                    <ErrorOutlinedIcon className={styles["form__error-icon"]} />
                  </span>{" "}
                  Email already in use
                </p>
              </div>
            )}
          </div>
          <div
            className={`${styles["form__input-wrap"]} ${styles["form__input-wrap--grid"]}`}
          >
            <label
              className={`${styles["form__label"]} ${styles["form__label--grid"]}`}
              htmlFor="phonrNumber"
            >
              Phone Number
            </label>
            <input
              className={`${styles["form__input"]} ${styles["form__input--grid"]}`}
              value={basicInputValues.phoneNumber}
              name="phoneNumber"
              type="tel"
              pattern="[0-9]{11}"
              placeholder="09123456789"
              required
              onChange={handleBasicInputChange}
            ></input>
            {inputErrors.phoneInUse && (
              <div
                className={`${styles["form__input-error-wrap"]} ${styles["form__input-error-wrap--grid"]}`}
              >
                <p className={`${styles["form__error"]}`}>
                  <span className={styles["form__error-icon-wrap"]}>
                    <ErrorOutlinedIcon className={styles["form__error-icon"]} />
                  </span>{" "}
                  Phone Number already in use
                </p>
              </div>
            )}
          </div>
          <div className={styles["form__buttons-wrap"]}>
            <BounceLoader
              color="#0082ff"
              loading={loadingForm.basicform}
              size={36}
            />
            {changesSuccess.basicForm && (
              <div className={styles["form__success-icon-wrap"]}>
                <CheckOutlinedIcon className={styles["form__success-icon"]} />
              </div>
            )}
            <button
              type="submit"
              className={styles["form__submit-button"]}
              disabled={
                !(
                  basicInputValues.firstname !== data?.userData?.firstname ||
                  basicInputValues.lastname !== data?.userData?.lastname ||
                  basicInputValues.email !== data?.userData?.email ||
                  basicInputValues.phoneNumber !==
                    data?.userData?.phoneNumber ||
                  loadingForm.basicform
                )
              }
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div className={styles["account__form-wrap"]}>
        <form className={styles["form"]} onSubmit={handleAddressFormSubmit}>
          <h2 className={styles["form__name"]}>Address</h2>
          <div
            className={`${styles["form__input-wrap"]} ${styles["form__input-wrap--grid"]}`}
          >
            <label
              className={`${styles["form__label"]} ${styles["form__label--grid"]}`}
              htmlFor="address"
            >
              Address
            </label>
            <textarea
              className={`${styles["form__textarea"]} ${styles["form__textarea--grid"]}`}
              value={addressInputValue}
              onChange={handleAddressInputChange}
              rows="2"
              required
              name="address"
              placeholder="Address"
            ></textarea>
          </div>
          <div className={styles["form__buttons-wrap"]}>
            <BounceLoader
              color="#0082ff"
              loading={loadingForm.addressForm}
              size={36}
            />
            {changesSuccess.addressForm && (
              <div className={styles["form__success-icon-wrap"]}>
                <CheckOutlinedIcon className={styles["form__success-icon"]} />
              </div>
            )}
            <button
              type="submit"
              disabled={
                addressInputValue == data?.userData?.address ||
                loadingForm.addressForm
              }
              className={styles["form__submit-button"]}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
      <div className={styles["account__form-wrap"]}>
        <form className={styles["form"]} onSubmit={handlePasswordFormSubmit}>
          <h2 className={styles["form__name"]}>Password</h2>
          <div
            className={`${styles["form__input-wrap"]} ${styles["form__input-wrap--grid"]}`}
          >
            <label
              className={`${styles["form__label"]} ${styles["form__label--grid"]}`}
              htmlFor="password"
            >
              Current Password
            </label>
            <input
              className={`${styles["form__input"]} ${styles["form__input--grid"]}`}
              value={passwordInputValues.password}
              name="password"
              type="password"
              placeholder="Password"
              required
              onChange={handlePasswordInputChange}
            ></input>
            {inputErrors.passwordIncorrect && (
              <div
                className={`${styles["form__input-error-wrap"]} ${styles["form__input-error-wrap--grid"]}`}
              >
                <p className={`${styles["form__error"]}`}>
                  <span className={styles["form__error-icon-wrap"]}>
                    <ErrorOutlinedIcon className={styles["form__error-icon"]} />
                  </span>{" "}
                  Password incorrect
                </p>
              </div>
            )}
          </div>
          <div
            className={`${styles["form__input-wrap"]} ${styles["form__input-wrap--grid"]}`}
          >
            <label
              className={`${styles["form__label"]} ${styles["form__label--grid"]}`}
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              className={`${styles["form__input"]} ${styles["form__input--grid"]}`}
              value={passwordInputValues.newPassword}
              name="newPassword"
              type="password"
              placeholder="New Password"
              required
              onChange={handlePasswordInputChange}
            ></input>
            {inputErrors.passwordsNotMatch && (
              <div
                className={`${styles["form__input-error-wrap"]} ${styles["form__input-error-wrap--grid"]}`}
              >
                <p className={`${styles["form__error"]}`}>
                  <span className={styles["form__error-icon-wrap"]}>
                    <ErrorOutlinedIcon className={styles["form__error-icon"]} />
                  </span>{" "}
                  Passwords do not match
                </p>
              </div>
            )}
          </div>
          <div
            className={`${styles["form__input-wrap"]} ${styles["form__input-wrap--grid"]}`}
          >
            <label
              className={`${styles["form__label"]} ${styles["form__label--grid"]}`}
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className={`${styles["form__input"]} ${styles["form__input--grid"]}`}
              value={passwordInputValues.confirmPassword}
              name="confirmPassword"
              type="password"
              placeholder="Re-enter Password"
              required
              onChange={handlePasswordInputChange}
            ></input>
          </div>
          <div className={styles["form__buttons-wrap"]}>
            <BounceLoader
              color="#0082ff"
              loading={loadingForm.passwordForm}
              size={36}
            />
            {changesSuccess.passwordForm && (
              <div className={styles["form__success-icon-wrap"]}>
                <CheckOutlinedIcon className={styles["form__success-icon"]} />
              </div>
            )}
            <button
              disabled={
                passwordInputValues.password == "" ||
                passwordInputValues.newPassword == "" ||
                passwordInputValues.confirmPassword == ""
              }
              className={styles["form__submit-button"]}
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

AdminAccount.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
