
import makeApiRequest from '../../utils/apiUtils';

export default async (userUID:string) => {
    const requestOptions = {
        url: 'clearCartOfUser',
        data:{
            userUID,
        },
    };
    
    return await makeApiRequest(requestOptions);
}