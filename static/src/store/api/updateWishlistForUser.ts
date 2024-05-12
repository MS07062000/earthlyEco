import makeApiRequest from "../../utils/apiUtils";

export default async(productId: string) => {
  const requestOptions = {
    url: "api/v1/wishlist",
    method: "POST",
    data: {
      productId,
    }
  };
  
  return await makeApiRequest(requestOptions);
};
