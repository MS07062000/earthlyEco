import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const clearCartOfUser = async (userUID:string) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/clearCartOfUser`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
        },
        origin: ORIGIN,
    };
    
    await axios.request(requestOptions);
}