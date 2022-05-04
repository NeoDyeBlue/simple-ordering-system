import AdminLayout from "../../components/Layouts/AdminLayout";
import Head from "next/head";
import { AdminContext } from "../../contexts/Admin.context";
import { useEffect, useContext } from "react";
import Image from "next/image";
import styles from "../../styles/admin/Tables.module.scss";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import useSWR from "swr";

export default function Users() {
  const { data, error } = useSWR("/api/admin/users", {
    revalidateOnMount: true,
    refreshInterval: 3000,
  });

  function createTableRows() {
    if (data) {
      return data.users.map((data) => (
        <Tr className={styles["table__row"]} key={data._id}>
          <Td className={styles["table__td"]}>
            <div
              className={`${styles["table__image-wrap"]} ${styles["table__image-wrap--circ"]}`}
            >
              <Image
                className={`${styles["table__image"]} ${styles["table__image--circ"]}`}
                src={data.image.url}
                alt="User image"
                layout="fill"
                priority={true}
              />
            </div>
          </Td>
          <Td className={styles["table__td"]}>{data.fullname}</Td>
          <Td className={styles["table__td"]}>{data.phoneNumber}</Td>
          <Td className={styles["table__td"]}>{data.email}</Td>
          <Td className={styles["table__td"]}>{data.address}</Td>
          <Td className={styles["table__td"]}></Td>
        </Tr>
      ));
    }
  }
  const tableRows = createTableRows();

  return (
    <div className={styles["panel"]}>
      <Head>
        <title>Users | Emphoneum Admin</title>
      </Head>
      <div className={styles["panel__table-wrap"]}>
        <Table className={styles["table"]}>
          <Thead className={styles["table__head"]}>
            <Tr className={styles["table__head-row"]}>
              <Th className={styles["table__th"]}>User Image</Th>
              <Th className={styles["table__th"]}>Fullname</Th>
              <Th className={styles["table__th"]}>Phone Number</Th>
              <Th className={styles["table__th"]}>Email</Th>
              <Th className={styles["table__th"]}>Address</Th>
              <Th className={styles["table__th"]}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody className={styles["table__body"]}>{tableRows}</Tbody>
        </Table>
      </div>
    </div>
  );
}

Users.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
