import { getAllOrders } from "../../../../lib/order-queries";

export default async function handler(req, res) {
  let response = null;
  if (req.method == "GET") {
    response = await getAllOrders();
  }

  res.status(200).json({ ...response });
}
