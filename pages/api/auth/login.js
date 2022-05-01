import { checkUser } from "../../../lib/user-queries";
import { sign } from "jsonwebtoken";
import { serialize } from "cookie";

export default async function signin(req, res) {
  const { emailOrPhone, password } = req.body;
  const result = await checkUser(emailOrPhone, password);

  if (result.userExists && result.credentialsMatch) {
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
