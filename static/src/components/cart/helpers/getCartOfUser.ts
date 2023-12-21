import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const getCartOfUser = async (userUID:string) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/getUserCart`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
        },
        origin: ORIGIN,
    };
    
    const getCartOfUserResponse=await axios.request(requestOptions);
    return getCartOfUserResponse.data;
}