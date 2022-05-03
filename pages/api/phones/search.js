import { searchPhones } from "../../../lib/phone-queries";

export default async function handler(req, res) {
  const { q, options } = req.query;
  let response = {};
  if (req.method !== "GET") {
    return res.status(405).json({ message: "method not allowed" });
  }
  response = await searchPhones(q, options);
  res.status(200).json(response);
}
