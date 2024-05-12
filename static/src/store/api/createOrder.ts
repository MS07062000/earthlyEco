import { Address, ProductOrder } from "../interfaces";
import makeApiRequest from "../../utils/apiUtils";

export default async (
  products: ProductOrder[],
  amount: number,
  deliveryAddress: Address
) => {
  const requestOptions = {
    url: "api/v1/order/create",
    method: "POST",
    data: {
      products,
      amount,
      deliveryAddress,
    },
  };

  return await makeApiRequest(requestOptions);
};
