import makeApiRequest from "../../utils/apiUtils";

export default async () => {
  const requestOptions = {
    url: "api/v1/order",
    method: "GET",
  };

  return await makeApiRequest(requestOptions);
};
