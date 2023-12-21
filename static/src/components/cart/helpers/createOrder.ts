import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';
export interface categoryWithProductsInfo{
    category: string,
    products: {
        name: string,
        image: string,
        quantity: number, 
    }[]
}

export const createOrder = async (userUID:string,categoryWithProductsInfo:categoryWithProductsInfo[]) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/createOrder`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
            categoryWithProductsInfo:categoryWithProductsInfo,
        },
        origin: ORIGIN,
    };
    
    const response=await axios.request(requestOptions);
    return response.data;
}