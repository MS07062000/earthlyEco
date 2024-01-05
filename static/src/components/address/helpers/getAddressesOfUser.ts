import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const getAddressesOfUser = async (userUID:string) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/getAddress`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
        },
        origin: ORIGIN,
    };
    
    const getAddressesOfUserResponse=await axios.request(requestOptions);
    return getAddressesOfUserResponse.data;
}