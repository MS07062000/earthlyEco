import makeApiRequest from "../../utils/apiUtils";

export default async (addressId: string) => {
  const requestOptions = {
    url: `api/v1/address/default/${addressId}`,
    method: "PUT",
  };

  return await makeApiRequest(requestOptions);
};
