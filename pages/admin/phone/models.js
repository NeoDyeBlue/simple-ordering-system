import AdminLayout from "../../../components/Layouts/AdminLayout";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Head from "next/head";
import { AdminContext } from "../../../contexts/Admin.context";
import { useEffect, useContext, useState } from "react";
import styles from "../../../styles/admin/Models.module.scss";
import Image from "next/image";

export default function Models() {
  const {
    setActivePage,
    setModelModalIsOpen,
    setModelDeleteModalIsOpen,
    setModelToEdit,
    setModelToDelete,
    setModelTableData,
    modelTableData,
  } = useContext(AdminContext);
  useEffect(() => setActivePage("models"), []);
  useEffect(() => {
    fetch("/api/admin/phones/model")
      .then((res) => res.json())
      .then((data) => setModelTableData([...data.phones]));
  }, []);

  function handleAddModelClick() {
    setModelToEdit(null);
    setModelModalIsOpen(true);
  }

  function createTableRows() {
    if (modelTableData) {
      return modelTableData.map((data) => (
        <Tr className={styles["table__row"]} key={data._id}>
          <Td className={styles["table__td"]}>
            <div className={styles["table__image-wrap"]}>
              <Image
                className={styles["table__image"]}
                src={data.image.url}
                alt="Model image"
                layout="fixed"
                width={64}
                height={64}
                priority={true}
              />
            </div>
          </Td>
          <Td className={styles["table__td"]}>{data.name}</Td>
          <Td className={styles["table__td"]}>{data.brand.name}</Td>
          <Td className={styles["table__td"]}>
            <div className={styles["table__pills-wrap"]}>
              {data.variations.map((storage) => (
                <p className={styles["table__info-pill"]}>{storage.rom}GB</p>
              ))}
            </div>
          </Td>
          <Td className={styles["table__td"]}>
            <div className={styles["table__pills-wrap"]}>
              {data.variations.map((storage, index) => (
                <p key={index} className={styles["table__info-pill"]}>
                  {storage.ram}GB
                </p>
              ))}
            </div>
          </Td>
          <Td className={styles["table__td"]}>
            <div className={styles["table__pills-wrap"]}>
              {data.variations.map((item, index) => (
                <p key={index} className={styles["table__info-pill"]}>
                  ₱{item.price.toLocaleString()}
                </p>
              ))}
            </div>
          </Td>
          <Td className={styles["table__td"]}>
            <div className={styles["table__pills-wrap"]}>
              {data.variations.map((item, index) => (
                <p key={index} className={styles["table__info-pill"]}>
                  {item.quantity}
                </p>
              ))}
            </div>
          </Td>
          <Td className={styles["table__td"]}>
            <div className={styles["table__buttons-wrap"]}>
              <button
                className={styles["table__button"]}
                onClick={() => {
                  setModelToEdit(data);
                  setModelModalIsOpen(true);
                }}
              >
                <EditOutlinedIcon className={styles["table__button-icon"]} />
              </button>
              <button
                className={styles["table__button"]}
                onClick={() => {
                  setModelToDelete(data);
                  setModelDeleteModalIsOpen(true);
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
    <div className={styles["brands"]}>
      <Head>
        <title>Phone Models | Emphoneum Admin</title>
      </Head>
      <button
        onClick={handleAddModelClick}
        className={styles["brands__add-button"]}
      >
        <AddOutlinedIcon className={styles["brand__add-button-icon"]} />
        Add a Model
      </button>
      <div className={styles["brands__table-wrap"]}>
        <Table className={styles["table"]}>
          <Thead className={styles["table__head"]}>
            <Tr className={styles["table__head-row"]}>
              <Th className={styles["table__th"]}>Model Image</Th>
              <Th className={styles["table__th"]}>Model Name</Th>
              <Th className={styles["table__th"]}>Brand Name</Th>
              <Th className={styles["table__th"]}>ROM</Th>
              <Th className={styles["table__th"]}>RAM</Th>
              <Th className={styles["table__th"]}>Price</Th>
              <Th className={styles["table__th"]}>Quantity</Th>
              <Th className={styles["table__th"]}>Actions</Th>
            </Tr>
          </Thead>
          <Tbody className={styles["table__body"]}>{tableRows}</Tbody>
        </Table>
      </div>
    </div>
  );
}

Models.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
