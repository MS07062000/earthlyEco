import makeApiRequest from "../../utils/apiUtils";
import { Address } from "../interfaces";

export default async ( oldAddress: Address, newAddress: Address ) => {
  const requestOptions = {
    url: "api/v1/address",
    method: "PUT",
    data: {
      oldAddress,
      newAddress,
    },
  };

  return await makeApiRequest(requestOptions);
};
