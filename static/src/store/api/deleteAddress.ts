import makeApiRequest from '../../utils/apiUtils';
import { Address } from '../interfaces';

export const deleteAddress = async (userUID: string, address: Address) => {
  const requestOptions = {
    url: 'deleteAddress',
    data: {
      userUID: userUID,
      address: address,
    },
  };

  return await makeApiRequest(requestOptions);
};
