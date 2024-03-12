import makeApiRequest from "../../utils/apiUtils";

export default async () => {
  const requestOptions = {
    url: "getCategories",
  };

  return await makeApiRequest(requestOptions);
};
