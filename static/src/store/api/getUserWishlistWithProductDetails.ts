import makeApiRequest from "../../utils/apiUtils";

export default async () => {
  const requestOptions = {
    url: "api/v1/wishlist",
    method: "GET"
  };

  return await makeApiRequest(requestOptions);
};
