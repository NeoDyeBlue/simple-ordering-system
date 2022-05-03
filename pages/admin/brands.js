import AdminLayout from "../../components/Layouts/AdminLayout";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Head from "next/head";
import { AdminContext } from "../../contexts/Admin.context";
import { useEffect, useContext } from "react";
import styles from "../../styles/admin/Tables.module.scss";
import Image from "next/image";
import useSWR from "swr";

export default function Brands() {
  const {
    setBrandModalIsOpen,
    setBrandDeleteModalIsOpen,
    setBrandToEdit,
    setBrandToDelete,
    // setBrandTableData,
    // brandTableData,
  } = useContext(AdminContext);
  const { data, error } = useSWR("/api/admin/brands", {
    revalidateOnMount: true,
  });

  function handleAddBrandClick() {
    setBrandToEdit(null);
    setBrandModalIsOpen(true);
  }

  function createTableRows() {
    if (data) {
      return data.brands.map((data) => (
        <Tr className={styles["table__row"]} key={data._id}>
          <Td className={styles["table__td"]}>
            <div className={styles["table__image-wrap"]}>
              <Image
                className={styles["table__image"]}
                src={data.image.url}
                alt="Brand image"
                layout="fixed"
                width={64}
                height={64}
                priority={true}
              />
            </div>
          </Td>
          <Td className={styles["table__td"]}>{data.name}</Td>
          <Td className={styles["table__td"]}>
            <div className={styles["table__buttons-wrap"]}>
              <button
                className={styles["table__button"]}
                onClick={() => {
                  setBrandToEdit(data);
                  setBrandModalIsOpen(true);
                }}
              >
                <EditOutlinedIcon className={styles["table__button-icon"]} />
              </button>
              <button
                className={styles["table__button"]}
                onClick={() => {
                  setBrandToDelete(data);
                  setBrandDeleteModalIsOpen(true);
                }}
              >
                <DeleteOutlinedIcon className={styles["table__button-icon"]} />
              </button>
            </div>
          </Td>
        </Tr>
      ));
    }
  }

  const tableRows = createTableRows();

  return (
    <div className={styles["panel"]}>
      <Head>
        <title>Phone Brands | Emphoneum Admin</title>
      </Head>
      <button
        onClick={handleAddBrandClick}
        className={styles["panel__add-button"]}
      >
        <AddOutlinedIcon className={styles["brand__add-button-icon"]} />
        Add a Brand
      </button>
      <div className={styles["panel__table-wrap"]}>
        <Table className={styles["table"]}>
          <Thead className={styles["table__head"]}>
            <Tr className={styles["table__head-row"]}>
              <Th className={styles["table__th"]}>Brand Image</Th>
              <Th className={styles["table__th"]}>Brand Name</Th>
              <Th className={styles["table__th"]}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody className={styles["table__body"]}>{tableRows}</Tbody>
        </Table>
      </div>
    </div>
  );
}

Brands.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
