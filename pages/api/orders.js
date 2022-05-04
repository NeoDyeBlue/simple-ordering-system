import { addOrder, getOrders } from "../../lib/order-queries";
import { verify } from "jsonwebtoken";
// const jwt = require("@tsndr/cloudflare-worker-jwt");

export default async function handler(req, res) {
  //   if (req.method !== "POST" || req.method !== "GET")
  //     return res.status(405).json({ message: "method not allowed" });
  const { cookies } = req;
  const token = cookies.sessionToken;
  let response = {};

  // console.log(userId, role);

  if (token) {
    const { userId } = verify(token, process.env.JWT_SECRET);
    if (token && userId) {
      if (req.method == "POST") {
        response = await addOrder(userId, req.body);
        response.authenticated = true;
      } else if (req.method == "GET") {
        response = await getOrders(userId);
        response.authenticated = true;
      }
    }

    return res.status(200).json({ ...response });
  }

  res.status(401).json({ message: "auth required" });
}
