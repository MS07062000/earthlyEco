import { Router, Request, Response } from "express";
import {
  addAddress,
  addressCard,
  deleteAddress,
  editAddress,
  getAddress,
} from "./addressOperations";
const router = Router();

router.post("/addAddress", async (req: Request, res: Response) => {
  try {
    const userUID: string = req.body?.userUID;
    const address: addressCard = req.body?.address;
    if (userUID && address) {
      await addAddress(userUID, address);
      res.sendStatus(200);
    } else {
      res.status(400).send("Invalid request body");
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post("/editAddress", async (req: Request, res: Response) => {
  try {
    const userUID: string = req.body?.userUID;
    const oldAddress: addressCard = req.body?.oldAddress;
    const newAddress: addressCard = req.body?.newAddress;
    if (userUID && oldAddress && newAddress) {
      await editAddress(userUID, oldAddress, newAddress);
      res.sendStatus(200);
    } else {
      res.status(400).send("Invalid request body");
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post("/deleteAddress", async (req: Request, res: Response) => {
  try {
    const userUID: string = req.body?.userUID;
    const address: addressCard = req.body?.address;
    if (userUID && address) {
      await deleteAddress(userUID, address);
      res.sendStatus(200);
    } else {
      res.status(400).send("Invalid request body");
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

router.post("/getAddress", async (req: Request, res: Response) => {
  try {
    const userUID: string = req.body?.userUID;
    if (userUID) {
      const address = await getAddress(userUID);
      res.status(200).send(address);
    } else {
      res.status(400).send("Invalid request body");
    }
  } catch (error) {
    res.sendStatus(400);
  }
});

export { router };
