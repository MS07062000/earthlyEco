import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';

export const getOrderProcessed = async (userUID:string) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/getUserOrders`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
        },
        origin: ORIGIN,
    };
    
    const response=await axios.request(requestOptions);
    return response.data;
}

