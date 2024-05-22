import axios from "axios";
import { BASEURL, ORIGIN } from "../../config";

export default async (): Promise<void> => {
  const requestOptions = {
    method: "POST",
    url: `${BASEURL}/api/v1/auth/sessionLogout`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    origin: ORIGIN,
    withCredentials: true,
  };

  return await axios.request(requestOptions);
};
