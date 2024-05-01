import { getAuth } from "firebase-admin/auth";

export const verifyToken = async (idToken: string) => {
  try {
    const decodedIdToken = await getAuth().verifyIdToken(idToken);
    return decodedIdToken;
  } catch (error) {
    console.log("Error verifying ID token: ", error);
    return null;
  }
};
