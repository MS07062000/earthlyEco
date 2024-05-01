import makeApiRequest from "../../utils/apiUtils";

export default async (category: string) => {
  const requestOptions = {
    url: `api/v1/product/${category}`,
    method: "GET"
  };

  return await makeApiRequest(requestOptions);
};
