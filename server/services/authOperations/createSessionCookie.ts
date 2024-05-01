import { getAuth } from "firebase-admin/auth";

export const createSessionCookie = async (
  idToken: string,
  expiresIn: number
) => {
  try {
    const sessionCookie = await getAuth().createSessionCookie(idToken, {
      expiresIn,
    });
    return sessionCookie;
  } catch (error) {
    console.log("Error creating session cookie: ", error);
    return null;
  }
};
