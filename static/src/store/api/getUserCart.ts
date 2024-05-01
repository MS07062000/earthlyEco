import makeApiRequest from "../../utils/apiUtils";

export default async () => {
  const requestOptions = {
    url: "api/v1/cart",
    method: "GET"
  };
  
  return await makeApiRequest(requestOptions);
};
