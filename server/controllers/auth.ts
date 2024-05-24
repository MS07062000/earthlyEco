import { CookieOptions, Request, Response } from "express";
import { verifyToken } from "../services/authOperations/verifyToken";
import { createSessionCookie } from "../services/authOperations/createSessionCookie";
export default {
  createSession: async (req: Request, res: Response) => {
    const idToken = req.headers.authorization?.split(" ")[1];
    if (!idToken) {
      res.status(401).send("UNAUTHORIZED REQUEST!");
      return;
    }

    // Set session expiration to 14 days.
    const expiresIn = 60 * 60 * 24 * 14 * 1000; // 60 * 5 * 1000;

    const decodedIdToken = await verifyToken(idToken);
    if (!decodedIdToken) {
      res.status(401).send("UNAUTHORIZED REQUEST!");
      return;
    }

    const authTime = decodedIdToken.auth_time;
    const hasLoginRecently =
      authTime && new Date().getTime() / 1000 - authTime < 5 * 60;

    if (hasLoginRecently) {
      const options: CookieOptions = {
        maxAge: expiresIn,
        httpOnly: true,
        sameSite: "none",
        secure: true,
      };

      const sessionCookie = await createSessionCookie(idToken, expiresIn);
      // console.log(sessionCookie);
      if (sessionCookie) {
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      } else {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
      return;
    } else {
      res.status(401).send("Recent sign in required!");
    }
  },
  clearSession: (req: Request, res: Response) => {
    res.clearCookie("session").end(JSON.stringify({ status: "success" }));
  },
};
