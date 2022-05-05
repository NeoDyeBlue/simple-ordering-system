import { getUserBasicInfo, updateUserInfo } from "../../lib/user-queries";
import { verify } from "jsonwebtoken";

export default async function handler(req, res) {
  const { cookies } = req;
  const token = cookies.sessionToken;
  const response = {
    authenticated: false,
  };

  if (token) {
    const { userId } = verify(token, process.env.JWT_SECRET);
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

  return res.status(401).json({ ...response });
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "4mb",
    },
  },
};
