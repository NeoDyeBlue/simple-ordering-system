import AdminLayout from "../../components/Layouts/AdminLayout";
import Head from "next/head";
import { AdminContext } from "../../contexts/Admin.context";
import { useEffect, useContext } from "react";

export default function Users() {
  const { setActivePage } = useContext(AdminContext);
  useEffect(() => setActivePage("users"), []);
  return (
    <div>
      <Head>
        <title>Users | Emphoneum Admin</title>
      </Head>
      <h1>Users</h1>
    </div>
  );
}

Users.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
