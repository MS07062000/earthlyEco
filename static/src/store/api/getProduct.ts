import makeApiRequest from "../../utils/apiUtils";

export const getProducts = async (category: string) => {
    const requestOptions = {
        url: 'getProducts',
        data: {
            category
        },
    };

    return await makeApiRequest(requestOptions);
}