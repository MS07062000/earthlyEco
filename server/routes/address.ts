import { Router } from "express";
import addressController from "../controllers/address";
const router = Router();

router.get("/", addressController.getAddress);
router.delete("/", addressController.deleteAddress);
router.put("/", addressController.editAddress);
router.post("/", addressController.addAddress);

export default router;
