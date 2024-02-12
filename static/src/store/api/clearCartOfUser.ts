
import makeApiRequest from '../../utils/apiUtils';

export const clearCartOfUser = async (userUID:string) => {
    const requestOptions = {
        url: 'clearCartOfUser',
        data:{
            userUID,
        },
    };
    
    return await makeApiRequest(requestOptions);
}