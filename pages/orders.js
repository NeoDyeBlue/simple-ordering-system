import ClientLayout from "../components/Layouts/ClientLayout";
import styles from "../styles/Orders.module.scss";
import useSWR from "swr";
import Head from "next/head";
import OrderItem from "../components/Orders/OrderItem";

export default function Orders() {
  const { data, error } = useSWR("/api/orders", { revalidateOnMount: true });
  const orderItems = data?.orders.map((order) => (
    <OrderItem
      key={order._id}
      status={order.status}
      phone={order.phone}
      variation={order.variation}
      color={order.color}
    />
  ));
  return (
    <div className={styles["orders"]}>
      <Head>
        <title>Orders | Emphoneum </title>
      </Head>
      <div className={styles["orders__header-wrap"]}>
        <h1 className={styles["orders__header"]}>Orders</h1>
      </div>
      <ul className={styles["orders__list"]}>{orderItems}</ul>
    </div>
  );
}

Orders.getLayout = function getLayout(page) {
  return <ClientLayout>{page}</ClientLayout>;
};
