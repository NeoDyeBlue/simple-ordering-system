import { getAllBrands, addBrand } from "../../../../lib/brand-queries";

export default async function handler(req, res) {
  let result = null;
  if (req.method == "GET") {
    result = await getAllBrands();
  } else if (req.method == "POST") {
    result = await addBrand(req.body);
  } else {
    return res.status(405).json({ message: "method not allowed" });
  }

  return res.status(200).json(result);
}
