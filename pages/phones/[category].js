import { useEffect, useContext } from "react";
import { ClientContext } from "../../contexts/Client.context";
import styles from "../../styles/Category.module.scss";
import Head from "next/head";
import ClientLayout from "../../components/Layouts/ClientLayout";
import CategoriesLayout from "../../components/Layouts/CategoriesLayout";
import categories from "../../lib/categories";

export async function getStaticPaths() {
  const paths = [
    "/",
    ...categories.map((category) => category.name.toLowerCase()),
  ];
  return {
    paths,
    fallback: false,
  };
}

export default function Category() {
  const { setActivePage } = useContext(ClientContext);
  return (
    <div className={styles["category"]}>
      <h1></h1>
    </div>
  );
}

Category.getLayout = function getLayout(page) {
  return (
    <ClientLayout>
      <CategoriesLayout>{page}</CategoriesLayout>
    </ClientLayout>
  );
};
