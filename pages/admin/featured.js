import AdminLayout from "../../components/Layouts/AdminLayout";
import Head from "next/head";
import { AdminContext } from "../../contexts/Admin.context";
import { useEffect, useContext } from "react";

export default function Featured() {
  const { setActivePage } = useContext(AdminContext);
  useEffect(() => setActivePage("featured"), []);
  return (
    <div>
      <Head>
        <title>Featured | Emphoneum</title>
      </Head>
      <h1>Featured</h1>
    </div>
  );
}

Featured.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
