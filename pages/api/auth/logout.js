import { serialize } from "cookie";

export default async function signOut(req, res) {
  const serialized = serialize("sessionToken", null, {
    httpOnly: true,
    sameSite: "strict",
    maxAge: -1,
    path: "/",
  });
  res.setHeader("Set-Cookie", serialized);
  res.end();
}
