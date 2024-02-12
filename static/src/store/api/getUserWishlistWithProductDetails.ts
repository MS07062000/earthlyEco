import makeApiRequest from "../../utils/apiUtils";

export const getUserWishlistWithProductDetails = async (userUID:string) => {
    const requestOptions = {
        url: 'getUserWishlistWithProductDetails',
        data:{
            userUID,
        },
    };

    return await makeApiRequest(requestOptions);
}