import makeApiRequest from "../../utils/apiUtils";

export default async (category: string) => {
  const requestOptions = {
    url: "getProducts",
    data: {
      category,
    },
  };

  return await makeApiRequest(requestOptions);
};
