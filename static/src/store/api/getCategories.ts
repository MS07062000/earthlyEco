import makeApiRequest from "../../utils/apiUtils";

export const getCategories = async () => {
  const requestOptions = {
    url: "getCategories",
  };

  return await makeApiRequest(requestOptions);
};