import AdminLayout from "../../components/Layouts/AdminLayout";
import styles from "../../styles/Dashboard.module.scss";
import ShoppingCartCheckoutOutlinedIcon from "@mui/icons-material/ShoppingCartCheckoutOutlined";
import SmartphoneOutlinedIcon from "@mui/icons-material/SmartphoneOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import Head from "next/head";
// import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useSWR from "swr";

export default function Dashboard() {
  const { data: user, error: userError } = useSWR("/api/user");
  const { data: dataCounts, error: countError } = useSWR(
    "/api/admin/dashboard",
    { revalidateOnMount: true, refreshInterval: 3000 }
  );
  return (
    <div className={styles["dashboard"]}>
      <Head>
        <title>Dashboard | Emphoneum Admin</title>
      </Head>
      <div className={styles["dashboard__header-wrap"]}>
        <p className={styles["dashboard__welcome"]}>Welcome,</p>
        <p className={styles["dashboard__admin-name"]}>
          {user?.userData?.firstname ? user?.userData?.firstname : <Skeleton />}
        </p>
      </div>
      <div className={styles["dashboard__basic-overview-wrap"]}>
        <div className={styles["dashboard__overview"]}>
          <ShoppingCartCheckoutOutlinedIcon
            className={styles["dashboard__overview-icon"]}
          />
          <span className={styles["dashboard__overview-count"]}>
            {dataCounts?.orderCount ? (
              dataCounts?.orderCount?.toLocaleString()
            ) : (
              <Skeleton />
            )}
          </span>
          <p className={styles["dashboard__overview-name"]}>Pending Orders</p>
        </div>
        <div className={styles["dashboard__overview"]}>
          <PeopleAltOutlinedIcon
            className={styles["dashboard__overview-icon"]}
          />
          <span className={styles["dashboard__overview-count"]}>
            {dataCounts?.userCount ? (
              dataCounts?.userCount?.toLocaleString()
            ) : (
              <Skeleton />
            )}
          </span>
          <p className={styles["dashboard__overview-name"]}>Users</p>
        </div>
        <div className={styles["dashboard__overview"]}>
          <CategoryOutlinedIcon
            className={styles["dashboard__overview-icon"]}
          />
          <span className={styles["dashboard__overview-count"]}>
            {dataCounts?.brandCount ? (
              dataCounts?.brandCount?.toLocaleString()
            ) : (
              <Skeleton />
            )}
          </span>
          <p className={styles["dashboard__overview-name"]}>Brands</p>
        </div>
        <div className={styles["dashboard__overview"]}>
          <SmartphoneOutlinedIcon
            className={styles["dashboard__overview-icon"]}
          />
          <span className={styles["dashboard__overview-count"]}>
            {dataCounts?.phoneCount ? (
              dataCounts?.phoneCount?.toLocaleString()
            ) : (
              <Skeleton />
            )}
          </span>
          <p className={styles["dashboard__overview-name"]}>Phone Models</p>
        </div>
      </div>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
