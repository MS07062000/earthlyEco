import { Router, Request, Response } from 'express';
import { categoryWithProductsInfo, createOrderInDatabase } from './createOrder';
import { orderPaid } from './orderPaid';
import { getUserOrders } from './getUserOrders';
import { getUserRefunds } from './getUserRefund';
import { redundProcessed } from './redundProcessed';
const router = Router();

router.use('/createOrder', async (req: Request, res: Response) => {
    try {
        const amount: number = req.body?.amount
        const userUID: string = req.body?.userUID;
        const categoryWithProductsAndItsQuantity: categoryWithProductsInfo[] = req.body?.categoryWithProductsAndItsQuantity
        const orderID = await createOrderInDatabase(amount, userUID, categoryWithProductsAndItsQuantity);
        res.status(200).send(orderID);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.use('/orderPaid', async (req: Request, res: Response) => {
    try {
        console.log(JSON.stringify(req.body));
        await orderPaid(req);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.use('/redundProcessed', async (req: Request, res: Response) => {
    try {
        console.log(JSON.stringify(req.body));
        await redundProcessed(req);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.use('/getUserOrders', async(req: Request, res: Response) => {
    try {
        const userUID: string = req.body?.userUID;
        const getUserOrdersResponse = await getUserOrders(userUID);
        res.status(200).send(getUserOrdersResponse);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.use('/getUserRefunds', async(req: Request, res: Response) => {
    try {
        const userUID: string = req.body?.userUID;
        const getUserOrdersResponse = await getUserRefunds(userUID);
        res.status(200).send(getUserOrdersResponse);
    } catch (error) {
        res.status(400).send(error);
    }
});

export { router };