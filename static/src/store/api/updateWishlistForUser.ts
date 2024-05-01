import makeApiRequest from "../../utils/apiUtils";

export default async(product: string) => {
  const requestOptions = {
    url: "api/v1/wishlist",
    method: "POST",
    data: {
      product,
    }
  };
  
  return await makeApiRequest(requestOptions);
};
