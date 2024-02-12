import makeApiRequest from "../../utils/apiUtils";

export const getCartOfUser = async (userUID: string) => {
  const requestOptions = {
    url: "getUserCart",
    data: {
      userUID,
    },
  };
  return await makeApiRequest(requestOptions);
};
