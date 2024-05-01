import makeApiRequest from "../../utils/apiUtils";

export default async ( product: string, quantity: number) => {
  const requestOptions = {
    url: "api/v1/cart/remove",
    method: "DELETE",
    data: {
      product,
      quantity,
    },
  };
  return await makeApiRequest(requestOptions);
};
