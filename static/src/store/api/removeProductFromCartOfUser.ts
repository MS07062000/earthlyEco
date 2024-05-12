import makeApiRequest from "../../utils/apiUtils";

export default async ( productId: string, quantity: number) => {
  const requestOptions = {
    url: "api/v1/cart/remove",
    method: "DELETE",
    data: {
      productId,
      quantity,
    },
  };
  return await makeApiRequest(requestOptions);
};
