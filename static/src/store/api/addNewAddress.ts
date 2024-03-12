import { Address } from '../interfaces';
import makeApiRequest from '../../utils/apiUtils';

export default async (userUID: string, address: Address) => {
  const requestOptions = {
    url: 'addAddress',
    data: {
      userUID,
      address,
    },
  };

  return await makeApiRequest(requestOptions);
};
