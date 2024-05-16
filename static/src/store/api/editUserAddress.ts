import makeApiRequest from "../../utils/apiUtils";
import { Address } from "../interfaces";

export default async ( addressId:string, address: Address ) => {
  const requestOptions = {
    url: `api/v1/address/${addressId}`,
    method: "PUT",
    data: {
      address
    },
  };

  return await makeApiRequest(requestOptions);
};
