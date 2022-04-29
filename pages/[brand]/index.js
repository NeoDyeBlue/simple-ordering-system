import Head from "next/head";
import styles from "../../styles/Brand.module.scss";
import ClientLayout from "../../components/Layouts/ClientLayout";
import CategoriesLayout from "../../components/Layouts/CategoriesLayout";
import Card from "../../components/Products/Card";
import { useRouter } from "next/dist/client/router";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
// import { getAllBrands } from "../../lib/brand-queries";
// // import { getAllPhones } from "../lib/phone-queries";

// export async function getServerSideProps(context) {
//   const { params } = context;
//   const { brands } = await getAllBrands();
//   const brandNames = brands.map((brand) =>
//     brand.name.split(" ").join("-").toLowerCase()
//   );

//   if (!brandNames.includes(params.brand)) {
//     return { notFound: true };
//   }

//   const data = await getAllPhones(`brand_${params.brand}`, "offset_0,limit_8");
//   return {
//     props: {
//       data: JSON.parse(JSON.stringify(data)),
//     },
//   };
// }

export default function Brand() {
  const router = useRouter();
  const { brand } = router.query;
  const { data, error } = useSWR(
    `/api/phones?query=brand_${brand}&options=offset_0,limit_8`
  );
  const productCards = data?.phones.map((phone) => (
    <Card
      key={phone._id}
      name={phone.name}
      image={phone.image.url}
      variations={phone.variations}
    />
  ));
  return (
    <div className={styles["brand"]}>
      <Head>
        <title>
          {data?.brand
            ? `${data?.brand
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")} Phones`
            : "Loading..."}
          | Emphoneum Phone Shop
        </title>
        <meta
          name="description"
          content={`Shop ${data?.brand} phones in Emphoneum`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles["brand__name-wrap"]}>
        <h1 className={styles["brand__name"]}>
          {data?.brand || <Skeleton className={styles["brand__name"]} />}
        </h1>
      </div>
      <div className={styles["brand__products"]}>{productCards}</div>
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
