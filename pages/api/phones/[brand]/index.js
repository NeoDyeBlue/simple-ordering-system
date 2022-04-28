import { getAllPhones } from "../../../../lib/phone-queries";

export default async function handler(req, res) {
  const { brand } = req.query;
  const filter = Object.fromEntries(
    Object.entries(req.query).filter(([key, _]) => key !== "brand")
  );
  let response = {};
  if (req.method !== "GET") {
    return res.status(405).json({ message: "method is not allowed" });
  }
  response = await getAllPhones(brand, filter);

  res.status(200).json(response);
}
