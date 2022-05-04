import AdminLayout from "../../components/Layouts/AdminLayout";
import Head from "next/head";
import styles from "../../styles/admin/Tables.module.scss";
import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import useSWR, { mutate } from "swr";
import { toast } from "react-toastify";

export default function Orders() {
  const { data, error } = useSWR("/api/admin/orders", {
    revalidateOnMount: true,
    refreshInterval: 3000,
  });

  function approveOrder(order, phone, variation) {
    fetch(`/api/admin/orders`, {
      method: "POST",
      body: JSON.stringify({
        orderId: order,
        phoneId: phone,
        variationId: variation,
      }),
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          mutate("/api/admin/models");
          mutate("/api/admin/orders");
        } else {
          toast.error(`Approve failed! ${data.message}`, {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
        }
      })
      .catch((err) => console.log(err));
  }

  function createTableRows() {
    if (data) {
      return data.orders.map((data) => {
        const orderVariation = data.phone.variations.find(
          (variation) => variation._id == data.variation
        );
        const orderColor = data.phone.colors.find(
          (color) => color._id == data.color
        );
        return (
          <Tr className={styles["table__row"]} key={data._id}>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              {data.phone.name}
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              {data.phone.brand.name}
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              {orderVariation.rom >= 1000
                ? `${orderVariation.rom / 1000}TB`
                : `${orderVariation.rom}GB`}{" "}
              / {orderVariation.ram}GB
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              <div className={styles["table__order-color-wrap"]}>
                <span
                  className={styles["table__order-color"]}
                  style={{ backgroundColor: orderColor.hexValue }}
                ></span>
                <p className={styles["table__order-color-name"]}>
                  {orderColor.colorName}
                </p>
              </div>
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              ₱{orderVariation.price.toLocaleString()}
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              {data.user.fullname}
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              {data.user.phoneNumber}
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              {data.user.email}
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              {data.user.address}
            </Td>
            <Td
              className={`${styles["table__td"]} ${styles["table__td--min-150"]}`}
            >
              {data.status == "pending" ? (
                <button
                  onClick={() =>
                    approveOrder(data._id, data.phone._id, orderVariation._id)
                  }
                  className={`${styles["table__button"]} ${styles["table__button--auto"]}`}
                >
                  Approve
                </button>
              ) : (
                <p className={styles["table__action-status"]}>Approved</p>
              )}
            </Td>
          </Tr>
        );
      });
    }
  }
  const tableRows = createTableRows();

  return (
    <div className={styles["panel"]}>
      <Head>
        <title>Orders | Emphoneum Admin</title>
      </Head>
      <div className={styles["panel__table-wrap"]}>
        <Table className={styles["table"]}>
          <Thead className={styles["table__head"]}>
            <Tr className={styles["table__head-row"]}>
              <Th className={styles["table__th"]}>Model</Th>
              <Th className={styles["table__th"]}>Brand</Th>
              <Th className={styles["table__th"]}>Variation</Th>
              <Th className={styles["table__th"]}>Color</Th>
              <Th className={styles["table__th"]}>Price</Th>
              <Th className={styles["table__th"]}>Placed by</Th>
              <Th className={styles["table__th"]}>Contact No.</Th>
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

Orders.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
