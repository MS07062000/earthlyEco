import { Request, Response } from "express";
import { getAuth } from "firebase-admin/auth";

export default (req: Request, res: Response, next: any) => {
  const sessionCookie = req.cookies.session || "";
  //console.log("Session cookie: ",sessionCookie);
  
  getAuth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((decodedClaims) => {
      // Session is valid. Provision the user and continue.
      req.body.userUID = decodedClaims.uid;
      next();
    })
    .catch((error) => {
      // Session is invalid. Redirect to login.
      res.sendStatus(401);
    });
};
