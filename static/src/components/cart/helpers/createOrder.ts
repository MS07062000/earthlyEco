import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';
import { addressCard } from '../../address/address';
export interface categoryWithProductsInfo{
    category: string,
    products: {
        name: string,
        image: string,
        quantity: number, 
        price: number,
    }[]
}

export const createOrder = async (userUID:string,categoryWithProductsInfo:categoryWithProductsInfo[],amount:number,deliveryAddress:addressCard) => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/createOrder`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data:{
            userUID:userUID,
            categoryWithProductsInfo:categoryWithProductsInfo,
            amount:amount,
            deliveryAddress:deliveryAddress
        },
        origin: ORIGIN,
    };
    
    const response=await axios.request(requestOptions);
    return response.data;
}