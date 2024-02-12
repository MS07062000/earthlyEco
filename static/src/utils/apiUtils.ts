import axios from 'axios';
import { BASEURL, ORIGIN } from '../config';

interface RequestOptions {
    url: string;
    data?: any;
}

const makeApiRequest = async ({ url, data }: RequestOptions): Promise<any> => {
    const requestOptions = {
        method: 'post',
        url: `${BASEURL}/${url}`,
        headers: {
            'Content-Type': 'application/json; charset=UTF-8',
        },
        data: data,
        origin: ORIGIN,
    };

    const response = await axios.request(requestOptions);
    return response.data ?? undefined;
};

export default makeApiRequest;
