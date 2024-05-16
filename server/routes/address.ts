import { Router } from "express";
import addressController from "../controllers/address";
const router = Router();

router.get("/", addressController.getAddress);
router.delete("/", addressController.deleteAddress);
router.put("/:addressId", addressController.editAddress);
router.put("/default/:addressId", addressController.editDefaultAddress);
router.post("/", addressController.addAddress);

export default router;
