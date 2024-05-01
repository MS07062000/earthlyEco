import makeApiRequest from "../../utils/apiUtils";
import { Address } from "../interfaces";

export default async (address: Address) => {
  const requestOptions = {
    url: "api/v1/address",
    method: "DELETE",
    data: {
      address: address,
    },
  };

  return await makeApiRequest(requestOptions);
};
