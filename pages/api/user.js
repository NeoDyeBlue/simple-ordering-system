import { getUserBasicInfo, updateUserInfo } from "../../lib/user-queries";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  // if (req.method !== "GET" || req.method !== "POST")
  //   return res.status(405).json({ message: "method not allowed" });
  const { cookies } = req;
  const jwt = cookies.sessionToken;
  const response = {
    authenticated: false,
  };
  const { userId, role } = verify(jwt, process.env.JWT_SECRET);

  console.log(userId, role);

  if (jwt && userId) {
    if (req.method == "GET") {
      response.authenticated = true;
      response.userData = await getUserBasicInfo(userId, role);
    } else if (req.method == "POST") {
      const body = req.body;
      response.authenticated = true;
      response.result = await updateUserInfo(userId, body);
    }

    return res.status(200).json({ ...response });
  }

  res.status(401).json({ message: "request unauthorized" });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
