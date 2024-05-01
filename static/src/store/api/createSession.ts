import axios from "axios";
import { BASEURL, ORIGIN } from "../../config";

export default async (token: string): Promise<any> => {
  const requestOptions = {
    method: "POST",
    url: `${BASEURL}/api/v1/auth/sessionLogin`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    origin: ORIGIN,
    withCredentials: true,
  };

  const response = await axios.request(requestOptions);
  if (response.headers["set-cookie"]) {
    console.log(response.headers["set-cookie"]);
    response.headers["set-cookie"].forEach((cookie: string, index: number) => {
      console.log(cookie);
      document.cookie = cookie;
    });
  }
};
