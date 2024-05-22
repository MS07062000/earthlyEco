import axios from "axios";
import { BASEURL, ORIGIN } from "../../config";

export default async (token: string): Promise<void> => {
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

  return await axios.request(requestOptions);
};
