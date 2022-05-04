import { getUserBasicInfo, updateUserInfo } from "../../lib/user-queries";
import { verify } from "jsonwebtoken";
// const jwt = require("@tsndr/cloudflare-worker-jwt");

export default async function handler(req, res) {
  // if (req.method !== "GET" || req.method !== "POST")
  //   return res.status(405).json({ message: "method not allowed" });
  const { cookies } = req;
  const token = cookies.sessionToken;
  const response = {
    authenticated: false,
  };

  // console.log(userId, role);

  if (token) {
    const { userId, role } = verify(token, process.env.JWT_SECRET);
    if (token && userId) {
      if (req.method == "GET") {
        response.authenticated = true;
        response.userData = await getUserBasicInfo(userId);
      } else if (req.method == "POST") {
        const body = req.body;
        response.authenticated = true;
        response.result = await updateUserInfo(userId, body);
      }
    }

    return res.status(200).json({ ...response });
  }

  res.status(401).json({ message: "auth required" });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
