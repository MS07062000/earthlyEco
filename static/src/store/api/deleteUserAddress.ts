import makeApiRequest from "../../utils/apiUtils";
import { Address } from "../interfaces";

export default async (userUID: string, address: Address) => {
  const requestOptions = {
    url: "deleteAddress",
    data: {
      userUID: userUID,
      address: address,
    },
  };

  return await makeApiRequest(requestOptions);
};
