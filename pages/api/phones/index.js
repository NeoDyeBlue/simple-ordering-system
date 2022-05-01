import { getAllPhones } from "../../../lib/phone-queries";

export default async function handler(req, res) {
  const { query, options } = req.query;
  let response = {};
  if (req.method !== "GET") {
    return res.status(405).json({ message: "method is not allowed" });
  }
  response = await getAllPhones("all", query, options);

  res.status(200).json(response);
}
