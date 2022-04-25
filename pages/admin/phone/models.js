import AdminLayout from "../../../components/Layouts/AdminLayout";
import Head from "next/head";
import { AdminContext } from "../../../contexts/Admin.context";
import { useEffect, useContext } from "react";

export default function Models() {
  const { setActivePage } = useContext(AdminContext);
  useEffect(() => setActivePage("models"), []);
  return (
    <div>
      <Head>
        <title>Phone Models | Emphoneum Admin</title>
      </Head>
      <h1>Models</h1>
    </div>
  );
}

Models.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
