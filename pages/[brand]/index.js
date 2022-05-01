import Head from "next/head";
import styles from "../../styles/Catalog.module.scss";
import ClientLayout from "../../components/Layouts/ClientLayout";
import CategoriesLayout from "../../components/Layouts/CategoriesLayout";
import Card from "../../components/Products/Card";
import { useRouter } from "next/dist/client/router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import usePhonesPaginate from "../../utils/usePhonesPaginate";
import { getAllBrands } from "../../lib/brand-queries";
import { getAllPhones } from "../../lib/phone-queries";

export async function getServerSideProps(context) {
  const { params } = context;
  const { brands } = await getAllBrands();
  const brandNames = brands.map((brand) =>
    brand.name.split(" ").join("-").toLowerCase()
  );

  if (!brandNames.includes(params.brand)) {
    return { notFound: true };
  }

  const data = await getAllPhones(params.brand, "", "page_1,limit_8");
  return {
    props: {
      data: JSON.parse(JSON.stringify(data)),
    },
  };
}

export default function Brand({ data }) {
  const router = useRouter();
  const { brand } = router.query;
  const { phonesData, endReached, isLoading, size, setSize, error, mutate } =
    usePhonesPaginate(`/api/phones/${brand}`, 8, {
      initialData: data.phones.length ? data : null,
    });

  const productCards = phonesData?.phones.map((phone) => (
    <Card
      key={phone._id}
      name={phone.name}
      image={phone.image.url}
      link={`/${phone.brand.name
        .split(" ")
        .join("-")
        .toLowerCase()}/${phone.name.split(" ").join("-").toLowerCase()}`}
      variations={phone.variations}
    />
  ));

  return (
    <div className={styles["catalog"]}>
      <Head>
        <title>
          {phonesData?.brand
            ? `${phonesData?.brand
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")} Phones`
            : "Loading..."}{" "}
          | Emphoneum Phone Shop
        </title>
        <meta
          name="description"
          content={`Shop ${phonesData?.brand} phones in Emphoneum`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles["catalog__label-wrap"]} ${styles["catalog__label-wrap--margin-top"]}`}
      >
        <h1 className={styles["catalog__label"]}>
          {phonesData?.brand || "Loading..."}
        </h1>
      </div>
      <div className={styles["catalog__products"]}>
        {productCards ||
          [...Array(8)].map((_, i) => (
            <Skeleton key={i} className={styles["skeleton-card"]} />
          ))}
        {isLoading &&
          [...Array(8)].map((_, i) => (
            <Skeleton key={i} className={styles["skeleton-card"]} />
          ))}
      </div>
      <div className={styles["catalog__more-button-wrap"]}>
        {!endReached && (
          <button
            onClick={() => setSize(size + 1)}
            className={styles["catalog__more-button"]}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  );
}

Brand.getLayout = function getLayout(page) {
  return (
    <ClientLayout>
      <CategoriesLayout>{page}</CategoriesLayout>
    </ClientLayout>
  );
};
