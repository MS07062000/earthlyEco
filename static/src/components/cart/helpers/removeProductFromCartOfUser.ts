import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const removeProductFromCartOfUser = async (userUID:string,product:string,quantity:number) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/removeFromCart`,
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