import makeApiRequest from "../../utils/apiUtils";

export default async ( product: string, quantity: number) => {
  const requestOptions = {
    url: "api/v1/cart",
    method: "POST",
    data: {
      product,
      quantity,
    },
  };

  return await makeApiRequest(requestOptions);
};
