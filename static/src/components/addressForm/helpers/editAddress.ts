import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';
import { addressCard } from '../../address/address';


export const editAddress = async (userUID:string,oldAddress:addressCard,newAddress:addressCard) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/editAddress`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
            oldAddress:oldAddress,
            newAddress:newAddress,
        },
        origin: ORIGIN,
    };
    
    await axios.request(requestOptions);
}