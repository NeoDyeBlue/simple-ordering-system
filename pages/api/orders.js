import { addOrder, getOrders, 
 } from "../../lib/order-queries";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  //   if (req.method !== "POST" || req.method !== "GET")
  //     return res.status(405).json({ message: "method not allowed" });
  const { cookies } = req;
  const jwt = cookies.sessionToken;
  let response = {};

  // console.log(userId, role);

  if (jwt) {
    const { userId } = verify(jwt, process.env.JWT_SECRET);
    if (jwt && userId) {
      if (req.method == "POST") {
        response = await addOrder(userId, req.body);
      }
      else if (req.method == 'GET') {
          response = await getOrders(userId)
      }
    }

    return res.status(200).json({ ...response });
  }

  res.status(401).json({ message: "request unauthorized" });
}
