import makeApiRequest from '../../utils/apiUtils';
import { Address } from '../interfaces';

export const editAddress = async (userUID:string,oldAddress:Address,newAddress:Address) => {
    const requestOptions = {
        url: 'editAddress',
       data:{
            userUID,
            oldAddress,
            newAddress,
        },
    };
    
    return await makeApiRequest(requestOptions);
}