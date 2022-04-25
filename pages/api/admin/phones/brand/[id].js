import {
  getBrand,
  updateBrand,
  deleteBrand,
} from "../../../../../lib/brand-queries";

export default async function handler(req, res) {
  let result = null;
  let { id } = req.query;
  if (method == "GET") {
    result = await getBrand(id);
  } else if (method == "POST") {
    result = await updateBrand(id, req.body);
  } else if (method == "DELETE") {
    result = await deleteBrand(id);
  } else {
    return res.status(405).json({ message: "method not allowed" });
  }

  return res.status(200).json(result);
}
