import AdminLayout from "../../components/Layouts/AdminLayout";
import Head from "next/head";
import { AdminContext } from "../../contexts/Admin.context";
import { useEffect, useContext } from "react";

export default function Orders() {
  const { setActivePage } = useContext(AdminContext);
  useEffect(() => setActivePage("orders"), []);
  return (
    <div>
      <Head>
        <title>Orders | Emphoneum Admin</title>
      </Head>
      <h1>Orders</h1>
    </div>
  );
}

Orders.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
