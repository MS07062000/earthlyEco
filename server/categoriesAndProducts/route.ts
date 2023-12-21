import { Router, request, response } from 'express';
import { getCategoriesAndProducts } from './getCategoriesAndProducts';
const router = Router();

router.post('/getCategoriesAndProducts', async (req: typeof request, res: typeof response) => {
    try {
        const categoriesAndProduct=await getCategoriesAndProducts();
        res.status(200).send(categoriesAndProduct);
    } catch (error) {
        res.sendStatus(400);
    }
});


export { router };
