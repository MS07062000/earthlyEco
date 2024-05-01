import { Address, CategoryWithProductsInfo } from "../interfaces";
import makeApiRequest from "../../utils/apiUtils";

export default async (categoryWithProductsInfo: CategoryWithProductsInfo[], amount: number, deliveryAddress: Address ) => {
  const requestOptions = {
    url: "api/v1/order/create",
    method: "POST",
    data: {
      categoryWithProductsInfo,
      amount,
      deliveryAddress,
    },
  };

  return await makeApiRequest(requestOptions);
};
