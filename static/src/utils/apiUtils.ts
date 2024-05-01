import axios, { AxiosError } from "axios";
import { BASEURL, ORIGIN } from "../config";
import { useNavigate } from "react-router-dom";

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

  try {
    const response = await axios.request(requestOptions);
    return response.data ?? undefined;
  } catch (error: AxiosError | any) {
    if (error.response && error.response.status === 403) {
      // Redirect to sign-in page if response status is 403 (Forbidden)
      const navigate = useNavigate();
      navigate("/signIn", { replace: true });
      // Adjust the route as per your application's routing setup
    }
    // Re-throw the error to be caught by the caller
    throw error;
  }
};

export default makeApiRequest;
