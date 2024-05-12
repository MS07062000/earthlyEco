import makeApiRequest from "../../utils/apiUtils";

export default async ( productId: string, quantity: number) => {
  const requestOptions = {
    url: "api/v1/cart",
    method: "POST",
    data: {
      productId,
      quantity,
    },
  };

  return await makeApiRequest(requestOptions);
};
