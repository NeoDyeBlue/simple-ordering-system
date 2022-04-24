import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.scss";
import ClientLayout from "../components/Layouts/ClientLayout";
import CategoriesLayout from "../components/Layouts/CategoriesLayout";
import MainFeatured from "../components/Home/MainFeatured";
import Featured from "../components/Home/Featured";
import Card from "../components/Products/Card";

export default function Home() {
  return (
    <div className={styles["l-home"]}>
      <Head>
        <title>Euphoneum | Shop Phones from Major Brands</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles["l-home__featured"]}>
        <div className={styles["c-featured"]}>
          <div className={styles["c-featured__main"]}>
            <MainFeatured />
          </div>
          <div className={styles["c-featured__other"]}>
            <Featured />
          </div>
          <div className={styles["c-featured__other"]}>
            <Featured />
          </div>
        </div>
      </div>
      <div className={styles["l-home__label"]}>
        <h2 className={styles["c-label"]}>Phones for You</h2>
      </div>
      <div className={styles["l-home__products"]}>
        <Card />
      </div>
    </div>
  );
}

Home.getLayout = function getLayout(page) {
  return (
    <ClientLayout>
      <CategoriesLayout>{page}</CategoriesLayout>
    </ClientLayout>
  );
};
