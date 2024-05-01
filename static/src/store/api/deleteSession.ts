import axios from "axios";
import { BASEURL, ORIGIN } from "../../config";

export default async (): Promise<any> => {
  const requestOptions = {
    method: "POST",
    url: `${BASEURL}/api/v1/auth/sessionLogout`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    origin: ORIGIN,
    withCredentials: true,
  };

  const response = await axios.request(requestOptions);
};
