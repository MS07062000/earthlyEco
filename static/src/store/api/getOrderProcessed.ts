import makeApiRequest from '../../utils/apiUtils';

export const getOrderProcessed = async (userUID:string) => {
    const requestOptions = {
        url: 'getUserOrders',
        data:{
            userUID,
        },
    };
    
    return await makeApiRequest(requestOptions)
}

