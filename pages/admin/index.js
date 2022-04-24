import AdminLayout from "../../components/Layouts/AdminLayout";
import styles from "../../styles/Dashboard.module.scss";

export default function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
