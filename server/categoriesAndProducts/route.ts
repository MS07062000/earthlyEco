import { Router, Request, Response } from 'express';
import { getCategories, getProducts } from './getCategoriesAndProducts';
const router = Router();

router.post('/getCategories', async (req: Request, res: Response) => {
    try {
        const categories=await getCategories();
        res.status(200).send(categories);
    } catch (error) {
        res.sendStatus(400);
    }
});

router.post('/getProducts', async (req: Request, res: Response) => {
    try {
        const products=await getProducts(req.body.category);
        res.status(200).send(products);
    } catch (error) {
        res.sendStatus(400);
    }
});


export { router };
