import Head from "next/head";
import styles from "../../styles/Brand.module.scss";
import ClientLayout from "../../components/Layouts/ClientLayout";
import CategoriesLayout from "../../components/Layouts/CategoriesLayout";
import Card from "../../components/Products/Card";
import { getAllBrands } from "../../lib/brand-queries";
import { getAllPhonesByBrand } from "../../lib/phone-queries";

export async function getStaticPaths() {
  const { brands } = await getAllBrands();
  const paths = JSON.parse(JSON.stringify(brands)).map((item) => ({
    params: { brand: item.name.split(" ").join("-").toLowerCase() },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const brandName = context.params.brand.split("-").join(" ");
  const data = await getAllPhonesByBrand(brandName);

  return {
    props: { data: JSON.parse(JSON.stringify(data)) },
  };
}

export default function Brand({ data }) {
  const productCards = data.phones.map((phone) => (
    <Card
      name={phone.name}
      image={phone.image.url}
      variations={phone.variations}
    />
  ));
  return (
    <div className={styles["brand"]}>
      <Head>
        <title>{data.brand} Phones | Emphoneum Phone Shop</title>
        <meta
          name="description"
          content={`Shop ${data.brand} phones in Emphoneum`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles["brand__name-wrap"]}>
        <h1 className={styles["brand__name"]}>{data.brand}</h1>
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
