import makeApiRequest from "../../utils/apiUtils";

export const getWishlistProductOfUser = async (userUID:string) => {
    const requestOptions = {
        url: 'getUserWishlist',
        data:{
            userUID,
        },
    };

    return await makeApiRequest(requestOptions);
}