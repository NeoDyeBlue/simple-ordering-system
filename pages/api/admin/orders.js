import { getAllOrders, updateOrder } from "../../../lib/order-queries";

export default async function handler(req, res) {
  let response = null;
  if (req.method == "GET") {
    response = await getAllOrders();
  }

  if (req.method == "POST") {
    const { orderId, phoneId, variationId } = req.body;

    response = await updateOrder(orderId, phoneId, variationId);
    // console.log(req.body);
  }

  res.status(200).json({ ...response });
}
