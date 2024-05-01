
import makeApiRequest from '../../utils/apiUtils';

export default async () => {
    const requestOptions = {
        url: 'api/v1/cart/clear',
        method: 'DELETE',
    };
    
    return await makeApiRequest(requestOptions);
}