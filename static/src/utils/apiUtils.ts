import axios, { AxiosError } from "axios";
import { BASEURL, ORIGIN } from "../config";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks/apphook";
import { logoutSuccess } from "../store/slices/authSlice";

interface RequestOptions {
  method: string;
  url: string;
  data?: any;
  token?: string;
  cookies?: any;
}

const makeApiRequest = async ({
  url,
  data,
  method,
}: RequestOptions): Promise<any> => {
  const requestOptions = {
    method: method,
    url: `${BASEURL}/${url}`,
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    data: data,
    origin: ORIGIN,
    withCredentials: true,
  };
  
  const response = await axios.request(requestOptions);
  return response.data ?? undefined;
};

export default makeApiRequest;
