import makeApiRequest from '../../utils/apiUtils';

export const getAddressesOfUser = async (userUID:string) => {
    const requestOptions = {
        url: 'getAddress',
        data:{
            userUID,
        },
    };
    
    return await makeApiRequest(requestOptions);
}