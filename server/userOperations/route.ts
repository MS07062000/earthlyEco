import { Router, Request, Response} from 'express';
import { getProductDetailsOfWishlistProducts, getUserWishlist, wishlist } from './wishlistOperations';
import { getCartOfUserWithProductDetails,addProductToCart,removeFromCart, clearCartOfUser } from './cartOperations';
const router = Router();

router.post('/addToCart', async (req: Request, res: Response) => {
    try {
        const userUID = req.body?.userUID;
        const product = req.body?.product;
        const quantity = req.body?.quantity;

        if (userUID && product && quantity) {
            await addProductToCart(userUID, product, quantity);
            res.sendStatus(200);
        } else {
           res.status(400).send('Invalid request body');
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post('/removeFromCart', async (req: Request, res: Response) => {
    try {
        const userUID = req.body?.userUID;
        const product = req.body?.product;
        const quantity = req.body?.quantity;

        if (userUID && product && quantity) {
            await removeFromCart(userUID, product, quantity);
            res.sendStatus(200);
        } else {
           res.status(400).send('Invalid request body');
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post('/getUserCart', async (req: Request, res: Response) => {
    try {
        const userUID = req.body?.userUID;

        if (userUID) {
            const userCartInfo = await getCartOfUserWithProductDetails(userUID);
            res.status(200).send(userCartInfo);
        } else {
            res.status(400).send('Invalid request body');
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post('/clearCartOfUser', async (req: Request, res: Response) => {
    try {
        const userUID = req.body?.userUID;

        if (userUID) {
            await clearCartOfUser(userUID);
            res.sendStatus(200);
        } else {
           res.status(400).send('Invalid request body');
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post('/wishlist', async (req: Request, res: Response) => {
    try {
        const userUID = req.body?.userUID;
        const product = req.body?.product;

        if (userUID && product) {
            await wishlist(userUID, product);
            res.sendStatus(200);
        } else {
            res.status(400).send('Invalid request body');
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post('/getUserWishlist', async (req: Request, res: Response) => {
    try {
        const userUID = req.body?.userUID;
        if (userUID.length>0) {
            await getProductDetailsOfWishlistProducts(userUID);
            const userWishlistInfo = await getUserWishlist(userUID);
            res.status(200).send(userWishlistInfo);
        } else {
            res.status(400).send('Invalid request body');
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post('/getUserWishlistWithProductDetails', async (req: Request, res: Response) => {
    try {
        const userUID = req.body?.userUID;
        if (userUID.length>0) {
            const userWishlistWithProductDetails = await getProductDetailsOfWishlistProducts(userUID);
            res.status(200).send(userWishlistWithProductDetails);
        } else {
            res.status(400).send('Invalid request body');
        }
    } catch (error) {
        res.sendStatus(400);
    }
});

export { router };
