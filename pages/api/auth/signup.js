import { addUser } from "../../../lib/user-queries";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";
import { hash } from "bcrypt";

export default async function signup(req, res) {
  const { username, email, firstname, lastname, password } = req.body;
  const encryptedPass = await hash(req.body.password, 10);
  const accountBody = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    address: req.body.address,
    password: encryptedPass,
  };
  let result = await addUser(accountBody);

  if (result.success) {
    const date = new Date();
    const token = sign(
      { userId: result.userId, role: result.role },
      process.env.JWT_SECRET
    );
    const serialized = serialize("sessionToken", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: date.setTime(date.getTime() + 14 * 24 * 60 * 60 * 1000),
      path: "/",
    });
    res.setHeader("Set-Cookie", serialized);
  }
  res.status(200).json({ ...result });
}
