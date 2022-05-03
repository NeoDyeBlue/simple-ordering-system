import Head from "next/head";
import styles from "../styles/Catalog.module.scss";
import ClientLayout from "../components/Layouts/ClientLayout";
// import CategoriesLayout from "../components/Layouts/CategoriesLayout";
import Card from "../components/Products/Card";
import { useRouter } from "next/dist/client/router";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import usePhonesSearchPaginate from "../utils/usePhonesSearchPaginate";
import { searchPhones } from "../lib/phone-queries";

export async function getServerSideProps(context) {
  const { query } = context;
  const searchQuery = query?.q?.length ? query.q : "";
  const data = await searchPhones(searchQuery);
  return {
    props: {
      initData: JSON.parse(JSON.stringify(data)),
    },
  };
}

export default function Search({ initData }) {
  const router = useRouter();
  const { q } = router.query;
  const searchQuery = q?.length ? q.split(" ").join("+") : "";
  //   const { data: phonesData, error } = useSWR(
  //     `/api/phones/search?q=${searchQuery}`,
  //     {
  //       revalidateOnMount: true,
  //       initialData: initData?.phones.length ? initData : null,
  //     }
  //   );
  const { phonesData, endReached, isLoading, size, setSize, error, mutate } =
    usePhonesSearchPaginate(`/api/phones/search?q=${searchQuery}`, 8, {
      initialData: initData.length ? initData : null,
    });

  //   console.log(phonesData);

  const productCards = phonesData?.map((phone) => {
    // console.log(phone);
    return (
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
    );
  });

  return (
    <div className={`${styles["catalog"]} ${styles["catalog--no-margin-top"]}`}>
      <Head>
        <title>Search | Emphoneum Phone Shop</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        className={`${styles["catalog__search-label-wrap"]} ${styles["catalog__search-label-wrap--margin-top"]}`}
      >
        <h1 className={styles["catalog__label"]}>
          {q?.length ? `Search results for '${q}'` : "All Phones"}
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

Search.getLayout = function getLayout(page) {
  return <ClientLayout>{page}</ClientLayout>;
};
