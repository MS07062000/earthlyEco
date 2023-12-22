import { Router, Request, Response } from 'express';
import { getCategoriesAndProducts } from './getCategoriesAndProducts';
const router = Router();

router.post('/getCategoriesAndProducts', async (req: Request, res: Response) => {
    try {
        const categoriesAndProduct=await getCategoriesAndProducts();
        res.status(200).send(categoriesAndProduct);
    } catch (error) {
        res.sendStatus(400);
    }
});


export { router };
