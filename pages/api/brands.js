import { getAllBrands } from "../../lib/brand-queries";

export default async function handler(req, res) {
  let response = {};
  if (req.method !== "GET") {
    return res.status(405).json({ message: "method is now allowed" });
  }

  response = await getAllBrands();

  res.status(200).json(response);
}
