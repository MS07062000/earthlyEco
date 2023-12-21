import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const getWishlistProductOfUser = async (userUID:string) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/getUserWishlist`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
        },
        origin: ORIGIN,
    };
    
    const getWishlistProductOfUserResponse=await axios.request(requestOptions);
    return getWishlistProductOfUserResponse.data;
}