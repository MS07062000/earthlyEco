import { Router, Request, Response } from 'express';
import { categoryWithProductsInfo, createOrderInDatabase } from './createOrder';
import { orderPaid } from './orderPaid';
import { getUserOrders } from './getUserOrders';
import { getUserRefunds } from './getUserRefund';
import { redundProcessed } from './redundProcessed';
import { addressCard } from '../userAddress/addressOperations';
const router = Router();

router.use('/createOrder', async (req: Request, res: Response) => {
    try {
        console.log
        const amount: number = req.body?.amount
        const userUID: string = req.body?.userUID;
        const categoryWithProductsInfo: categoryWithProductsInfo[] = req.body?.categoryWithProductsInfo
        const deliveryAddress: addressCard = req.body?.deliveryAddress
        const orderID = await createOrderInDatabase(amount, userUID, categoryWithProductsInfo,deliveryAddress);
        res.status(200).send(orderID);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

router.use('/orderPaid', async (req: Request, res: Response) => {
    try {
        console.log(JSON.stringify(req.body));
        console.log(JSON.stringify(req.headers));
        const response = await orderPaid(req);
        console.log(response);
        res.status(200).send(response);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
});

router.use('/refundProcessed', async (req: Request, res: Response) => {
    try {
        console.log(JSON.stringify(req.body));
        await redundProcessed(req);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.use('/getUserOrders', async (req: Request, res: Response) => {
    try {
        const userUID: string = req.body?.userUID;
        const getUserOrdersResponse = await getUserOrders(userUID);
        res.status(200).send(getUserOrdersResponse);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.use('/getUserRefunds', async (req: Request, res: Response) => {
    try {
        const userUID: string = req.body?.userUID;
        const getUserOrdersResponse = await getUserRefunds(userUID);
        res.status(200).send(getUserOrdersResponse);
    } catch (error) {
        res.status(400).send(error);
    }
});

export { router };