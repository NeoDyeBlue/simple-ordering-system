import { getAllUsers } from "../../../lib/user-queries";

export default async function handler(req, res) {
  let response = null;

  if (req.method !== "GET")
    return res.status(405).json({ message: "method now allowed" });

  response = await getAllUsers("client");

  res.status(200).json({ ...response });
}
