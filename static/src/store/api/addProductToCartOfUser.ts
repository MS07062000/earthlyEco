import makeApiRequest from "../../utils/apiUtils";

export const addProductToCartOfUser = async (
  userUID: string,
  product: string,
  quantity: number
) => {
  const requestOptions = {
    url: "addToCart",
    data: {
      userUID,
      product,
      quantity,
    },
  };

  return await makeApiRequest(requestOptions);
};
