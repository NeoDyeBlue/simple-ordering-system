import { getPhone } from "../../../../../lib/phone-queries";

export default async function handler(req, res) {
  const { brand, model } = req.query;
  console.log(req.query);
  let response = {};
  if (req.method !== "GET") {
    return res.status(405).json({ message: "method is not allowed" });
  }
  response = await getPhone(brand, model);

  res.status(200).json(response);
}
