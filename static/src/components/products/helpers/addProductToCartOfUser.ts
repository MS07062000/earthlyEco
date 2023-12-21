import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const addProductToCartOfUser = async (userUID:string,product:string,quantity:number) => {
    console.log(userUID,product);
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/addToCart`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
            product:product,
            quantity:quantity
        },
        origin: ORIGIN,
    };
    
    await axios.request(requestOptions);
}