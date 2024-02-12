import makeApiRequest from "../../utils/apiUtils";

export const updateWishlistForUser = async (
  userUID: string,
  product: string
) => {
  const requestOptions = {
    url: "wishlist",
    data: {
      userUID,
      product,
    },
  };
  return await makeApiRequest(requestOptions);
};
