import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const getUserWishlistWithProductDetails = async (userUID:string) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/getUserWishlistWithProductDetails`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
        },
        origin: ORIGIN,
    };
    
    const getUserWishlistWithProductDetailsResponse=await axios.request(requestOptions);
    return getUserWishlistWithProductDetailsResponse.data;
}