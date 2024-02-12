import makeApiRequest from "../../utils/apiUtils";

export const getRefundProcessed = async (userUID: string) => {
  const requestOptions = {
    url: "getUserRefunds",
    data: {
      userUID,
    },
  };

  return await makeApiRequest(requestOptions);
};
