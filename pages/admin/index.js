import AdminLayout from "../../components/Layouts/AdminLayout";
import styles from "../../styles/Dashboard.module.scss";
import Head from "next/head";
import { AdminContext } from "../../contexts/Admin.context";
import { useEffect, useContext } from "react";

export default function Dashboard() {
  const { setActivePage } = useContext(AdminContext);
  useEffect(() => setActivePage("dashboard"), []);
  return (
    <div>
      <Head>
        <title>Dashboard | Emphoneum Admin</title>
      </Head>
      <h1>Dashboard</h1>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
