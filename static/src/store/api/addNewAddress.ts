import { Address } from '../interfaces';
import makeApiRequest from '../../utils/apiUtils';

export default async (address: Address) => {
  const requestOptions = {
    url: 'api/v1/address',
    method: 'POST',
    data: {
      address,
    },
  };

  return await makeApiRequest(requestOptions);
};
