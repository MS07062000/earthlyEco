import axios from 'axios';
import { BASEURL, ORIGIN } from '../../../config';


export const getCategories = async () => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/getCategoriesAndProducts`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        origin: ORIGIN,
    };

    const categoriesResponse = (await axios.request(requestOptions));
    return categoriesResponse.data;
}