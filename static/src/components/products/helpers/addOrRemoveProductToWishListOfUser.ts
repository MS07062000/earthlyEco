import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const addOrRemoveProductToWishListOfUser = async (userUID:string,product:string) => {
    console.log(userUID,product);
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/wishlist`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
            product:product
        },
        origin: ORIGIN,
    };
    
    await axios.request(requestOptions);
}