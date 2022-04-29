import { getAllPhones, addPhone } from "../../../../lib/phone-queries";

export default async function handler(req, res) {
  let result = null;
  if (req.method == "GET") {
    result = await getAllPhones();
  } else if (req.method == "POST") {
    result = await addPhone(req.body);
  } else {
    return res.status(405).json({ message: "method not allowed" });
  }

  return res.status(200).json(result);
}
