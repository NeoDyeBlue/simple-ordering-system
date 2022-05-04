import styles from "../../styles/Model.module.scss";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import BatteryFullOutlinedIcon from "@mui/icons-material/BatteryFullOutlined";
import CameraOutlinedIcon from "@mui/icons-material/CameraOutlined";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import Image from "next/image";
import ClientLayout from "../../components/Layouts/ClientLayout";
import { ClientContext } from "../../contexts/Client.context";
import { useRouter } from "next/router";
import { useState, useEffect, useContext } from "react";
import useSWR from "swr";
import { getPhone } from "../../lib/phone-queries";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CheckoutModal from "../../components/Modals/Client/CheckoutModal";
import Head from "next/head";

export async function getServerSideProps(context) {
  const { params } = context;
  const data = await getPhone(params.brand, params.model);

  if (!data.phone) {
    return { notFound: true };
  }

  return {
    props: {
      phoneData: JSON.parse(JSON.stringify(data)),
    },
  };
}

export default function Model({ phoneData }) {
  const router = useRouter();
  const { setCheckoutModalIsOpen, checkoutModalIsOpen, setCheckoutItems } =
    useContext(ClientContext);
  const { brand, model } = router.query;
  const [formData, setFormData] = useState({
    variation: "",
    color: "",
  });

  const { data, error } = useSWR(`/api/phones/${brand}/${model}`, {
    initialData: Object.keys(phoneData.phone).length ? phoneData : null,
  });

  useEffect(() => {
    if (data) {
      setFormData({
        variation: data.phone.variations[0],
        color: data.phone.colors[0],
      });
    }
  }, [data]);

  function handleInputChange(event, value) {
    const { name } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const variationInputs = data?.phone.variations.map((variation) => (
    <li className={styles["model__form-selection-item"]} key={variation._id}>
      <input
        className={styles["model__form-radio-storage"]}
        type="radio"
        name="variation"
        id={variation._id}
        required
        checked={variation._id == formData.variation._id}
        onChange={(e) => {
          handleInputChange(e, variation);
        }}
      />
      <label
        className={styles["model__form-radio-storage-label"]}
        htmlFor={variation._id}
      >
        {variation.rom >= 1000
          ? `${variation.rom / 1000}TB`
          : `${variation.rom}GB`}{" "}
        / {variation.ram}GB
      </label>
    </li>
  ));

  const colorInputs = data?.phone.colors.map((color) => {
    let r = 0;
    let g = 0;
    let b = 0;
    let iconColor = "white";
    if (color.hexValue.length == 4) {
      r = parseInt(color.hexValue.slice(1, 2).repeat(2), 16);
      g = parseInt(color.hexValue.slice(2, 3).repeat(2), 16);
      b = parseInt(color.hexValue.slice(3, 4).repeat(2), 16);
    } else {
      r = parseInt(color.hexValue.slice(1, 3), 16);
      g = parseInt(color.hexValue.slice(3, 5), 16);
      b = parseInt(color.hexValue.slice(5, 7), 16);
    }
    if (Math.sqrt(r ** 2 * 0.241 + g ** 2 * 0.691 + b ** 2 * 0.068) > 145) {
      iconColor = "#212529";
    }

    return (
      <li key={color._id} className={styles["model__form-selection-item"]}>
        <input
          className={styles["model__form-radio-color"]}
          type="radio"
          name="color"
          id={color._id}
          value={color._id}
          required
          checked={formData.color._id == color._id}
          onChange={(e) => handleInputChange(e, color)}
        />
        <label
          style={{ backgroundColor: color.hexValue }}
          className={styles["model__form-radio-color-label"]}
          htmlFor={color._id}
        >
          {formData.color._id == color._id && (
            <CheckOutlinedIcon
              style={{ color: iconColor }}
              className={styles["model__form-radio-color-icon-check"]}
            />
          )}
        </label>
      </li>
    );
  });

  function handleSubmit() {
    setCheckoutItems([
      {
        phone: {
          id: data.phone._id,
          image: data.phone.image.url,
          name: data.phone.name,
        },
        variation: formData.variation,
        color: formData.color,
      },
    ]);

    setCheckoutModalIsOpen(true);
  }
  return (
    <div className={styles["model"]}>
      <Head>
        <title>
          {data?.phone.name || "Loading..."} | Emphoneum Shop Phones from Major
          Brands
        </title>
      </Head>
      {checkoutModalIsOpen && <CheckoutModal />}
      <div className={styles["model__header-wrap"]}>
        <h1 className={styles["model__name"]}>
          {data?.phone.name || <Skeleton className={"skeleton-model-name"} />}
        </h1>
      </div>
      <div className={styles["model__form-image-wrap"]}>
        <div className={styles["model__image-wrap"]}>
          {data?.phone.image.url ? (
            <Image
              className={styles["model__image"]}
              src={data?.phone.image.url}
              alt="phone pic"
              layout="fill"
            />
          ) : (
            <Skeleton
              containerClassName={styles["model__image-wrap"]}
              className={styles["skeleton-model-image"]}
            />
          )}
        </div>
        <div className={styles["model__form-wrap"]}>
          <div className={styles["model__main-specs-wrap"]}>
            <div className={styles["model__spec-box"]}>
              <SmartphoneOutlinedIcon className={styles["model__spec-icon"]} />
              <p className={styles["model__spec-main"]}>
                {data?.phone.specs.screenSize.inches || <Skeleton />}
              </p>
              <p className={styles["model__spec-sub"]}>
                {data?.phone.specs.screenSize.resolution || <Skeleton />}
              </p>
            </div>
            <div className={styles["model__spec-box"]}>
              <BatteryFullOutlinedIcon className={styles["model__spec-icon"]} />
              <p className={styles["model__spec-main"]}>
                {data?.phone.specs.battery.capacity ? (
                  `${data?.phone.specs.battery.capacity}mAh`
                ) : (
                  <Skeleton />
                )}
              </p>
              <p className={styles["model__spec-sub"]}>
                {data?.phone.specs.battery.type || <Skeleton />}
              </p>
            </div>
            <div className={styles["model__spec-box"]}>
              <CameraOutlinedIcon className={styles["model__spec-icon"]} />
              <p className={styles["model__spec-main"]}>
                {data?.phone.specs.camera.main ? (
                  `${data?.phone.specs.camera.main}MP`
                ) : (
                  <Skeleton />
                )}
              </p>
              <p className={styles["model__spec-sub"]}>
                {data?.phone.specs.camera.main ? (
                  `${data?.phone.specs.camera.resolution}p`
                ) : (
                  <Skeleton />
                )}
              </p>
            </div>
          </div>
          <div className={styles["model__form"]}>
            <div className={styles["model__form-fieldset"]}>
              <p className={styles["model__form-legend"]}>Choose a variation</p>
              <ul className={styles["model__form-selections-wrap"]}>
                {variationInputs ||
                  [...Array(2)].map((_, i) => (
                    <Skeleton
                      key={i}
                      width={150}
                      height={58}
                      className={styles["skeleton-radio-rect"]}
                    />
                  ))}
              </ul>
            </div>
            <p className={styles["model__price"]}>
              {formData.variation?.price ? (
                `₱${formData.variation?.price?.toLocaleString()}`
              ) : (
                <Skeleton />
              )}
            </p>
            <div className={styles["model__form-fieldset"]}>
              <p className={styles["model__form-legend"]}>Choose a color</p>
              <ul className={styles["model__form-selections-wrap"]}>
                {colorInputs ||
                  [...Array(3)].map((_, i) => (
                    <Skeleton circle={true} key={i} width={48} height={48} />
                  ))}
              </ul>
            </div>
            <div className={styles["model__form-buttons-wrap"]}>
              {formData.variation?.quantity == 0 ? (
                <p className={styles["model__out-of-stock"]}>Out of Stock</p>
              ) : (
                <button
                  className={styles["model__form-button"]}
                  onClick={() => handleSubmit()}
                >
                  Buy Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className={styles["model__specs-wrap"]}>
        <ul className={styles["model__specs-list"]}>
          <li className={styles["model__spec-item"]}>
            <h2 className={styles["model__spec-field"]}>Operating System</h2>
            <p className={styles["model__spec-description"]}>
              {data?.phone.specs.operatingSystem || <Skeleton count={2} />}
            </p>
          </li>
          <li className={styles["model__spec-item"]}>
            <h2 className={styles["model__spec-field"]}>Chipset</h2>
            <p className={styles["model__spec-description"]}>
              {data?.phone.specs.chipset || <Skeleton count={2} />}
            </p>
          </li>
          <li className={styles["model__spec-item"]}>
            <h2 className={styles["model__spec-field"]}>CPU</h2>
            <p className={styles["model__spec-description"]}>
              {data?.phone.specs.cpu || <Skeleton count={2} />}
            </p>
          </li>
          <li className={styles["model__spec-item"]}>
            <h2 className={styles["model__spec-field"]}>GPU</h2>
            <p className={styles["model__spec-description"]}>
              {data?.phone.specs.gpu || <Skeleton count={2} />}
            </p>
          </li>
          <li className={styles["model__spec-item"]}>
            <h2 className={styles["model__spec-field"]}>USB</h2>
            <p className={styles["model__spec-description"]}>
              {data?.phone.specs.usb || <Skeleton count={2} />}
            </p>
          </li>
          <li className={styles["model__spec-item"]}>
            <h2 className={styles["model__spec-field"]}>Card Slot</h2>
            <p className={styles["model__spec-description"]}>
              {data?.phone.specs.cardSlot || <Skeleton count={2} />}
            </p>
          </li>
          <li className={styles["model__spec-item"]}>
            <h2 className={styles["model__spec-field"]}>Sensors</h2>
            <p className={styles["model__spec-description"]}>
              {data?.phone.specs.sensors || <Skeleton count={2} />}
            </p>
          </li>
          <li className={styles["model__spec-item"]}>
            <h2 className={styles["model__spec-field"]}>Network</h2>
            <p className={styles["model__spec-description"]}>
              {data?.phone.specs.network || <Skeleton count={2} />}
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
}

Model.getLayout = function getLayout(page) {
  return <ClientLayout>{page}</ClientLayout>;
};
